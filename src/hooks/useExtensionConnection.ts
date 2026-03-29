import { useCallback, useEffect, useState } from "react";
import { useDesktopApiOptional } from "./useDesktopApi";
import { EXTENSION_STATUS_POLL_MS } from "@/lib/constants";

export const useExtensionConnection = () => {
  const [hasExtensionIds, setHasExtensionIds] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const desktopApi = useDesktopApiOptional();

  const checkExtensionConnection = useCallback(async () => {
    if (!desktopApi?.getExtensionIds) {
      setHasExtensionIds(false);
      return;
    }

    setIsChecking(true);

    try {
      const result = await desktopApi.getExtensionIds();
      setHasExtensionIds(Array.isArray(result.ids) && result.ids.length > 0);
    } catch {
      setHasExtensionIds(false);
    } finally {
      setIsChecking(false);
    }
  }, [desktopApi]);

  useEffect(() => {
    void checkExtensionConnection();

    const pollInterval = setInterval(() => {
      void checkExtensionConnection();
    }, EXTENSION_STATUS_POLL_MS);

    return () => clearInterval(pollInterval);
  }, [checkExtensionConnection]);

  return {
    hasExtensionIds,
    isChecking,
    checkExtensionConnection,
  };
};
