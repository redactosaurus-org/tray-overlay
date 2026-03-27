export interface TrayState {
  protectionEnabled: boolean;
  serviceEnabled: boolean;
  isPaused: boolean;
  remainingSeconds: number;
  domains: string[];
}

export interface ExtensionStatus {
  ok: boolean;
  state: "connected" | "disconnected";
  message?: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  error?: string;
  [key: string]: any;
}

export interface DesktopApi {
  tray?: {
    getState: () => Promise<TrayState & ApiResponse>;
    setProtectionEnabled: (
      enabled: boolean,
    ) => Promise<TrayState & ApiResponse>;
    setPause: (minutes: number) => Promise<TrayState & ApiResponse>;
    clearPause: () => Promise<TrayState & ApiResponse>;
    openMainApp: () => Promise<void>;
    onStateChanged: (callback: (state: TrayState) => void) => () => void;
  };
  getProtectedDomains?: () => Promise<{ domains: string[] } & ApiResponse>;
  saveProtectedDomains?: (
    domains: string[],
  ) => Promise<{ domains: string[] } & ApiResponse>;
  getExtensionConnectionStatus?: () => Promise<ExtensionStatus>;
}
