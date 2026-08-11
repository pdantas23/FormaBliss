// ─── Design System Forma Eventos — Teal Ação, Purple Identidade ──────────────
//
// Tokens extraídos do painel comercial original (a tabela de leads), agora
// compartilhados entre a página, o quadro Kanban e o card. Mudou aqui, mudou
// no painel inteiro.
//
// Não confundir com a paleta Pearl & Gold do site público (index.css / tailwind
// config): o site vende, o painel opera. São dois sistemas convivendo de
// propósito.

import type { LeadEstagio, TipoEvento } from "@shared/const";

export const COLORS = {
  BG: "#FFFFFF",                    // Fundo branco
  SURFACE: "#FAFAFA",               // Fundo das colunas do quadro
  TEAL: "#26C2B9",                  // Cor de ação/hover/destaque
  PURPLE: "#3D2880",                // Cor de texto/títulos
  TEXT_PRIMARY: "#1F2937",          // Cinza escuro para texto
  TEXT_SECONDARY: "rgba(31, 41, 55, 0.70)",
  TEXT_MUTED: "rgba(31, 41, 55, 0.50)",
  BORDER_LIGHT: "#E5E7EB",          // Cinza claro para bordas
  SHADOW: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  SHADOW_CARD_HOVER: "0 4px 12px rgba(38, 194, 185, 0.15), 0 2px 4px rgba(0, 0, 0, 0.06)",
};

// ─── Cor por tipo de evento ──────────────────────────────────────────────────
export const TAG_STYLES: Record<TipoEvento, { bg: string; text: string; label: string }> = {
  formatura:   { bg: `rgba(96, 25, 210, 0.08)`,  text: "#6019D2", label: "Formatura" },
  corporativo: { bg: `rgba(38, 194, 185, 0.08)`, text: "#26C2B9", label: "Corporativo" },
  celebracao:  { bg: `rgba(217, 119, 6, 0.08)`,  text: "#D97706", label: "Celebração" },
  outros:      { bg: `rgba(107, 114, 128, 0.08)`, text: "#6B7280", label: "Outros" },
};

// ─── Cor por estágio ─────────────────────────────────────────────────────────
// `text` é a cor sólida: vira a bolinha e a barra de topo da coluna no Kanban.
// A semântica é fixa — verde só fecha negócio, vermelho só perde.
export const ESTAGIO_COLORS: Record<LeadEstagio, { bg: string; text: string }> = {
  novo:             { bg: `rgba(38, 194, 185, 0.08)`, text: "#26C2B9" },
  em_contato:       { bg: `rgba(96, 25, 210, 0.08)`,  text: "#6019D2" },
  proposta_enviada: { bg: `rgba(217, 119, 6, 0.08)`,  text: "#D97706" },
  fechado:          { bg: `rgba(34, 197, 94, 0.08)`,  text: "#22C55E" },
  perdido:          { bg: `rgba(239, 68, 68, 0.08)`,  text: "#EF4444" },
};

// ─── Formatadores ────────────────────────────────────────────────────────────

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

/** "hoje", "ontem", "3 d" — idade do lead, o dado que importa no quadro. */
export function idadeDoLead(iso: string): string {
  const criado = new Date(iso);
  const hoje = new Date();
  criado.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);

  const dias = Math.round((hoje.getTime() - criado.getTime()) / 86_400_000);

  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 30) return `${dias} d`;
  return `${Math.floor(dias / 30)} m`;
}

export function cleanPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
}
