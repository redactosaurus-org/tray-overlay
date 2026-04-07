import { renderHook, waitFor } from "@testing-library/react";
import { useDesktopApi, useDesktopApiOptional } from "@/hooks/useDesktopApi";

describe("useDesktopApi", () => {
  beforeEach(() => {
    delete (window as any).desktopApi;
  });

  it("returns null when desktopApi is unavailable", () => {
    const { result } = renderHook(() => useDesktopApi());
    expect(result.current).toBeNull();
  });

  it("reads desktopApi from window when available", async () => {
    const api = { getNativeHostStatus: jest.fn() };
    (window as any).desktopApi = api;

    const { result } = renderHook(() => useDesktopApi());
    await waitFor(() => expect(result.current).toBe(api));
  });

  it("useDesktopApiOptional returns empty object when unavailable", () => {
    const { result } = renderHook(() => useDesktopApiOptional());
    expect(result.current).toEqual({});
  });

  it("useDesktopApiOptional returns desktopApi when available", () => {
    const api = { getExtensionConnectionStatus: jest.fn() };
    (window as any).desktopApi = api;

    const { result } = renderHook(() => useDesktopApiOptional());
    expect(result.current).toBe(api);
  });
});
