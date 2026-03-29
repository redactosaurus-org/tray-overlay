import { useCallback, useEffect, useState } from "react";
import { useDesktopApiOptional } from "./useDesktopApi";
import { EXTENSION_STATUS_POLL_MS } from "@/lib/constants";

export interface NativeHostStatus {
  ok: boolean;
  isRunning: boolean;
  message?: string;
  error?: string;
}

export const useNativeHostStatus = () => {
  const [status, setStatus] = useState<NativeHostStatus>({
    ok: false,
    isRunning: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const desktopApi = useDesktopApiOptional();

  const refreshStatus = useCallback(async () => {
    if (!desktopApi?.getNativeHostStatus) {
      setStatus({ ok: false, isRunning: false });
      return;
    }

    setIsChecking(true);

    try {
      const result = await desktopApi.getNativeHostStatus();
      setStatus(result);
    } catch {
      setStatus({ ok: false, isRunning: false });
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
