/**
 * Money utilities — all amounts stored as integer paise (1 INR = 100 paise).
 * Never use floats for money.
 */

/** Convert rupees (number) to integer paise. */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/** Convert integer paise to rupees (number). */
export function fromPaise(paise: number): number {
  return paise / 100;
}

/**
 * Format integer paise as an INR string, e.g. 12345 → "₹123.45".
 * Uses Indian grouping: 1,23,456.78
 */
export function formatINR(paise: number): string {
  const rupees = fromPaise(paise);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/** Add two paise amounts safely (integer addition). */
export function addPaise(a: number, b: number): number {
  return a + b;
}

/** Subtract two paise amounts safely (integer subtraction). */
export function subtractPaise(a: number, b: number): number {
  return a - b;
}

/** Multiply paise by a quantity (e.g. pieces × rate). */
export function multiplyPaise(paise: number, quantity: number): number {
  return Math.round(paise * quantity);
}
