import { useCallback, useState } from "react";
import { useDesktopApiOptional } from "./useDesktopApi";
import { normalizeDomain, normalizeDomainList } from "@/lib/utils";

interface DomainFeedback {
  message: string;
  tone: "idle" | "error" | "success";
}

export const useDomains = (onDomainsChange?: (domains: string[]) => void) => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<DomainFeedback>({
    message: "",
    tone: "idle",
  });
  const desktopApi = useDesktopApiOptional();

  const setFeedbackWithTimeout = useCallback(
    (
      message: string,
      tone: DomainFeedback["tone"] = "idle",
      autoClose = false,
    ) => {
      setFeedback({ message, tone });
      if (autoClose && message) {
        const timer = setTimeout(
          () => setFeedback({ message: "", tone: "idle" }),
          3000,
        );
        return () => clearTimeout(timer);
      }
    },
    [],
  );

  const refreshDomains = useCallback(
    async (silent = false) => {
      if (!desktopApi?.getProtectedDomains) {
        if (!silent) {
          setFeedbackWithTimeout(
            "Desktop API unavailable. Could not load domains.",
            "error",
          );
        }
        return;
      }

      try {
        const response = await desktopApi.getProtectedDomains();
        if (!response?.ok) {
          throw new Error(response?.error || "Failed to load domains.");
        }

        const normalizedDomains = normalizeDomainList(response.domains);
        if (normalizedDomains.length === 0) {
          throw new Error("No valid domains returned.");
        }

        setDomains(normalizedDomains);
        if (!silent) {
          setFeedbackWithTimeout("");
        }
      } catch (error) {
        if (!silent) {
          setFeedbackWithTimeout(
            error instanceof Error ? error.message : String(error),
            "error",
          );
        }
      }
    },
    [desktopApi, setFeedbackWithTimeout],
  );

  const persistDomains = useCallback(
    async (nextDomains: string[], successMessage: string) => {
      const normalizedDomains = normalizeDomainList(nextDomains);
      if (normalizedDomains.length === 0) {
        setFeedbackWithTimeout(
          "At least one valid domain is required.",
          "error",
        );
        return false;
      }

      if (!desktopApi?.saveProtectedDomains) {
        setFeedbackWithTimeout(
          "Desktop API unavailable. Could not save domains.",
          "error",
        );
        return false;
      }

      setIsLoading(true);

      try {
        const response =
          await desktopApi.saveProtectedDomains(normalizedDomains);
        if (!response?.ok) {
          throw new Error(response?.error || "Failed to save domains.");
        }

        const savedDomains = normalizeDomainList(response.domains);
        if (savedDomains.length === 0) {
          throw new Error("Native host rejected the domain list.");
        }

        setDomains(savedDomains);
        setFeedbackWithTimeout(
          successMessage || "Domains updated.",
          "success",
          true,
        );
        onDomainsChange?.(savedDomains);
        return true;
      } catch (error) {
        setFeedbackWithTimeout(
          error instanceof Error ? error.message : String(error),
          "error",
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [desktopApi, setFeedbackWithTimeout, onDomainsChange],
  );

  const addDomain = useCallback(
    async (domain: string) => {
      const normalized = normalizeDomain(domain);
      if (!normalized) {
        setFeedbackWithTimeout(
          "Enter a valid domain like chatgpt.com.",
          "error",
        );
        return false;
      }

      if (domains.includes(normalized)) {
        setFeedbackWithTimeout(`Domain already exists: ${normalized}`, "error");
        return false;
      }

      return persistDomains([...domains, normalized], "Domain added.");
    },
    [domains, persistDomains, setFeedbackWithTimeout],
  );

  const updateDomain = useCallback(
    async (index: number, domain: string) => {
      const normalized = normalizeDomain(domain);
      if (!normalized) {
        setFeedbackWithTimeout(
          "Enter a valid domain like chatgpt.com.",
          "error",
        );
        return false;
      }

      const duplicate = domains.some((d, i) => d === normalized && i !== index);
      if (duplicate) {
        setFeedbackWithTimeout(`Domain already exists: ${normalized}`, "error");
        return false;
      }

      const nextDomains = domains.map((d, i) => (i === index ? normalized : d));
      return persistDomains(nextDomains, "Domain updated.");
    },
    [domains, persistDomains, setFeedbackWithTimeout],
  );

  const removeDomain = useCallback(
    async (index: number) => {
      if (domains.length <= 1) {
        setFeedbackWithTimeout(
          "At least one domain must remain configured.",
          "error",
        );
        return false;
      }

      const nextDomains = domains.filter((_, i) => i !== index);
      return persistDomains(nextDomains, "Domain removed.");
    },
    [domains, persistDomains, setFeedbackWithTimeout],
  );

  return {
    domains,
    isLoading,
    feedback,
    refreshDomains,
    addDomain,
    updateDomain,
    removeDomain,
    setFeedback,
  };
};
