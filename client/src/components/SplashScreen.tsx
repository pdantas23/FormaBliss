import { useGlobalLoading } from "@/contexts/GlobalLoadingContext";
import { useEffect, useState } from "react";

const COLORS = {
  BG: "#FFFFFF",
  TEAL: "#26C2B9",
};

export default function SplashScreen() {
  const { isLoading } = useGlobalLoading();
  const [isVisible, setIsVisible] = useState(true);

  // CRITICAL: Lock scroll when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // CRITICAL: Unlock immediately and completely when loading ends
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
  }, [isLoading]);

  // Handle fade-out and DOM removal
  const handleTransitionEnd = () => {
    if (!isLoading) {
      // CRITICAL: Remove from DOM completely
      setIsVisible(false);
      // Force unlock
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
  };

  // Don't render at all if not visible
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: COLORS.BG }}
      onTransitionEnd={handleTransitionEnd}
    >
      {/* Logo Only - Breath Animation */}
      <div className="flex flex-col items-center gap-4">
        <style>{`
          @keyframes breath-gentle {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.4;
            }
          }

          .logo-breathing {
            animation: breath-gentle 2.5s ease-in-out infinite;
          }
        `}</style>

        <img
          src="/icon.png"
          alt="Forma Eventos"
          className="logo-breathing w-56 h-24 object-contain"
        />

        <p
          className="text-xs font-light tracking-wider uppercase mt-4"
          style={{ color: COLORS.TEAL }}
        >
          Carregando...
        </p>
      </div>
    </div>
  );
}
