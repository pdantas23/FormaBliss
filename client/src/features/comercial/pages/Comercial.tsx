import DropdownCustom from "@/components/ui/DropdownCustom";
import LeadModal from "@/components/ui/LeadModal";
import { useAuth } from "@/features/auth/useAuth";
import type { Lead, LeadEstagio, TipoEvento } from "@shared/const";
import { TIPO_EVENTO_VALUES } from "@shared/const";
import { Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import NovoLeadDialog from "../components/NovoLeadDialog";
import { COLORS } from "../theme";

// Em dev (VITE_API_URL=""), chamadas relativas são resolvidas pelo proxy Vite.
// Em produção, apontam para o backend Express no EasyPanel.
const API_URL = import.meta.env.VITE_API_URL ?? "";

export default function Comercial() {
  const { logout } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Filtros ───────────────────────────────────────────────────────────────
  // Sem filtro de estágio: no quadro, o estágio JÁ é a coluna. Filtrar por ele
  // esvaziaria quatro das cinco e destruiria a leitura do funil.
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<TipoEvento | "todos">("todos");
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");

  // ── Modais ────────────────────────────────────────────────────────────────
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [novoLeadAberto, setNovoLeadAberto] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterTipo !== "todos") params.append("tipo", filterTipo);
      if (filterDateStart) params.append("data_inicio", filterDateStart);
      if (filterDateEnd) params.append("data_fim", filterDateEnd);

      const url = `${API_URL}/api/leads${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch {
      setError("Erro ao carregar leads.");
    } finally {
      setLoading(false);
    }
  }, [filterTipo, filterDateStart, filterDateEnd]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Busca global (nome ou e-mail) ─────────────────────────────────────────
  const filteredLeads = leads.filter(lead =>
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Indicadores ───────────────────────────────────────────────────────────
  // Contagem por estágio saiu daqui: agora vive no cabeçalho de cada coluna.
  // Sobra o que o quadro NÃO mostra — volume, entrada do dia e conversão.
  const hoje = new Date().toISOString().slice(0, 10);
  const leadsHoje = filteredLeads.filter(l => l.criado_em.slice(0, 10) === hoje).length;
  const emAberto = filteredLeads.filter(l =>
    l.estagio === "novo" || l.estagio === "em_contato" || l.estagio === "proposta_enviada"
  ).length;
  const fechados = filteredLeads.filter(l => l.estagio === "fechado").length;
  const perdidos = filteredLeads.filter(l => l.estagio === "perdido").length;
  const decididos = fechados + perdidos;
  const conversao = decididos > 0 ? Math.round((fechados / decididos) * 100) : null;

  const stats = [
    { label: "Leads Totais", value: String(filteredLeads.length), color: COLORS.PURPLE },
    { label: "Leads Hoje", value: String(leadsHoje), color: COLORS.TEAL },
    { label: "Em Aberto", value: String(emAberto), color: "#D97706" },
    {
      label: "Conversão",
      value: conversao === null ? "—" : `${conversao}%`,
      color: "#22C55E",
      hint: decididos > 0 ? `${fechados} de ${decididos} decididos` : "sem leads decididos",
    },
  ];

  // ── Mover lead de estágio (otimista, com rollback) ────────────────────────
  const handleMover = async (leadId: number, novoEstagio: LeadEstagio) => {
    const anterior = leads.find(l => l.id === leadId)?.estagio;
    if (!anterior || anterior === novoEstagio) return;

    // O card muda de coluna na hora; o servidor confirma depois.
    setLeads(atual => atual.map(l => (l.id === leadId ? { ...l, estagio: novoEstagio } : l)));
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/leads/${leadId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estagio: novoEstagio }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Falhou: o card volta para a coluna de origem, sem estado fantasma.
      setLeads(atual => atual.map(l => (l.id === leadId ? { ...l, estagio: anterior } : l)));
      setError("Não foi possível mover o lead. O card voltou para o estágio anterior.");
    }
  };

  const temFiltro = Boolean(searchTerm || filterTipo !== "todos" || filterDateStart || filterDateEnd);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.BG, color: COLORS.TEXT_PRIMARY }}>

      {/* ── TOPBAR ──────────────────────────────────────────────────────── */}
      <header
        className="flex flex-row items-center justify-between px-6 py-4 border-b"
        style={{ backgroundColor: COLORS.BG, borderColor: COLORS.BORDER_LIGHT }}
      >
        <div />

        <div className="text-center">
          <img
            src="/icon.png"
            alt="Logo Forma Eventos"
            className="w-40 h-10 object-contain"
          />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={logout}
            className="text-xs font-medium px-4 py-2 transition hover:opacity-80 cursor-pointer rounded"
            style={{ backgroundColor: COLORS.TEAL, color: "#FFFFFF", border: "none" }}>
            Sair
          </button>
        </div>
      </header>

      {/* ── CONTEÚDO ──────────────────────────────────────────────────────── */}
      <main className="flex-1 p-6 max-w-[1560px] mx-auto w-full">

        {/* ── INDICADORES ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color, hint }) => (
            <div
              key={label}
              className="p-5 flex flex-col gap-1.5 rounded text-center transition-all cursor-default"
              style={{
                backgroundColor: COLORS.BG,
                border: `1px solid ${COLORS.BORDER_LIGHT}`,
                boxShadow: COLORS.SHADOW,
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLORS.TEXT_MUTED }}>
                {label}
              </p>
              <p
                className="text-2xl font-bold leading-none"
                style={{ fontFamily: "'Poppins', sans-serif", color }}
              >
                {loading ? "—" : value}
              </p>
              <p className="text-[10px] font-light h-3.5" style={{ color: COLORS.TEXT_MUTED }}>
                {!loading && hint ? hint : ""}
              </p>
            </div>
          ))}
        </div>

        {/* ── QUADRO DE LEADS ──────────────────────────────────────────────── */}
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: COLORS.BG, border: `1px solid ${COLORS.BORDER_LIGHT}`, boxShadow: COLORS.SHADOW }}
        >

          {/* ── FILTROS ───────────────────────────────────────────────────── */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.PURPLE }}>
              Filtros
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">

              {/* Busca Global */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: COLORS.TEXT_MUTED }} />
                <input
                  type="text"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-[12px] rounded outline-none transition-colors"
                  style={{
                    backgroundColor: COLORS.BG,
                    border: `1px solid ${COLORS.BORDER_LIGHT}`,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.TEAL; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.BORDER_LIGHT; }}
                />
              </div>

              {/* Tipo de Evento */}
              <DropdownCustom
                value={filterTipo}
                onChange={(v) => setFilterTipo(v as TipoEvento | "todos")}
                options={[
                  { value: "todos", label: "Todos" },
                  ...TIPO_EVENTO_VALUES.map(tipo => ({
                    value: tipo,
                    label: tipo.charAt(0).toUpperCase() + tipo.slice(1),
                  })),
                ]}
                placeholder="Tipo de evento"
              />

              {/* Data Início */}
              <input
                type="date"
                value={filterDateStart}
                onChange={(e) => setFilterDateStart(e.target.value)}
                className="w-full px-3 py-2 text-[12px] rounded outline-none transition-colors"
                style={{
                  backgroundColor: COLORS.BG,
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  color: COLORS.TEXT_PRIMARY,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.TEAL; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.BORDER_LIGHT; }}
              />

              {/* Data Fim */}
              <input
                type="date"
                value={filterDateEnd}
                onChange={(e) => setFilterDateEnd(e.target.value)}
                className="w-full px-3 py-2 text-[12px] rounded outline-none transition-colors"
                style={{
                  backgroundColor: COLORS.BG,
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  color: COLORS.TEXT_PRIMARY,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.TEAL; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.BORDER_LIGHT; }}
              />
            </div>

            {/* Botão Limpar Filtros */}
            {temFiltro && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterTipo("todos");
                  setFilterDateStart("");
                  setFilterDateEnd("");
                }}
                className="mt-3 text-xs font-medium px-3 py-1.5 rounded-full transition hover:opacity-80 flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: `${COLORS.TEAL}20`, color: COLORS.TEAL, border: `1px solid ${COLORS.BORDER_LIGHT}` }}
              >
                <X className="h-3 w-3" />
                Limpar filtros
              </button>
            )}
          </div>

          {/* ── CABEÇALHO DO QUADRO ──────────────────────────────────────── */}
          <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-base font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
              Funil de leads ({filteredLeads.length})
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-light hidden sm:block" style={{ color: COLORS.TEXT_MUTED }}>
                Arraste um card entre as colunas para mudar o estágio
              </p>
              <button
                onClick={() => setNovoLeadAberto(true)}
                className="text-xs font-medium px-3.5 py-2 rounded transition hover:opacity-80 cursor-pointer flex items-center gap-1.5 shrink-0"
                style={{ backgroundColor: COLORS.TEAL, color: "#FFFFFF", border: "none" }}
              >
                <Plus className="h-3.5 w-3.5" />
                Novo lead
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <p
              className="text-xs text-center py-3 px-4 mb-4 rounded"
              style={{ color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.06)" }}
            >
              {error}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-sm text-center py-12 font-light" style={{ color: COLORS.TEXT_MUTED }}>
              Carregando...
            </p>
          )}

          {/* Quadro — segue em pé mesmo com erro de movimentação, para não
              perder o contexto de quem estava trabalhando na tela. */}
          {!loading && (
            <>
              {filteredLeads.length === 0 && (
                <p className="text-sm text-center py-8 font-light" style={{ color: COLORS.TEXT_MUTED }}>
                  Nenhum lead encontrado com os filtros aplicados.
                </p>
              )}
              <KanbanBoard
                leads={filteredLeads}
                onMover={handleMover}
                onAbrir={setSelectedLead}
              />
            </>
          )}
        </div>
      </main>

      {/* Modal de Detalhes do Lead */}
      <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />

      {/* Cadastro manual — recarrega a lista para o card já vir do servidor */}
      <NovoLeadDialog
        aberto={novoLeadAberto}
        onFechar={() => setNovoLeadAberto(false)}
        onCriado={fetchLeads}
      />
    </div>
  );
}
