// ─── Plataforma de origem do lead ────────────────────────────────────────────
//
// `leads_forma.origem` guarda o `referer` cru que o navegador mandou no POST do
// formulário (ver server/routes/leadsRoutes.ts). Este módulo traduz aquela URL
// no lugar de onde a pessoa veio — Instagram, Google, WhatsApp… — para o card
// do Kanban mostrar um ícone em vez de uma URL de 80 caracteres.
//
// A leitura é por HOST, não por string solta na URL: procurar "google" no texto
// inteiro classificaria errado qualquer link com "google" no caminho ou na query.

import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa";
import {
  SiFacebook,
  SiGoogle,
  SiInstagram,
  SiTiktok,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";
import { Globe, Link2 } from "lucide-react";

export type Plataforma = {
  id: string;
  label: string;
  Icon: IconType | typeof Globe;
  cor: string;
};

// Cores de marca. Ficam confinadas ao ícone, num tamanho pequeno: não competem
// com a semântica de cor do painel (verde fecha, vermelho perde).
const PLATAFORMAS = {
  instagram: { id: "instagram", label: "Instagram", Icon: SiInstagram, cor: "#E4405F" },
  facebook:  { id: "facebook",  label: "Facebook",  Icon: SiFacebook,  cor: "#0866FF" },
  whatsapp:  { id: "whatsapp",  label: "WhatsApp",  Icon: SiWhatsapp,  cor: "#25D366" },
  google:    { id: "google",    label: "Google",    Icon: SiGoogle,    cor: "#4285F4" },
  tiktok:    { id: "tiktok",    label: "TikTok",    Icon: SiTiktok,    cor: "#010101" },
  youtube:   { id: "youtube",   label: "YouTube",   Icon: SiYoutube,   cor: "#FF0000" },
  linkedin:  { id: "linkedin",  label: "LinkedIn",  Icon: FaLinkedin,  cor: "#0A66C2" },
  site:      { id: "site",      label: "Site",      Icon: Globe,       cor: "#26C2B9" },
  direto:    { id: "direto",    label: "Direto",    Icon: Link2,       cor: "rgba(31, 41, 55, 0.40)" },
} as const satisfies Record<string, Plataforma>;

/** Sufixos de host por plataforma. Cobrem os domínios de redirecionamento
 *  que Instagram e Facebook usam em link na bio e em anúncio. */
const POR_HOST: Array<[string[], Plataforma]> = [
  [["instagram.com", "cdninstagram.com", "ig.me"],               PLATAFORMAS.instagram],
  [["facebook.com", "fb.com", "fb.me", "messenger.com"],         PLATAFORMAS.facebook],
  [["whatsapp.com", "wa.me", "whatsapp.net"],                    PLATAFORMAS.whatsapp],
  [["google.com", "google.com.br", "googleadservices.com",
    "doubleclick.net", "googlesyndication.com"],                 PLATAFORMAS.google],
  [["tiktok.com"],                                               PLATAFORMAS.tiktok],
  [["youtube.com", "youtu.be"],                                  PLATAFORMAS.youtube],
  [["linkedin.com", "lnkd.in"],                                  PLATAFORMAS.linkedin],
];

/** Hosts do próprio site — origem interna, não é plataforma de terceiro. */
const HOSTS_PROPRIOS = ["formaeventos.com.br", "localhost", "127.0.0.1"];

function combina(host: string, sufixos: readonly string[]): boolean {
  return sufixos.some(s => host === s || host.endsWith(`.${s}`));
}

/**
 * Sem `origem`, o lead chegou sem referer: acesso direto, app que não repassa
 * a origem, ou navegador com o cabeçalho bloqueado. Vira "Direto" — dizer
 * "Site" ali seria inventar um dado que não existe.
 */
export function plataformaDoLead(origem: string | null): Plataforma {
  if (!origem) return PLATAFORMAS.direto;

  let host: string;
  try {
    host = new URL(origem).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return PLATAFORMAS.direto; // Referer malformado não deve derrubar o card.
  }

  // Os subdomínios de saída (l.instagram.com, lm.facebook.com, out.reddit.com)
  // já caem aqui pelo sufixo, sem precisar de lista própria.
  for (const [sufixos, plataforma] of POR_HOST) {
    if (combina(host, sufixos)) return plataforma;
  }

  if (combina(host, HOSTS_PROPRIOS)) return PLATAFORMAS.site;

  // Host desconhecido: ainda é um site externo que gerou o lead. Mostra o
  // domínio como rótulo em vez de esconder a informação atrás de "Outro".
  return { ...PLATAFORMAS.site, id: host, label: host };
}
