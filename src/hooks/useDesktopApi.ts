import { useCallback, useEffect, useState } from "react";
import { DesktopApi } from "@/types";

export const useDesktopApi = (): DesktopApi | null => {
  const [api, setApi] = useState<DesktopApi | null>(null);

  useEffect(() => {
    // Access the desktop API from the window object
    if (typeof window !== "undefined" && (window as any).desktopApi) {
      setApi((window as any).desktopApi);
    }
  }, []);

  return api;
};

export const useDesktopApiOptional = (): DesktopApi => {
  return (
    (typeof window !== "undefined" ? (window as any).desktopApi : null) || {}
  );
};
