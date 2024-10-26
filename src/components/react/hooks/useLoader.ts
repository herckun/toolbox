import { useEffect } from "react";
export const useLoader = (loaderId: string) => {
  useEffect(() => {
    const loader = document.getElementById(`loader-${loaderId}`);
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = "0";
      }, 400);
      setTimeout(() => loader.remove(), 800);
    }
  }, []);
};
