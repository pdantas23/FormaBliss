import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";

const IMAGES = [
  { src: "/photos/IMG_1.webp", alt: "Formatura" },
  { src: "/photos/IMG_2.webp", alt: "Formatura" },
  { src: "/photos/IMG_3.webp", alt: "Formatura" },
  { src: "/photos/IMG_4.webp", alt: "Formatura" },
  { src: "/photos/IMG_5.webp", alt: "Formatura" },
  { src: "/photos/IMG_6.webp", alt: "Formatura" },
  { src: "/photos/IMG_7.webp", alt: "Formatura" },
  { src: "/photos/IMG_8.webp", alt: "Formatura" },
  { src: "/photos/buffet.webp", alt: "Buffet" },
  { src: "/photos/cenario.webp", alt: "Cenário" },
];

const GOLD  = "#C5A059";
const LINEN = "#F4F1EE";

export default function EmblaGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplayRef = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [mainRef, mainApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [autoplayRef.current]
  );

  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    align: "center",
  });

  // main → thumbs sync
  const onSelect = useCallback(() => {
    if (!mainApi || !thumbsApi) return;
    const idx = mainApi.selectedScrollSnap();
    setSelectedIndex(idx);
    thumbsApi.scrollTo(idx);
  }, [mainApi, thumbsApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  // thumb click → main navigate
  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi]
  );

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4"
      style={{ userSelect: "none" }}
    >
      {/* ── Main carousel ─────────────────────────────────────────── */}
      <div
        className="overflow-hidden rounded-2xl"
        ref={mainRef}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className="flex-none"
              style={{ width: "100%", minWidth: 0 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="eager"
                decoding="async"
                draggable={false}
                className="w-full object-cover pointer-events-none block rounded-2xl aspect-[3/4] sm:aspect-video"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Pills indicadoras ──────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-[6px] mt-3">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => onThumbClick(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width:           i === selectedIndex ? "18px" : "5px",
              height:          "5px",
              borderRadius:    "3px",
              backgroundColor: i === selectedIndex ? GOLD : `${GOLD}55`,
              border:          "none",
              padding:         0,
              cursor:          "pointer",
              transition:      "width 280ms ease, background-color 280ms ease",
            }}
          />
        ))}
      </div>

      {/* ── Thumbs carousel ───────────────────────────────────────── */}
      <div
        className="overflow-hidden mt-3"
        ref={thumbsRef}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex gap-[6px]">
          {IMAGES.map((img, i) => {
            const active = i === selectedIndex;
            return (
              <button
                key={i}
                onClick={() => onThumbClick(i)}
                aria-label={`Ver foto ${i + 1}`}
                className="flex-none focus:outline-none"
                style={{
                  /* thumb size: 56px min, grows with viewport up to 68px */
                  width:       "clamp(48px, 7vw, 68px)",
                  padding:     0,
                  border:      `2px solid ${active ? GOLD : "transparent"}`,
                  borderRadius: "6px",
                  overflow:    "hidden",
                  cursor:      "pointer",
                  opacity:     active ? 1 : 0.4,
                  transition:  "opacity 280ms ease, border-color 280ms ease",
                  background:  LINEN,
                  flexShrink:  0,
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  className="w-full object-cover pointer-events-none block"
                  style={{ aspectRatio: "1 / 1" }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
