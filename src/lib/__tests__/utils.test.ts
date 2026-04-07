import {
  clamp,
  formatDuration,
  getSystemTheme,
  normalizeDomain,
  normalizeDomainList,
  validateTheme,
} from "@/lib/utils";

describe("utils", () => {
  it("clamp keeps values within bounds", () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-5, 1, 10)).toBe(1);
    expect(clamp(99, 1, 10)).toBe(10);
  });

  it("normalizeDomain handles protocol, path, port, and casing", () => {
    expect(normalizeDomain(" HTTPS://ChatGPT.com/path ")).toBe("chatgpt.com");
    expect(normalizeDomain("example.com:443")).toBe("example.com");
    expect(normalizeDomain("example.com.")).toBe("example.com");
  });

  it("normalizeDomain rejects invalid values", () => {
    expect(normalizeDomain(123)).toBeNull();
    expect(normalizeDomain("")).toBeNull();
    expect(normalizeDomain(".bad.com")).toBeNull();
    expect(normalizeDomain("bad..com")).toBeNull();
    expect(normalizeDomain("bad_domain.com")).toBeNull();
  });

  it("normalizeDomainList filters invalid values and removes duplicates", () => {
    expect(
      normalizeDomainList([
        "https://chatgpt.com",
        "chatgpt.com",
        "EXAMPLE.com",
        "invalid domain",
      ]),
    ).toEqual(["chatgpt.com", "example.com"]);
  });

  it("formatDuration returns zero-padded hh:mm:ss", () => {
    expect(formatDuration(0)).toBe("00:00:00");
    expect(formatDuration(65)).toBe("00:01:05");
    expect(formatDuration(3661)).toBe("01:01:01");
    expect(formatDuration(-10)).toBe("00:00:00");
    expect(formatDuration(65.9)).toBe("00:01:05");
  });

  it("validateTheme only accepts light or dark", () => {
    expect(validateTheme("light")).toBe(true);
    expect(validateTheme("dark")).toBe(true);
    expect(validateTheme("system")).toBe(false);
    expect(validateTheme(null)).toBe(false);
  });

  it("getSystemTheme uses matchMedia", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: true }),
    });
    expect(getSystemTheme()).toBe("dark");

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: false }),
    });
    expect(getSystemTheme()).toBe("light");
  });
});
