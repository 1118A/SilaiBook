import { describe, it, expect } from "vitest";
import {
  toNativeDigits,
  fromNativeDigits,
  formatCurrency,
  formatPieces,
  formatDate,
} from "./format";

describe("Localized Formatting Utilities", () => {
  it("converts Latin digits to Gujarati and Devanagari numerals accurately", () => {
    expect(toNativeDigits(12345, "gu")).toBe("૧૨૩૪૫");
    expect(toNativeDigits("98760", "gu")).toBe("૯૮૭૬૦");

    expect(toNativeDigits(12345, "hi")).toBe("१२३४५");
    expect(toNativeDigits("98760", "hi")).toBe("९८७६०");

    expect(toNativeDigits(12345, "en")).toBe("12345");
  });

  it("converts native numerals back to standard Latin digits", () => {
    expect(fromNativeDigits("૧૨૩૪૫")).toBe("12345");
    expect(fromNativeDigits("१२३४५")).toBe("12345");
  });

  it("formats integer paise into INR currency with Indian grouping", () => {
    const formattedEn = formatCurrency(12345678, "en"); // ₹1,23,456.78
    expect(formattedEn).toContain("1,23,456.78");

    const formattedGu = formatCurrency(12345678, "gu", { nativeDigits: true });
    expect(formattedGu).toContain("૧,૨૩,૪૫૬.૭૮");

    const formattedHi = formatCurrency(12345678, "hi", { nativeDigits: true });
    expect(formattedHi).toContain("१,२३,४५६.७८");
  });

  it("formats piece counts with Indian grouping", () => {
    expect(formatPieces(5000, "en")).toBe("5,000");
    expect(formatPieces(5000, "gu", { nativeDigits: true })).toBe("૫,૦૦૦");
    expect(formatPieces(5000, "hi", { nativeDigits: true })).toBe("५,०००");
  });

  it("formats dates across locales", () => {
    const date = new Date("2026-09-15T00:00:00Z");
    const enDate = formatDate(date, "en", "short");
    expect(enDate).toBeDefined();
    expect(enDate.length).toBeGreaterThan(0);
  });
});
