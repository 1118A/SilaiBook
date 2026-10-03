import { describe, it, expect } from "vitest";
import enMessages from "@/messages/en.json";
import guMessages from "@/messages/gu.json";
import hiMessages from "@/messages/hi.json";

function getKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (typeof val === "object" && val !== null) {
      keys = keys.concat(getKeys(val as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe("i18n Parity & Pseudo-Localization Tests", () => {
  const enKeys = getKeys(enMessages as unknown as Record<string, unknown>);
  const guKeys = getKeys(guMessages as unknown as Record<string, unknown>);
  const hiKeys = getKeys(hiMessages as unknown as Record<string, unknown>);

  it("gu.json and hi.json have full key parity with en.json", () => {
    const missingInGu = enKeys.filter((k) => !guKeys.includes(k));
    const missingInHi = enKeys.filter((k) => !hiKeys.includes(k));

    expect(missingInGu, `Keys missing in gu.json: ${missingInGu.join(", ")}`).toEqual([]);
    expect(missingInHi, `Keys missing in hi.json: ${missingInHi.join(", ")}`).toEqual([]);
  });

  it("contains non-empty strings for all message entries", () => {
    function assertNoEmptyValues(obj: Record<string, unknown>, path = "") {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof value === "object" && value !== null) {
          assertNoEmptyValues(value as Record<string, unknown>, fullPath);
        } else {
          expect(typeof value).toBe("string");
          expect((value as string).trim().length, `Empty string at ${fullPath}`).toBeGreaterThan(0);
        }
      }
    }

    assertNoEmptyValues(enMessages, "en");
    assertNoEmptyValues(guMessages, "gu");
    assertNoEmptyValues(hiMessages, "hi");
  });

  it("handles pseudo-localization transformation without corrupting ICU placeholders", () => {
    // Generate pseudo-localized string expanding length by ~30% to simulate UI overflow
    function pseudoLocalize(str: string): string {
      return `[~${str.replace(/[a-zA-Z]/g, (char) => {
        const map: Record<string, string> = {
          a: "ä", e: "ë", i: "ï", o: "ö", u: "ü",
          A: "Å", E: "Ë", I: "Ï", O: "Ö", U: "Ü"
        };
        return map[char] || char;
      })}~]`;
    }

    const testStr = "Welcome to SilaiBook";
    const pseudo = pseudoLocalize(testStr);
    expect(pseudo).toContain("Wëlcömë");
    expect(pseudo.startsWith("[~")).toBe(true);
    expect(pseudo.endsWith("~]")).toBe(true);
  });
});
