// ─── LinkBio — Página de Links da Bio ─────────────────────────────────────────
import { gtmPush } from "@/lib/gtm";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  ExternalLink,
  GraduationCap,
  Home,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const FORMA_PURPLE = "#6019D2";
const FORMA_TEAL   = "#26C2B9";
const FORMA_DARK   = "#0B0819";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";

// ─── Links públicos ───────────────────────────────────────────────────────────
const LINKS: { label: string; description: string; href: string; Icon: LucideIcon; external: boolean }[] = [
  { label: "A Forma",              description: "Conheça quem somos e o que fazemos",              href: "/",                   Icon: Home,          external: false },
  { label: "Eventos Corporativos", description: "Confraternizações, convenções e eventos empresariais", href: "/corporativo",         Icon: Briefcase,     external: false },
  { label: "Formaturas",           description: "Celebre sua conquista com exclusividade",          href: "/formatura",          Icon: GraduationCap, external: false },
  { label: "Outras Celebrações",   description: "Casamentos, festas privadas e eventos exclusivos", href: "/eventos-exclusivos", Icon: Sparkles,      external: false },
];

// ─── SVG path da wave (mesmo da Home) ────────────────────────────────────────
const WAVE_PATH = `M0,0 V40 C150,80 350,80 600,50 C850,20 1050,20 1200,50 V0 Z`;
// ─── Lógica ───────────────────────────────────────────────────────────────────
function openWhatsApp() {
  gtmPush("whatsapp_click", { location: "link_bio" });
  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Vim pelo link na bio e gostaria de saber mais sobre a Forma Eventos.")}`,
    "_blank",
    "noopener,noreferrer"
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function LinkBio() {
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [waHovered,   setWaHovered]   = useState(false);

  useEffect(() => {
    gtmPush("page_view", { page: "link_bio" });
  }, []);

  const waDelay = 0.45 + LINKS.length * 0.07 + 0.12;

  return (
    <>
      {/* Keyframes do glow animado */}
      <style>{`
        @keyframes bioGlow  { 0%,100% { transform: translate(0,0) scale(1);     opacity:.55 } 33% { transform: translate(6%,-8%) scale(1.10); opacity:.70 } 66% { transform: translate(-5%,5%) scale(.95); opacity:.50 } }
        @keyframes bioGlow2 { 0%,100% { transform: translate(0,0) scale(1);     opacity:.30 } 50% { transform: translate(-8%,6%) scale(1.15); opacity:.45 } }
      `}</style>

      <div style={{ backgroundColor: FORMA_TEAL }}>

        {/* ══ ZONA 1 — HERO (Roxo) ══════════════════════════════════════════ */}
        <section style={{ backgroundColor: FORMA_PURPLE, position: "relative", overflow: "hidden", paddingBottom: "16px" }}>

          {/* Glows animados */}
          <div aria-hidden="true" style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: "140%", height: "140%", background: `radial-gradient(ellipse 65% 55% at 50% 30%, rgba(38,194,185,0.18) 0%, transparent 65%)`, animation: "bioGlow 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "70%", height: "70%", background: `radial-gradient(ellipse 60% 50% at 60% 60%, rgba(96,25,210,0.6) 0%, transparent 60%)`, animation: "bioGlow2 12s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

          {/* Conteúdo do hero */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 20px 10px" }}>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "88px", height: "88px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)", border: `2px solid ${FORMA_TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px -10px rgba(38,194,185,0.65), 0 0 0 8px rgba(38,194,185,0.06)`, overflow: "hidden", marginBottom: "20px" }}
            >
              <img src="/favicon.png" alt="Forma Eventos" style={{ width: "78%", height: "78%", objectFit: "contain" }} />
            </motion.div>

            <div style={{ height: "20px", width: "100%" }} />

            {/* Nome + localização */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.10, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center", marginBottom: "14px" }}
            >
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(1.4rem, 5vw, 1.8rem)", fontWeight: 700, color: "#FFFFFF", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                Forma Eventos
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.70rem", fontWeight: 400, color: FORMA_TEAL, margin: "6px 0 0", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Teresina · Piauí
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.80rem, 2.5vw, 0.88rem)", color: "white", textAlign: "center", maxWidth: "280px", lineHeight: 1.60, margin: 0 }}
            >
              Transformamos eventos em{" "}
              <span style={{ color: "rgba(255,255,255,0.90)", fontWeight: 400 }}>experiências inesquecíveis.</span>
            </motion.p>

          </div>
        </section>

        {/* ══ WAVE: Roxo → Ciano ════════════════════════════════════════════ */}
        <div aria-hidden="true" style={{ marginTop: "-1px", marginBottom: "-1px", backgroundColor: FORMA_TEAL, overflow: "hidden", lineHeight: 0, transform: "translateZ(0)" }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "64px", fill: FORMA_PURPLE }}>
            <path d={WAVE_PATH} />
          </svg>
        </div>

        {/* ══ ZONA 2 — LINKS (Ciano) ════════════════════════════════════════ */}
        <section style={{ backgroundColor: FORMA_TEAL }}>
          <div style={{ maxWidth: "460px", margin: "0 auto", padding: "8px 20px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>

            {/* Divisor "Páginas" */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.30 }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}
            >
              <div style={{ flex: 1, height: "1px", backgroundColor: FORMA_PURPLE}} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.60rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: FORMA_PURPLE }}>Páginas</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: FORMA_PURPLE }} />
            </motion.div>

            {/* Cards de links */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
              {LINKS.map(({ label, description, href, Icon, external }, index) => {
                const hovered = hoveredLink === index;
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.52, delay: 0.45 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a
                      href={href}
                      target={external ? "_blank" : "_self"}
                      rel={external ? "noopener noreferrer" : undefined}
                      onClick={() => gtmPush("link_bio_click", { label, href })}
                      onMouseEnter={() => setHoveredLink(index)}
                      onMouseLeave={() => setHoveredLink(null)}
                      onFocus={() => setHoveredLink(index)}
                      onBlur={() => setHoveredLink(null)}
                      style={{
                        display: "flex", alignItems: "center", gap: "16px", padding: "17px 20px",
                        borderRadius: "14px",
                        backgroundColor: FORMA_PURPLE,
                        border: FORMA_PURPLE,
                        textDecoration: "none", cursor: "pointer", outline: "none",
                        transition: "border-color .25s ease, background-color .25s ease, box-shadow .25s ease, transform .22s ease",
                        boxShadow: hovered ? `0 0 28px -6px rgba(96,25,210,0.50), 0 6px 20px rgba(0,0,0,0.40)` : "0 4px 16px rgba(0,0,0,0.28)",
                        transform: hovered ? "translateY(-2px)" : "translateY(0)",
                      }}
                    >
                      {/* Ícone */}
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(96,25,210,0.20)", border: `1px solid ${hovered ? "rgba(96,25,210,0.45)" : "rgba(255,255,255,0.09)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background-color .25s ease, border-color .25s ease" }}>
                        <Icon size={20} color={ FORMA_TEAL } style={{ transition: "color .25s ease" }} />
                      </div>

                      {/* Texto */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#FFFFFF", margin: 0, lineHeight: 1.2 }}>{label}</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.73rem", fontWeight: 300, color: "white", margin: "4px 0 0", lineHeight: 1.35 }}>{description}</p>
                      </div>

                      {/* Seta */}
                      <div style={{ flexShrink: 0, opacity: hovered ? 1 : 0.22, transition: "opacity .25s ease" }}>
                        {external
                          ? <ExternalLink size={15} color={FORMA_PURPLE} />
                          : <svg viewBox="0 0 16 16" fill="none" stroke={FORMA_PURPLE} strokeWidth={1.6} style={{ width: "14px", height: "14px" }}><path d="M3 8h10M8 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        }
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* Divisor "Contato" */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 + LINKS.length * 0.07 }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", margin: "22px 0 0" }}
            >
              <div style={{ flex: 1, height: "1px", backgroundColor: FORMA_PURPLE }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.60rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: FORMA_PURPLE }}>Contato</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: FORMA_PURPLE }} />
            </motion.div>

            <div style={{ height: "10px", width: "100%" }} />

            {/* Botão WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: waDelay, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", marginTop: "12px" }}
            >
              <button
                onClick={openWhatsApp}
                onMouseEnter={() => setWaHovered(true)}
                onMouseLeave={() => setWaHovered(false)}
                onFocus={() => setWaHovered(true)}
                onBlur={() => setWaHovered(false)}
                aria-label="Falar pelo WhatsApp"
                style={{
                  width: "100%", padding: "17px 24px", borderRadius: "14px", border: "none",
                  backgroundColor: "#25D366", color: "#FFFFFF",
                  fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", outline: "none",
                  boxShadow: waHovered ? "0 12px 32px -6px rgba(37,211,102,0.60)" : "0 6px 20px -4px rgba(37,211,102,0.42)",
                  transform: waHovered ? "translateY(-2px)" : "translateY(0)",
                  transition: "transform .22s ease, box-shadow .22s ease",
                }}
              >
                <MessageCircle size={18} fill="currentColor" />
                Falar com um consultor
              </button>
            </motion.div>

          </div>
        </section>

        <div style={{ height: "20px", width: "100%" }} />

        {/* ══ RODAPÉ (Dark) ═════════════════════════════════════════════════ */}
        <footer
          style={{
            backgroundColor: FORMA_DARK,
            padding: "28px 24px 36px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)" // 60% de opacidade
          }}
        >
          © {new Date().getFullYear()} Forma Eventos · Teresina, PI
        </footer>

      </div>
    </>
  );
}
