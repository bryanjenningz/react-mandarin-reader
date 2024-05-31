import { useEffect } from "react";

export const useServiceWorker = (): void => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/service-worker.mjs");
    }
  }, []);
};
