/**
 * Localization formatting utilities for SilaiBook.
 * Supports English, Gujarati (ગુજરાતી), and Hindi (हिन्दी).
 * Includes Indian numbering, native script numeral conversion, and date formatting.
 */

import { fromPaise } from "./money";

const GUJARATI_DIGITS = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

/**
 * Converts standard Latin ASCII digits (0-9) to native script digits
 * based on locale ('gu' for Gujarati, 'hi' for Devanagari).
 */
export function toNativeDigits(val: string | number, locale: string): string {
  const str = String(val);
  if (locale === "gu") {
    return str.replace(/[0-9]/g, (digit) => GUJARATI_DIGITS[parseInt(digit, 10)]);
  }
  if (locale === "hi") {
    return str.replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[parseInt(digit, 10)]);
  }
  return str;
}

/**
 * Converts native script digits back to standard Latin digits (0-9).
 */
export function fromNativeDigits(str: string): string {
  return str
    .replace(/[૦-૯]/g, (d) => String(GUJARATI_DIGITS.indexOf(d)))
    .replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
}

/**
 * Formats integer paise into localized INR currency with Indian grouping (e.g. ₹1,23,456.78).
 * Optionally converts to native script numerals if requested.
 */
export function formatCurrency(
  paise: number,
  locale: string = "en",
  options?: { nativeDigits?: boolean }
): string {
  const rupees = fromPaise(paise);
  
  const intlLocale = locale === "gu" ? "gu-IN" : locale === "hi" ? "hi-IN" : "en-IN";
  
  const formatted = new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);

  if (options?.nativeDigits) {
    return toNativeDigits(formatted, locale);
  }

  return formatted;
}

/**
 * Formats a piece count number with Indian grouping (e.g. 1,23,456).
 */
export function formatPieces(
  count: number,
  locale: string = "en",
  options?: { nativeDigits?: boolean }
): string {
  const intlLocale = locale === "gu" ? "gu-IN" : locale === "hi" ? "hi-IN" : "en-IN";
  const formatted = new Intl.NumberFormat(intlLocale, {
    maximumFractionDigits: 0,
  }).format(count);

  if (options?.nativeDigits) {
    return toNativeDigits(formatted, locale);
  }

  return formatted;
}

/**
 * Formats an ISO date string (e.g. "2026-09-15") into human-readable localized date.
 */
export function formatDate(
  dateInput: string | Date,
  locale: string = "en",
  style: "short" | "medium" | "long" = "medium"
): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const intlLocale = locale === "gu" ? "gu-IN" : locale === "hi" ? "hi-IN" : "en-IN";

  const dateStyleMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: "2-digit", month: "2-digit", year: "numeric" },
    medium: { day: "numeric", month: "short", year: "numeric" },
    long: { day: "numeric", month: "long", year: "numeric", weekday: "short" },
  };

  return new Intl.DateTimeFormat(intlLocale, dateStyleMap[style]).format(date);
}
