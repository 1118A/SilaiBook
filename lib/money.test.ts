import { describe, it, expect } from "vitest";
import {
  toPaise,
  fromPaise,
  formatINR,
  addPaise,
  subtractPaise,
  multiplyPaise,
} from "./money";

describe("money utilities", () => {
  describe("toPaise", () => {
    it("converts whole rupees to paise", () => {
      expect(toPaise(100)).toBe(10000);
    });

    it("converts fractional rupees to paise", () => {
      expect(toPaise(99.99)).toBe(9999);
    });

    it("handles zero", () => {
      expect(toPaise(0)).toBe(0);
    });

    it("rounds to nearest paise to avoid float issues", () => {
      // 19.99 * 100 might give 1998.9999999... in floats
      expect(toPaise(19.99)).toBe(1999);
    });
  });

  describe("fromPaise", () => {
    it("converts paise to rupees", () => {
      expect(fromPaise(10000)).toBe(100);
    });

    it("converts odd paise", () => {
      expect(fromPaise(9999)).toBe(99.99);
    });
  });

  describe("formatINR", () => {
    it("formats zero paise", () => {
      expect(formatINR(0)).toBe("₹0.00");
    });

    it("formats small amounts", () => {
      expect(formatINR(1234)).toBe("₹12.34");
    });

    it("formats large amounts with Indian grouping", () => {
      // 12345_6789 paise = 1,23,45,67.89 rupees
      const result = formatINR(12345_6789);
      expect(result).toContain("₹");
      expect(result).toContain("12,34,567.89");
    });
  });

  describe("addPaise", () => {
    it("adds two paise amounts", () => {
      expect(addPaise(500, 300)).toBe(800);
    });
  });

  describe("subtractPaise", () => {
    it("subtracts two paise amounts", () => {
      expect(subtractPaise(500, 300)).toBe(200);
    });
  });

  describe("multiplyPaise", () => {
    it("multiplies paise by quantity", () => {
      // 5 pieces × ₹2.50 rate = ₹12.50 = 1250 paise
      expect(multiplyPaise(250, 5)).toBe(1250);
    });

    it("rounds result", () => {
      expect(multiplyPaise(333, 3)).toBe(999);
    });
  });
});
