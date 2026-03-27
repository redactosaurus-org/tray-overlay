import { useCallback, useEffect, useState } from "react";
import { TrayState } from "@/types";
import { useDesktopApiOptional } from "./useDesktopApi";

const initialState: TrayState = {
  protectionEnabled: true,
  serviceEnabled: true,
  isPaused: false,
  remainingSeconds: 0,
  domains: [],
};

export const useTrayState = () => {
  const [state, setState] = useState<TrayState>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const desktopApi = useDesktopApiOptional();

  const refreshState = useCallback(async () => {
    if (!desktopApi?.tray?.getState) {
      return;
    }

    try {
      const response = await desktopApi.tray.getState();
      if (response?.ok) {
        setState((prev) => ({
          ...prev,
          serviceEnabled: response.serviceEnabled !== false,
          protectionEnabled:
            response.protectionEnabled !== false &&
            response.serviceEnabled !== false,
          isPaused: response.isPaused === true,
          remainingSeconds: Number(response.remainingSeconds || 0),
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [desktopApi]);

  const setProtectionEnabled = useCallback(
    async (enabled: boolean) => {
      if (!desktopApi?.tray?.setProtectionEnabled) {
        return;
      }

      const response = await desktopApi.tray.setProtectionEnabled(enabled);
      if (response?.ok) {
        setState((prev) => ({
          ...prev,
          protectionEnabled: response.protectionEnabled !== false,
        }));
      }
      return response;
    },
    [desktopApi],
  );

  const setPause = useCallback(
    async (minutes: number) => {
      if (!desktopApi?.tray?.setPause) {
        return;
      }

      const response = await desktopApi.tray.setPause(minutes);
      if (response?.ok) {
        setState((prev) => ({
          ...prev,
          isPaused: response.isPaused === true,
          remainingSeconds: Number(response.remainingSeconds || 0),
        }));
      }
      return response;
    },
    [desktopApi],
  );

  const clearPause = useCallback(async () => {
    if (!desktopApi?.tray?.clearPause) {
      return;
    }

    const response = await desktopApi.tray.clearPause();
    if (response?.ok) {
      setState((prev) => ({
        ...prev,
        isPaused: response.isPaused === true,
        remainingSeconds: Number(response.remainingSeconds || 0),
      }));
    }
    return response;
  }, [desktopApi]);

  const openMainApp = useCallback(async () => {
    if (!desktopApi?.tray?.openMainApp) {
      return;
    }
    await desktopApi.tray.openMainApp();
  }, [desktopApi]);

  useEffect(() => {
    void refreshState();

    if (!desktopApi?.tray?.onStateChanged) {
      return;
    }

    const unsubscribe = desktopApi.tray.onStateChanged((payload) => {
      setState((prev) => ({
        ...prev,
        protectionEnabled: payload.protectionEnabled !== false,
        serviceEnabled: payload.serviceEnabled !== false,
        isPaused: payload.isPaused === true,
        remainingSeconds: Number(payload.remainingSeconds || 0),
      }));
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [desktopApi, refreshState]);

  return {
    state,
    isLoading,
    refreshState,
    setProtectionEnabled,
    setPause,
    clearPause,
    openMainApp,
  };
};
