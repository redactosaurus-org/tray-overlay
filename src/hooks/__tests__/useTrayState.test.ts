import { act, renderHook, waitFor } from "@testing-library/react";
import { useDesktopApiOptional } from "@/hooks/useDesktopApi";
import { useTrayState } from "@/hooks/useTrayState";

jest.mock("@/hooks/useDesktopApi", () => ({
  useDesktopApiOptional: jest.fn(),
}));

const mockedUseDesktopApiOptional =
  useDesktopApiOptional as jest.MockedFunction<typeof useDesktopApiOptional>;

describe("useTrayState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads tray state on mount and stops loading", async () => {
    const getState = jest.fn().mockResolvedValue({
      ok: true,
      serviceEnabled: true,
      protectionEnabled: true,
      isPaused: false,
      remainingSeconds: 42,
    });
    const onStateChanged = jest.fn().mockReturnValue(jest.fn());

    mockedUseDesktopApiOptional.mockReturnValue({
      tray: {
        getState,
        onStateChanged,
      },
    } as any);

    const { result } = renderHook(() => useTrayState());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.state).toMatchObject({
      serviceEnabled: true,
      protectionEnabled: true,
      isPaused: false,
      remainingSeconds: 42,
    });
    expect(getState).toHaveBeenCalledTimes(1);
    expect(onStateChanged).toHaveBeenCalledTimes(1);
  });

  it("updates state through tray commands", async () => {
    const openMainApp = jest.fn().mockResolvedValue(undefined);
    const getState = jest.fn().mockResolvedValue({
      ok: true,
      serviceEnabled: true,
      protectionEnabled: true,
      isPaused: false,
      remainingSeconds: 0,
    });
    const setProtectionEnabled = jest.fn().mockResolvedValue({
      ok: true,
      protectionEnabled: false,
    });
    const setPause = jest.fn().mockResolvedValue({
      ok: true,
      isPaused: true,
      remainingSeconds: 300,
    });
    const clearPause = jest.fn().mockResolvedValue({
      ok: true,
      isPaused: false,
      remainingSeconds: 0,
    });

    mockedUseDesktopApiOptional.mockReturnValue({
      tray: {
        getState,
        setProtectionEnabled,
        setPause,
        clearPause,
        openMainApp,
        onStateChanged: jest.fn().mockReturnValue(jest.fn()),
      },
    } as any);

    const { result } = renderHook(() => useTrayState());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.setProtectionEnabled(false);
    });
    expect(result.current.state.protectionEnabled).toBe(false);
    expect(setProtectionEnabled).toHaveBeenCalledWith(false);

    await act(async () => {
      await result.current.setPause(5);
    });
    expect(result.current.state.isPaused).toBe(true);
    expect(result.current.state.remainingSeconds).toBe(300);
    expect(setPause).toHaveBeenCalledWith(5);

    await act(async () => {
      await result.current.clearPause();
    });
    expect(result.current.state.isPaused).toBe(false);
    expect(result.current.state.remainingSeconds).toBe(0);
    expect(clearPause).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.openMainApp();
    });
    expect(openMainApp).toHaveBeenCalledTimes(1);
  });

  it("applies onStateChanged payload and unsubscribes on unmount", async () => {
    const unsubscribe = jest.fn();
    let callback: ((state: any) => void) | undefined;

    const onStateChanged = jest.fn().mockImplementation((cb) => {
      callback = cb;
      return unsubscribe;
    });

    mockedUseDesktopApiOptional.mockReturnValue({
      tray: {
        getState: jest.fn().mockResolvedValue({
          ok: true,
          serviceEnabled: true,
          protectionEnabled: true,
          isPaused: false,
          remainingSeconds: 0,
        }),
        onStateChanged,
      },
    } as any);

    const { result, unmount } = renderHook(() => useTrayState());
    await waitFor(() => expect(onStateChanged).toHaveBeenCalledTimes(1));

    act(() => {
      callback?.({
        serviceEnabled: true,
        protectionEnabled: false,
        isPaused: true,
        remainingSeconds: 120,
        domains: [],
      });
    });

    expect(result.current.state).toMatchObject({
      protectionEnabled: false,
      serviceEnabled: true,
      isPaused: true,
      remainingSeconds: 120,
    });

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
