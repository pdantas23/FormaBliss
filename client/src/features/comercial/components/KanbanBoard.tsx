import type { Lead, LeadEstagio } from "@shared/const";
import { LEAD_ESTAGIO_LABELS, LEAD_ESTAGIO_VALUES } from "@shared/const";
import { useState } from "react";
import { COLORS, ESTAGIO_COLORS } from "../theme";
import LeadCard from "./LeadCard";

interface KanbanBoardProps {
  leads: Lead[];
  onMover: (leadId: number, estagio: LeadEstagio) => void;
  onAbrir: (lead: Lead) => void;
}

/**
 * Quadro de leads: uma coluna por estágio, na ordem de LEAD_ESTAGIO_VALUES
 * (que é a ordem do funil no banco). Arrastar entre colunas é o gesto
 * principal; o menu "mover para" dentro do card é a rota alternativa para
 * teclado e toque, onde o drag nativo do HTML5 não existe.
 *
 * Dentro da coluna a ordem é sempre por data (mais recente no topo) — a
 * tabela `leads_forma` não tem coluna de posição, então não há o que salvar
 * numa reordenação manual.
 */
export default function KanbanBoard({ leads, onMover, onAbrir }: KanbanBoardProps) {
  const [arrastandoId, setArrastandoId] = useState<number | null>(null);
  const [colunaSobre, setColunaSobre] = useState<LeadEstagio | null>(null);

  const porEstagio = (estagio: LeadEstagio) =>
    leads
      .filter(l => l.estagio === estagio)
      .sort((a, b) => b.criado_em.localeCompare(a.criado_em));

  const soltar = (e: React.DragEvent, estagio: LeadEstagio) => {
    e.preventDefault();
    setColunaSobre(null);

    const id = Number(e.dataTransfer.getData("text/plain"));
    if (!id) return;

    const lead = leads.find(l => l.id === id);
    if (!lead || lead.estagio === estagio) return; // Soltar na mesma coluna não é movimento.

    onMover(id, estagio);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
      {LEAD_ESTAGIO_VALUES.map(estagio => {
        const cards = porEstagio(estagio);
        const cor = ESTAGIO_COLORS[estagio].text;
        const ativa = colunaSobre === estagio;

        return (
          <section
            key={estagio}
            onDragOver={e => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              if (colunaSobre !== estagio) setColunaSobre(estagio);
            }}
            onDragLeave={e => {
              // `dragleave` também dispara ao passar por cima dos filhos.
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              setColunaSobre(s => (s === estagio ? null : s));
            }}
            onDrop={e => soltar(e, estagio)}
            // `flex-1` com piso de 228px: as cinco colunas cabem inteiras no
            // desktop e só viram rolagem horizontal quando a tela não comporta.
            className="flex flex-col flex-1 min-w-[228px] rounded-xl transition-colors duration-150"
            style={{
              backgroundColor: ativa ? `rgba(38, 194, 185, 0.06)` : COLORS.SURFACE,
              border: ativa
                ? `1px dashed ${COLORS.TEAL}`
                : `1px solid ${COLORS.BORDER_LIGHT}`,
            }}
            aria-label={`Coluna ${LEAD_ESTAGIO_LABELS[estagio]}, ${cards.length} leads`}
          >
            {/* ── Cabeçalho da coluna ──────────────────────────────────────── */}
            <header
              className="px-3 pt-3 pb-2.5"
              style={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}
            >
              <div className="h-[3px] w-8 rounded-full mb-2.5" style={{ backgroundColor: cor }} />
              <div className="flex items-center justify-between gap-2">
                <h3
                  className="text-[10px] font-semibold uppercase tracking-wider truncate"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {LEAD_ESTAGIO_LABELS[estagio]}
                </h3>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: ESTAGIO_COLORS[estagio].bg, color: cor }}
                >
                  {cards.length}
                </span>
              </div>
            </header>

            {/* ── Cards ────────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2 p-2.5 min-h-[220px]">
              {cards.length === 0 ? (
                <p
                  className="text-[11px] font-light text-center py-8 px-2 leading-relaxed"
                  style={{ color: COLORS.TEXT_MUTED }}
                >
                  {ativa ? "Solte o lead aqui" : "Nenhum lead neste estágio"}
                </p>
              ) : (
                cards.map(lead => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    arrastando={arrastandoId === lead.id}
                    onArrastarInicio={l => setArrastandoId(l.id)}
                    onArrastarFim={() => {
                      setArrastandoId(null);
                      setColunaSobre(null);
                    }}
                    onMover={onMover}
                    onAbrir={onAbrir}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
