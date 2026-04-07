import { act, renderHook, waitFor } from "@testing-library/react";
import { EXTENSION_STATUS_POLL_MS } from "@/lib/constants";
import { useDesktopApiOptional } from "@/hooks/useDesktopApi";
import { useNativeHostStatus } from "@/hooks/useNativeHostStatus";

jest.mock("@/hooks/useDesktopApi", () => ({
  useDesktopApiOptional: jest.fn(),
}));

const mockedUseDesktopApiOptional =
  useDesktopApiOptional as jest.MockedFunction<typeof useDesktopApiOptional>;

describe("useNativeHostStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("loads native host status on mount", async () => {
    const getNativeHostStatus = jest
      .fn()
      .mockResolvedValue({ ok: true, isRunning: true, message: "running" });

    mockedUseDesktopApiOptional.mockReturnValue({
      getNativeHostStatus,
    } as any);

    const { result } = renderHook(() => useNativeHostStatus());

    await waitFor(() => {
      expect(result.current.status).toEqual({
        ok: true,
        isRunning: true,
        message: "running",
      });
      expect(result.current.isChecking).toBe(false);
    });
    expect(getNativeHostStatus).toHaveBeenCalledTimes(1);
  });

  it("falls back to stopped status when request fails", async () => {
    const getNativeHostStatus = jest.fn().mockRejectedValue(new Error("boom"));

    mockedUseDesktopApiOptional.mockReturnValue({
      getNativeHostStatus,
    } as any);

    const { result } = renderHook(() => useNativeHostStatus());

    await waitFor(() => {
      expect(result.current.status).toEqual({
        ok: false,
        isRunning: false,
      });
      expect(result.current.isChecking).toBe(false);
    });
  });

  it("polls native host status with the configured interval", async () => {
    jest.useFakeTimers();

    const getNativeHostStatus = jest
      .fn()
      .mockResolvedValue({ ok: true, isRunning: true });
    mockedUseDesktopApiOptional.mockReturnValue({
      getNativeHostStatus,
    } as any);

    const { unmount } = renderHook(() => useNativeHostStatus());
    await act(async () => {});
    expect(getNativeHostStatus).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(EXTENSION_STATUS_POLL_MS);
    });
    expect(getNativeHostStatus).toHaveBeenCalledTimes(2);

    unmount();
  });
});
