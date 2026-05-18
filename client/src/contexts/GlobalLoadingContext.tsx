import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// First 4 slides — prioritize the ones visible on initial render
const PRELOAD_IMAGES = [
  '/photos/IMG_1.webp',
  '/photos/IMG_2.webp',
  '/photos/IMG_3.webp',
  '/photos/IMG_4.webp',
];

interface GlobalLoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  progress: number;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loaded = 0;
    const total = PRELOAD_IMAGES.length;

    const imagePromises = PRELOAD_IMAGES.map(src =>
      new Promise<void>(resolve => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          setProgress(Math.round((loaded / total) * 100));
          resolve();
        };
        img.src = src;
      })
    );

    // Minimum display time so the splash doesn't flash
    const minTimer = new Promise<void>(resolve => setTimeout(resolve, 500));

    Promise.all([...imagePromises, minTimer]).then(() => {
      setProgress(100);
      // Small delay so the bar visually hits 100% before fading
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
        document.body.style.overscrollBehavior = "unset";
        document.documentElement.style.overscrollBehavior = "unset";
      }, 200);
    });
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading, progress }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within GlobalLoadingProvider");
  }
  return context;
}
