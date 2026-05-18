import { useGlobalLoading } from "@/contexts/GlobalLoadingContext";
import { useEffect, useState } from "react";

const COLORS = {
  BG: "#FFFFFF",
  TEAL: "#26C2B9",
  TRACK: "#E8E8E8",
};

export default function SplashScreen() {
  const { isLoading, progress } = useGlobalLoading();
  const [isVisible, setIsVisible] = useState(true);

  // Lock scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
  }, [isLoading]);

  const handleTransitionEnd = () => {
    if (!isLoading) {
      setIsVisible(false);
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: COLORS.BG }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="flex flex-col items-center gap-4">
        <style>{`
          @keyframes breath-gentle {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
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

        {/* Progress bar */}
        <div className="w-44 mt-2 flex flex-col items-center gap-2">
          <div
            className="w-full h-[2px] rounded-full overflow-hidden"
            style={{ backgroundColor: COLORS.TRACK }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: COLORS.TEAL,
                transition: "width 250ms ease-out",
              }}
            />
          </div>

          <p
            className="text-xs font-light tracking-wider uppercase tabular-nums"
            style={{ color: COLORS.TEAL }}
          >
            {progress < 100 ? `${progress}%` : "Pronto"}
          </p>
        </div>
      </div>
    </div>
  );
}
