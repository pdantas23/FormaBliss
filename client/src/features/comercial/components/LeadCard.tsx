import type { Lead, LeadEstagio } from "@shared/const";
import { LEAD_ESTAGIO_LABELS, LEAD_ESTAGIO_VALUES } from "@shared/const";
import { Eye, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { plataformaDoLead } from "../plataformas";
import {
  COLORS,
  ESTAGIO_COLORS,
  TAG_STYLES,
  cleanPhoneForWhatsApp,
  idadeDoLead,
} from "../theme";

interface LeadCardProps {
  lead: Lead;
  arrastando: boolean;
  onArrastarInicio: (lead: Lead) => void;
  onArrastarFim: () => void;
  onMover: (leadId: number, estagio: LeadEstagio) => void;
  onAbrir: (lead: Lead) => void;
}

export default function LeadCard({
  lead,
  arrastando,
  onArrastarInicio,
  onArrastarFim,
  onMover,
  onAbrir,
}: LeadCardProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [hover, setHover] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const tipo = TAG_STYLES[lead.tipo_evento] ?? TAG_STYLES.outros;
  const plataforma = plataformaDoLead(lead.origem);

  // Fecha o menu "mover para" ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!menuAberto) return;

    const clicouFora = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuAberto(false);
    };
    const apertouEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAberto(false);
    };

    document.addEventListener("click", clicouFora);
    document.addEventListener("keydown", apertouEsc);
    return () => {
      document.removeEventListener("click", clicouFora);
      document.removeEventListener("keydown", apertouEsc);
    };
  }, [menuAberto]);

  const outrosEstagios = LEAD_ESTAGIO_VALUES.filter(e => e !== lead.estagio);

  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData("text/plain", String(lead.id));
        e.dataTransfer.effectAllowed = "move";
        onArrastarInicio(lead);
      }}
      onDragEnd={onArrastarFim}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-150 select-none"
      style={{
        backgroundColor: COLORS.BG,
        border: `1px solid ${hover ? `rgba(38, 194, 185, 0.45)` : COLORS.BORDER_LIGHT}`,
        boxShadow: hover ? COLORS.SHADOW_CARD_HOVER : COLORS.SHADOW,
        opacity: arrastando ? 0.4 : 1,
      }}
    >
      {/* ── Nome + ações ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p
          className="text-[13px] font-medium leading-snug break-words"
          style={{ color: COLORS.TEXT_PRIMARY }}
          title={lead.email}
        >
          {lead.nome}
        </p>

        <div className="flex items-center gap-0.5 shrink-0">
          {/* Mover sem arrastar — teclado, toque e telas pequenas. */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuAberto(v => !v)}
              className="p-1 rounded transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              style={{ color: COLORS.TEXT_MUTED }}
              title="Mover para outro estágio"
              aria-label={`Mover ${lead.nome} para outro estágio`}
            >
              <MoveRight className="h-3.5 w-3.5" />
            </button>

            {menuAberto && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-lg shadow-xl z-50 overflow-hidden"
                style={{ backgroundColor: COLORS.BG, border: `1px solid ${COLORS.BORDER_LIGHT}` }}
              >
                <p
                  className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider"
                  style={{ color: COLORS.TEXT_MUTED, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}
                >
                  Mover para
                </p>
                {outrosEstagios.map(estagio => (
                  <button
                    key={estagio}
                    onClick={() => {
                      onMover(lead.id, estagio);
                      setMenuAberto(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors hover:bg-black/[0.03] cursor-pointer"
                    style={{ color: ESTAGIO_COLORS[estagio].text }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: ESTAGIO_COLORS[estagio].text }}
                    />
                    {LEAD_ESTAGIO_LABELS[estagio]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onAbrir(lead)}
            className="p-1 rounded transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
            style={{ color: COLORS.TEAL }}
            title="Visualizar detalhes do lead"
            aria-label={`Ver detalhes de ${lead.nome}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Tipo de evento + plataforma de origem ────────────────────────── */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className="inline-block px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider rounded-full whitespace-nowrap"
          style={{ backgroundColor: tipo.bg, color: tipo.text }}
        >
          {tipo.label}
        </span>

        <span
          className="shrink-0 flex items-center"
          title={`Origem: ${plataforma.label}${lead.origem ? ` — ${lead.origem}` : ""}`}
          aria-label={`Origem: ${plataforma.label}`}
        >
          <plataforma.Icon size={13} color={plataforma.cor} aria-hidden />
        </span>
      </div>

      {/* ── Rodapé: contato + idade do lead ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <a
          href={`https://wa.me/${cleanPhoneForWhatsApp(lead.telefone)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          draggable={false}
          className="flex items-center gap-1.5 text-[11px] font-light transition hover:opacity-70 min-w-0"
          style={{ color: COLORS.TEXT_SECONDARY }}
          title="Enviar mensagem via WhatsApp"
        >
          <SiWhatsapp size={13} color="#25D366" className="shrink-0" aria-hidden />
          <span className="truncate">{lead.telefone}</span>
        </a>

        <span
          className="text-[10px] font-light whitespace-nowrap shrink-0"
          style={{ color: COLORS.TEXT_MUTED }}
          title={new Date(lead.criado_em).toLocaleString("pt-BR")}
        >
          {idadeDoLead(lead.criado_em)}
        </span>
      </div>
    </div>
  );
}
