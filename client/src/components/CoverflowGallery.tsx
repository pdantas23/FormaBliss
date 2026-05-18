import "swiper/css";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const IMAGES = [
  { src: "/photos/IMG_1.webp",   alt: "Formatura" },
  { src: "/photos/IMG_2.webp",   alt: "Formatura" },
  { src: "/photos/IMG_3.webp",   alt: "Formatura" },
  { src: "/photos/IMG_4.webp",   alt: "Formatura" },
  { src: "/photos/IMG_5.webp",   alt: "Formatura" },
  { src: "/photos/IMG_6.webp",   alt: "Formatura" },
  { src: "/photos/IMG_7.webp",   alt: "Formatura" },
  { src: "/photos/IMG_8.webp",   alt: "Formatura" },
  { src: "/photos/buffet.webp",  alt: "Buffet" },
  { src: "/photos/cenario.webp", alt: "Cenário" },
];

export default function CoverflowGallery() {
  return (
    <div className="w-full select-none" style={{ touchAction: "pan-y" }}>
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 32,
          stretch: 0,
          depth: 160,
          modifier: 1.2,
          slideShadows: true,
        }}
        autoplay={{
          delay: 3200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        style={{ paddingTop: "24px", paddingBottom: "32px" }}
      >
        {IMAGES.map((img, i) => (
          <SwiperSlide
            key={i}
            style={{ width: "clamp(220px, 38vw, 460px)" }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="w-full object-cover pointer-events-none"
              style={{
                aspectRatio: "3 / 4",
                borderRadius: "12px",
                display: "block",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
