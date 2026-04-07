import { act, renderHook, waitFor } from "@testing-library/react";
import { useDesktopApiOptional } from "@/hooks/useDesktopApi";
import { useDomains } from "@/hooks/useDomains";

jest.mock("@/hooks/useDesktopApi", () => ({
  useDesktopApiOptional: jest.fn(),
}));

const mockedUseDesktopApiOptional =
  useDesktopApiOptional as jest.MockedFunction<typeof useDesktopApiOptional>;

describe("useDomains", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("refreshes domains and normalizes returned values", async () => {
    const getProtectedDomains = jest.fn().mockResolvedValue({
      ok: true,
      domains: [" HTTPS://ChatGPT.com/path ", "chatgpt.com", "example.com:443"],
    });
    mockedUseDesktopApiOptional.mockReturnValue({
      getProtectedDomains,
    } as any);

    const { result } = renderHook(() => useDomains());

    await act(async () => {
      await result.current.refreshDomains();
    });

    expect(result.current.domains).toEqual(["chatgpt.com", "example.com"]);
    expect(result.current.feedback).toEqual({ message: "", tone: "idle" });
  });

  it("shows an error when desktop API is unavailable during refresh", async () => {
    mockedUseDesktopApiOptional.mockReturnValue({} as any);
    const { result } = renderHook(() => useDomains());

    await act(async () => {
      await result.current.refreshDomains();
    });

    expect(result.current.feedback.tone).toBe("error");
    expect(result.current.feedback.message).toMatch(/desktop api unavailable/i);
  });

  it("rejects invalid domains on add", async () => {
    const saveProtectedDomains = jest.fn();
    mockedUseDesktopApiOptional.mockReturnValue({
      saveProtectedDomains,
    } as any);

    const { result } = renderHook(() => useDomains());
    let outcome = false;

    await act(async () => {
      outcome = await result.current.addDomain("bad domain");
    });

    expect(outcome).toBe(false);
    expect(saveProtectedDomains).not.toHaveBeenCalled();
    expect(result.current.feedback.message).toMatch(/enter a valid domain/i);
  });

  it("adds a domain and notifies listeners", async () => {
    const onDomainsChange = jest.fn();
    const saveProtectedDomains = jest.fn().mockResolvedValue({
      ok: true,
      domains: ["chatgpt.com"],
    });
    mockedUseDesktopApiOptional.mockReturnValue({
      saveProtectedDomains,
    } as any);

    const { result } = renderHook(() => useDomains(onDomainsChange));
    let outcome = false;

    await act(async () => {
      outcome = await result.current.addDomain("HTTPS://ChatGPT.com/path");
    });

    expect(outcome).toBe(true);
    expect(saveProtectedDomains).toHaveBeenCalledWith(["chatgpt.com"]);
    expect(result.current.domains).toEqual(["chatgpt.com"]);
    expect(onDomainsChange).toHaveBeenCalledWith(["chatgpt.com"]);
    expect(result.current.feedback.tone).toBe("success");
  });

  it("rejects duplicate updates and prevents removing the last domain", async () => {
    const getProtectedDomains = jest.fn().mockResolvedValue({
      ok: true,
      domains: ["chatgpt.com", "example.com"],
    });
    const saveProtectedDomains = jest
      .fn()
      .mockImplementation(async (domains: string[]) => ({
        ok: true,
        domains,
      }));
    mockedUseDesktopApiOptional.mockReturnValue({
      getProtectedDomains,
      saveProtectedDomains,
    } as any);

    const { result } = renderHook(() => useDomains());

    await act(async () => {
      await result.current.refreshDomains();
    });

    let duplicateOutcome = true;
    await act(async () => {
      duplicateOutcome = await result.current.updateDomain(1, "chatgpt.com");
    });

    expect(duplicateOutcome).toBe(false);
    expect(result.current.feedback.message).toMatch(/already exists/i);

    await act(async () => {
      await result.current.removeDomain(1);
    });
    expect(result.current.domains).toEqual(["chatgpt.com"]);

    let removeLastOutcome = true;
    await act(async () => {
      removeLastOutcome = await result.current.removeDomain(0);
    });

    expect(removeLastOutcome).toBe(false);
    expect(result.current.feedback.message).toMatch(/at least one domain/i);
  });

  it("clears success feedback after timeout", async () => {
    jest.useFakeTimers();

    const saveProtectedDomains = jest.fn().mockResolvedValue({
      ok: true,
      domains: ["chatgpt.com"],
    });
    mockedUseDesktopApiOptional.mockReturnValue({
      saveProtectedDomains,
    } as any);

    const { result } = renderHook(() => useDomains());

    await act(async () => {
      await result.current.addDomain("chatgpt.com");
    });
    expect(result.current.feedback.tone).toBe("success");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(result.current.feedback).toEqual({ message: "", tone: "idle" });
    });
    jest.useRealTimers();
  });
});
