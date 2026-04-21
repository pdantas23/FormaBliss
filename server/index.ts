import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";

import authRouter from "./routes/authRoutes";
import leadsRouter from "./routes/leadsRoutes";

const app = express();

// ─── CORS com Suporte a Múltiplas Origens ─────────────────────────────────
// CORS_ORIGIN deve conter a(s) URL(s) exata(s) do frontend, separadas por vírgula.
// Exemplo Easypanel: CORS_ORIGIN=https://royalhubacademy.com,https://www.royalhubacademy.com
//
// IMPORTANTE: Esta URL deve ser o frontend (Hostinger/Vercel),
//             NÃO a URL do Supabase (que é um serviço separado).
function parseCORSOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN;
  const isProduction = process.env.NODE_ENV === "production";

  if (!raw || raw.trim().length === 0) {
    if (isProduction) {
      console.error("[CORS] ⚠️  CORS_ORIGIN não definido em produção — requisições cross-origin serão bloqueadas!");
      console.error("[CORS]     Configure CORS_ORIGIN no EasyPanel com a URL do seu frontend.");
    } else {
      console.warn("[CORS] CORS_ORIGIN não definido, usando padrão: http://localhost:3000");
    }
    return ["http://localhost:3000"];
  }

  const origins = raw
    .split(",")
    .map(o => o.trim())
    .filter(o => o.length > 0);

  if (origins.length === 0) {
    console.warn("[CORS] CORS_ORIGIN vazio após parsing, usando padrão");
    return ["http://localhost:3000"];
  }

  const validOrigins = origins.filter(origin => {
    try {
      new URL(origin);
      return true;
    } catch (e) {
      console.error(`[CORS] Origem inválida (não é URL): ${origin}`);
      return false;
    }
  });

  if (validOrigins.length === 0) {
    console.error("[CORS] Nenhuma origem válida após validação, usando padrão");
    return ["http://localhost:3000"];
  }

  console.log(`[CORS] Origens permitidas: ${validOrigins.join(", ")}`);
  return validOrigins;
}

const allowedOrigins = parseCORSOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        console.warn(`[CORS] Bloqueado para origem: ${origin}`);
        callback(new Error("Origin não permitido"));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    exposedHeaders: [
      "X-Total-Count",
      "X-Page-Count",
      "Content-Length",
    ],
    maxAge: 86400,
  })
);

// ─── Tratamento de Erros CORS ─────────────────────────────────────────────
app.use((err: any, req: any, res: any, next: any) => {
  if (err.message && err.message.includes("Origin")) {
    console.error(`[CORS ERROR] ${err.message} | Origem: ${req.headers.origin}`);
    return res.status(403).json({ error: "CORS bloqueado", origin: req.headers.origin });
  }
  next(err);
});

// ─── Trust Reverse Proxy (Easypanel) ───────────────────────────────────────
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use("/auth",      authRouter);
app.use("/api/leads", leadsRouter);

// ─── Healthcheck ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true }));

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => {
  console.log(`[forma] servidor na porta ${PORT} | origens: ${allowedOrigins.join(", ")}`);
});
