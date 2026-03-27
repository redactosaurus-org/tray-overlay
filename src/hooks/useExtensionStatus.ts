import { useCallback, useEffect, useState } from "react";
import { ExtensionStatus } from "@/types";
import { useDesktopApiOptional } from "./useDesktopApi";
import { EXTENSION_STATUS_POLL_MS } from "@/lib/constants";

export const useExtensionStatus = () => {
  const [status, setStatus] = useState<ExtensionStatus>({
    ok: false,
    state: "disconnected",
  });
  const [isChecking, setIsChecking] = useState(false);
  const desktopApi = useDesktopApiOptional();

  const refreshStatus = useCallback(async () => {
    if (!desktopApi?.getExtensionConnectionStatus) {
      setStatus({ ok: false, state: "disconnected" });
      return;
    }

    setIsChecking(true);

    try {
      const result = await desktopApi.getExtensionConnectionStatus();
      setStatus(result);
    } catch {
      setStatus({ ok: false, state: "disconnected" });
    } finally {
      setIsChecking(false);
    }
  }, [desktopApi]);

  useEffect(() => {
    void refreshStatus();

    const pollInterval = setInterval(() => {
      void refreshStatus();
    }, EXTENSION_STATUS_POLL_MS);

    return () => clearInterval(pollInterval);
  }, [refreshStatus]);

  return {
    status,
    isChecking,
    refreshStatus,
  };
};
