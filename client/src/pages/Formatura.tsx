import Diferenciais from "@/components/Diferenciais";
import EmblaGallery from "@/components/EmblaGallery";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import Navbar from "@/components/Navbar";
import { gtmPush } from "@/lib/gtm";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Instagram, MessageCircle } from "lucide-react";
import { useEffect } from "react";


const GOLD     = "#C5A059";
const LINEN    = "#F4F1EE";
const CHARCOAL = "#2A2A2A";
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";

export default function Formatura() {
  useEffect(() => {
    gtmPush("page_view", { page: "formatura" });
  }, []);

  const openWA = (location = "unknown") => {
    gtmPush("whatsapp_click", { location, message: "Quero saber mais sobre formaturas!" });
    window.open(
      `https://wa.me/${WHATSAPP}?text=Quero saber mais sobre formaturas!`,
      "_blank"
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: LINEN, color: CHARCOAL }}
    >
      {/* Navbar em tema claro — "Formaturas" em dourado com sublinhado fixo */}
      <Navbar theme="light" />

      {/* ════════════ HERO — PEARL LUXURY ══════════════════════════════════════ */}
      {/* min-h-screen permite que as thumbs respirem sem serem cortadas */}
      <section
        className="relative w-full min-h-screen flex flex-col items-center"
        style={{ backgroundColor: LINEN }}
      >
        {/* ─── Névoa dourada sutil ─── */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(197,160,89,0.07) 0%, transparent 68%)",
          }}
        />

        {/* ─── Título — padding-top limpa a navbar absoluta (~96px) ─── */}
        <div className="relative z-20 pt-24 sm:pt-28 pb-4 px-8 sm:px-20 text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-cormorant tracking-[-0.02em] leading-[0.9] uppercase"
              style={{ fontSize: "clamp(2.6rem, 7vw, 6rem)" }}
            >
              <span
                className="block not-italic font-semibold mb-1"
                style={{ color: CHARCOAL }}
              >
                Suas Conquistas
              </span>
              <span
                className="block italic font-light text-transparent"
                style={{ WebkitTextStroke: `1px ${GOLD}` }}
              >
                são Eternas.
              </span>
            </h1>

            {/* Subtítulo */}
            <p
              className="font-inter font-light mt-5 mx-auto"
              style={{
                fontSize: "clamp(0.78rem, 1.6vw, 1rem)",
                color: "#9A9087",
                letterSpacing: "0.06em",
                lineHeight: 1.75,
                maxWidth: "34rem",
              }}
            >
              Viva a experiência única da sua formatura com a excelência que você merece.
            </p>
          </motion.div>
        </div>

        {/* ─── Carrosel — cresce livremente, empurra o restante para baixo ─── */}
        <div className="relative w-full z-10 pb-10 sm:pb-6">
          <EmblaGallery />
        </div>

        {/* ─── CTAs ─────────────────────────────────────────────────────────── */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-6 pb-10 sm:pb-14">
          {/* Botão 1 — WhatsApp */}
          <button
            onClick={() => openWA("hero_cta")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-8 rounded-full font-inter font-semibold text-[13px] uppercase tracking-[0.18em] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_-8px_rgba(37,211,102,0.35)]"
            style={{
              backgroundColor: "#25D366",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              minWidth: "200px",
            }}
          >
            <MessageCircle size={16} strokeWidth={2.2} />
            Falar no WhatsApp
          </button>

          {/* Botão 2 — Orçamento (outline) */}
          <a
            href="#orcamento"
            onClick={() => gtmPush("cta_click", { cta_label: "Solicitar Orçamento", cta_location: "hero" })}
            className="flex items-center justify-center w-full sm:w-auto h-12 px-8 rounded-full font-inter font-semibold text-[13px] uppercase tracking-[0.18em] transition-all duration-300 hover:scale-[1.03]"
            style={{
              border: `1.5px solid ${GOLD}`,
              color: GOLD,
              textDecoration: "none",
              minWidth: "200px",
              background: "transparent",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = GOLD;
              (e.currentTarget as HTMLElement).style.color = "#1A1A1A";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = GOLD;
            }}
          >
            Solicitar Orçamento
          </a>
        </div>
      </section>

      {/* ─── DIFERENCIAIS ─────────────────────────────────────────────────── */}
      <Diferenciais />

      {/* ════════════ CTA — LEGADO ════════════════════════════════════════════ */}
      <section
        className="flex justify-center relative py-24 sm:py-24 px-8 text-center items-center overflow-hidden"
        style={{ backgroundColor: LINEN }}
      >
        {/* Névoa muito sutil no centro */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(197,160,89,0.05) 0%, transparent 70%)",
          }}
        />

        <FadeInWhenVisible className="relative z-10 max-w-3xl mx-auto" duration={1.1} y={24}>
          {/* --- Título Editorial Emocional --- */}
          <h2
            className="font-serif leading-[1.1] tracking-tight mb-8"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
            }}
          >
            <span 
              className="block font-medium mb-2" 
              style={{ color: CHARCOAL }}
            >
              Seu esforço merece
            </span>
            <span
              className="block italic font-light"
              style={{ color: "#BFA16F" }} // Bronze Champagne: mais sofisticação, menos conflito
            >
              um desfecho à altura.
            </span>
          </h2>

          {/* Divisor dourado */}
          <div
            className="mx-auto mb-8"
            style={{ width: "2rem", height: "1px", backgroundColor: GOLD, opacity: 0.5 }}
          />

          {/* Subtexto */}
          <p
            className="font-inter font-light uppercase mx-auto mb-14"
            style={{
              fontSize: "10px",
              letterSpacing: "0.42em",
              color: "#9A9087",
              maxWidth: "28rem",
              lineHeight: 2,
            }}
          >
            Agende sua consultoria de design de experiência.
          </p>

          {/* ── Botão Liquid Fill ── */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => openWA("cta_iniciar_planejamento")}
              className={[
                "group relative overflow-hidden",
                "h-14 px-14",
                "font-inter font-semibold uppercase tracking-[0.22em] text-[11px]",
                "bg-[#C5A059] text-[#1A1A1A]",
                "border-none cursor-pointer rounded-none",
                "transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "hover:scale-[1.04] hover:shadow-[0_20px_60px_-12px_rgba(197,160,89,0.32)]",
              ].join(" ")}
            >
              <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300">
                Iniciar Planejamento
              </span>
              <span
                className="absolute inset-0 bg-[#1A1A1A] translate-y-full group-hover:translate-y-0 transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <span
                className={[
                  "absolute inset-0 flex items-center justify-center",
                  "font-inter font-semibold uppercase tracking-[0.22em] text-[11px] text-[#C5A059]",
                  "translate-y-full group-hover:translate-y-0",
                  "transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                ].join(" ")}
              >
                Iniciar Planejamento
              </span>
            </button>

            <button
              onClick={() => openWA("cta_consultoria_exclusiva")}
              className="font-inter font-light uppercase transition-colors"
              style={{
                fontSize: "10px",
                letterSpacing: "0.4em",
                color: "#B0A898",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.color = "#B0A898")}
            >
              Consultoria exclusiva via WhatsApp
            </button>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-slate-100"  style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, backgroundColor: ` rgba(0, 0, 0, 0)`}}>
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div className="w-full h-[1px] bg-[#C5A059]/50" />
          {/* Links com Ícones */}
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { 
                label: "Instagram", 
                icon: <Instagram size={18} color="#C5A059" />, 
                href: "https://www.instagram.com/forma.eventos",
                external: true 
              },
              { 
                label: "Corporativo", 
                icon: <Briefcase size={18} color="#C5A059" />, 
                href: "/corporativo", 
                external: false 
              },
              { 
                label: "Formaturas", 
                icon: <GraduationCap size={18} color="#C5A059" />, 
                href: "/formatura", 
                external: false 
              }
            ].map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                target={item.external ? "_blank" : "_self"}
                rel={item.external ? "noopener noreferrer" : ""}
                className="flex items-center gap-2 text-sm font-medium transition-all hover:text-[#C5A059]"
                style={{ color: "#C5A059" }}
              >
                <span className="text-[#C5A059]">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>

          {/* Marca Registrada e Copyright */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs tracking-widest uppercase text-slate-400">
              © {new Date().getFullYear()} Forma Eventos
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
