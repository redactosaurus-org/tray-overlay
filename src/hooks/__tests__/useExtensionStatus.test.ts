import { act, renderHook, waitFor } from "@testing-library/react";
import { EXTENSION_STATUS_POLL_MS } from "@/lib/constants";
import { useDesktopApiOptional } from "@/hooks/useDesktopApi";
import { useExtensionStatus } from "@/hooks/useExtensionStatus";

jest.mock("@/hooks/useDesktopApi", () => ({
  useDesktopApiOptional: jest.fn(),
}));

const mockedUseDesktopApiOptional =
  useDesktopApiOptional as jest.MockedFunction<typeof useDesktopApiOptional>;

describe("useExtensionStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("loads extension status on mount", async () => {
    const getExtensionConnectionStatus = jest
      .fn()
      .mockResolvedValue({ ok: true, state: "connected", message: "ok" });

    mockedUseDesktopApiOptional.mockReturnValue({
      getExtensionConnectionStatus,
    } as any);

    const { result } = renderHook(() => useExtensionStatus());

    await waitFor(() => {
      expect(result.current.status).toEqual({
        ok: true,
        state: "connected",
        message: "ok",
      });
      expect(result.current.isChecking).toBe(false);
    });
    expect(getExtensionConnectionStatus).toHaveBeenCalledTimes(1);
  });

  it("falls back to disconnected when request fails", async () => {
    const getExtensionConnectionStatus = jest
      .fn()
      .mockRejectedValue(new Error("boom"));

    mockedUseDesktopApiOptional.mockReturnValue({
      getExtensionConnectionStatus,
    } as any);

    const { result } = renderHook(() => useExtensionStatus());

    await waitFor(() => {
      expect(result.current.status).toEqual({
        ok: false,
        state: "disconnected",
      });
      expect(result.current.isChecking).toBe(false);
    });
  });

  it("polls status with the configured interval", async () => {
    jest.useFakeTimers();

    const getExtensionConnectionStatus = jest
      .fn()
      .mockResolvedValue({ ok: true, state: "connected" });
    mockedUseDesktopApiOptional.mockReturnValue({
      getExtensionConnectionStatus,
    } as any);

    const { unmount } = renderHook(() => useExtensionStatus());
    await act(async () => {});
    expect(getExtensionConnectionStatus).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(EXTENSION_STATUS_POLL_MS);
    });
    expect(getExtensionConnectionStatus).toHaveBeenCalledTimes(2);

    unmount();
  });
});
