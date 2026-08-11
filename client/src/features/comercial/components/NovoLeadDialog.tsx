import DropdownCustom from "@/components/ui/DropdownCustom";
import type { TipoEvento } from "@shared/const";
import { TIPO_EVENTO_VALUES } from "@shared/const";
import { Loader2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { COLORS, TAG_STYLES } from "../theme";

const API_URL = import.meta.env.VITE_API_URL ?? "";

interface NovoLeadDialogProps {
  aberto: boolean;
  onFechar: () => void;
  /** Chamado só quando o lead entrou de fato, para a página recarregar a lista. */
  onCriado: () => void;
}

const VAZIO = {
  nome: "",
  email: "",
  telefone: "",
  tipo: "formatura" as TipoEvento,
  mensagem: "",
};

/**
 * Cadastro manual de lead pelo time comercial.
 *
 * Grava pelo mesmo `POST /api/leads` que o formulário público usa — não há
 * rota exclusiva do painel. Duas consequências herdadas dessa rota:
 *
 *   1. Ela é limitada a 5 envios por IP a cada 15 min (o rate limit existe para
 *      conter spam no site). O 429 é tratado com mensagem própria aqui.
 *   2. O `origem` é gravado pelo servidor a partir do `referer`, então o lead
 *      nasce apontando para a URL do painel, não para uma plataforma.
 */
export default function NovoLeadDialog({ aberto, onFechar, onCriado }: NovoLeadDialogProps) {
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  // Cada abertura começa limpa — rascunho de um lead não vaza para o próximo.
  useEffect(() => {
    if (aberto) { setForm(VAZIO); setErro(""); setEnviando(false); }
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const fecharComEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onFechar(); };
    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  const alterar = (campo: keyof typeof VAZIO) => (valor: string) =>
    setForm(f => ({ ...f, [campo]: valor }));

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    const nome = form.nome.trim();
    const email = form.email.trim();
    const telefone = form.telefone.trim();

    // As mesmas exigências do servidor, checadas antes para não gastar uma
    // das 5 tentativas do rate limit com um envio que já nasce inválido.
    if (!nome || !email || !telefone) {
      setErro("Nome, e-mail e telefone são obrigatórios.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro("E-mail inválido.");
      return;
    }
    if (telefone.replace(/\D/g, "").length < 10) {
      setErro("Telefone incompleto — inclua o DDD.");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome, email, telefone,
          tipo: form.tipo,
          mensagem: form.mensagem.trim() || null,
        }),
      });

      if (res.status === 429) {
        setErro("Limite de envios atingido (5 a cada 15 min). Aguarde alguns minutos.");
        return;
      }
      if (!res.ok) {
        const corpo = await res.json().catch(() => ({}));
        setErro(corpo.error || "Não foi possível salvar o lead.");
        return;
      }

      onCriado();
      onFechar();
    } catch {
      setErro("Falha de conexão ao salvar o lead.");
    } finally {
      setEnviando(false);
    }
  }

  const estiloCampo = {
    backgroundColor: COLORS.BG,
    border: `1px solid ${COLORS.BORDER_LIGHT}`,
    color: COLORS.TEXT_PRIMARY,
  };

  const aoFocar = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = COLORS.TEAL;
  };
  const aoDesfocar = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = COLORS.BORDER_LIGHT;
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.60)" }}
      onClick={onFechar}
    >
      <div
        className="w-full max-w-md rounded-xl overflow-hidden relative z-[70]"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: COLORS.BG,
          border: `1px solid ${COLORS.BORDER_LIGHT}`,
          boxShadow: `0 0 30px rgba(38, 194, 185, 0.20)`,
        }}
      >
        {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-5"
          style={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}
        >
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase mb-1" style={{ color: COLORS.TEAL }}>
              Cadastro manual
            </p>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.PURPLE }}>
              Novo lead
            </h2>
          </div>
          <button
            onClick={onFechar}
            className="p-1 rounded transition hover:opacity-70 cursor-pointer"
            style={{ color: COLORS.TEXT_MUTED }}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Formulário ────────────────────────────────────────────────── */}
        <form onSubmit={enviar} className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.TEXT_MUTED }}>
              Nome *
            </label>
            <input
              autoFocus
              type="text"
              value={form.nome}
              onChange={e => alterar("nome")(e.target.value)}
              placeholder="Nome de quem procurou"
              className="w-full px-3 py-2 text-[13px] rounded outline-none transition-colors"
              style={estiloCampo} onFocus={aoFocar} onBlur={aoDesfocar}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.TEXT_MUTED }}>
              E-mail *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => alterar("email")(e.target.value)}
              placeholder="nome@email.com"
              className="w-full px-3 py-2 text-[13px] rounded outline-none transition-colors"
              style={estiloCampo} onFocus={aoFocar} onBlur={aoDesfocar}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.TEXT_MUTED }}>
              Telefone *
            </label>
            <input
              type="tel"
              value={form.telefone}
              onChange={e => alterar("telefone")(e.target.value)}
              placeholder="(86) 99999-9999"
              className="w-full px-3 py-2 text-[13px] rounded outline-none transition-colors"
              style={estiloCampo} onFocus={aoFocar} onBlur={aoDesfocar}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.TEXT_MUTED }}>
              Tipo de evento *
            </label>
            <DropdownCustom
              value={form.tipo}
              onChange={v => alterar("tipo")(v)}
              options={TIPO_EVENTO_VALUES.map(tipo => ({
                value: tipo,
                label: TAG_STYLES[tipo].label,
                color: { bg: TAG_STYLES[tipo].bg, text: TAG_STYLES[tipo].text },
              }))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.TEXT_MUTED }}>
              Mensagem
            </label>
            <textarea
              value={form.mensagem}
              onChange={e => alterar("mensagem")(e.target.value)}
              rows={3}
              placeholder="O que a pessoa procura, número de convidados, data..."
              className="w-full px-3 py-2 text-[13px] rounded outline-none transition-colors resize-none"
              style={estiloCampo} onFocus={aoFocar} onBlur={aoDesfocar}
            />
          </div>

          <p className="text-[10px] font-light leading-relaxed" style={{ color: COLORS.TEXT_MUTED }}>
            O lead entra na coluna <strong style={{ fontWeight: 600 }}>Novo</strong>. Arraste depois para o estágio certo.
          </p>

          {erro && (
            <p
              className="text-xs py-2.5 px-3 rounded"
              style={{ color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.06)" }}
            >
              {erro}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 py-2.5 rounded text-xs font-medium transition hover:opacity-80 cursor-pointer"
              style={{ backgroundColor: "transparent", color: COLORS.TEXT_SECONDARY, border: `1px solid ${COLORS.BORDER_LIGHT}` }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 py-2.5 rounded text-xs font-medium transition hover:opacity-80 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: COLORS.TEAL, color: "#FFFFFF", border: "none" }}
            >
              {enviando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {enviando ? "Salvando..." : "Salvar lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
