/**
 * Date utilities — thin wrappers around date-fns, centralised here
 * so the rest of the app imports from one place.
 */

import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

/** Format a date as "dd MMM yyyy", e.g. "02 Oct 2026". */
export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy");
}

/** Format a date as "MMM yyyy", e.g. "Oct 2026". */
export function formatMonth(date: Date): string {
  return format(date, "MMM yyyy");
}

/** Get start-of-month Date for a given date. */
export function monthStart(date: Date): Date {
  return startOfMonth(date);
}

/** Get end-of-month Date for a given date. */
export function monthEnd(date: Date): Date {
  return endOfMonth(date);
}

/** Check if a date falls within a given month (inclusive). */
export function isInMonth(date: Date, monthDate: Date): boolean {
  return isWithinInterval(date, {
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate),
  });
}
