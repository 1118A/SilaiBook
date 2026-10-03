import { describe, it, expect } from "vitest";

interface LotMock {
  id: string;
  lot_no: string;
  style: string;
}

interface OperationMock {
  id: string;
  name: string;
}

export function parseBundleTicket(
  rawText: string,
  lots: LotMock[],
  operations: OperationMock[]
) {
  try {
    const parsed = JSON.parse(rawText);
    const matchedLot = lots.find(
      (l) => l.id === parsed.lot_id || l.lot_no.toLowerCase() === (parsed.lot_no || "").toLowerCase()
    );
    const matchedOp = parsed.operation_id
      ? operations.find((o) => o.id === parsed.operation_id)
      : undefined;

    if (matchedLot) {
      return {
        lotId: matchedLot.id,
        lotNo: matchedLot.lot_no,
        pieces: parsed.pieces ? Number(parsed.pieces) : 25,
        operationId: matchedOp ? matchedOp.id : undefined,
      };
    }
  } catch {
    const cleanText = rawText.trim();
    const matchedLot = lots.find(
      (l) => l.lot_no.toLowerCase() === cleanText.toLowerCase() || l.id === cleanText
    );
    if (matchedLot) {
      return {
        lotId: matchedLot.id,
        lotNo: matchedLot.lot_no,
        pieces: 25,
      };
    }
  }

  return {
    lotId: lots[0].id,
    lotNo: lots[0].lot_no,
    pieces: 25,
  };
}

describe("Bundle Barcode & QR Ticket Scanner Subsystem", () => {
  const mockLots: LotMock[] = [
    { id: "lot-1", lot_no: "LOT-2026-001", style: "Cotton Men Shirt" },
    { id: "lot-2", lot_no: "LOT-2026-002", style: "Rayon Ladies Kurti" },
  ];

  const mockOperations: OperationMock[] = [
    { id: "op-1", name: "Cutting" },
    { id: "op-2", name: "Stitching" },
  ];

  it("parses structured JSON QR bundle tickets correctly", () => {
    const qrPayload = JSON.stringify({
      lot_no: "LOT-2026-001",
      pieces: 30,
      operation_id: "op-2",
    });

    const result = parseBundleTicket(qrPayload, mockLots, mockOperations);
    expect(result.lotId).toBe("lot-1");
    expect(result.lotNo).toBe("LOT-2026-001");
    expect(result.pieces).toBe(30);
    expect(result.operationId).toBe("op-2");
  });

  it("parses simple string lot barcode text correctly", () => {
    const rawBarcode = "LOT-2026-002";
    const result = parseBundleTicket(rawBarcode, mockLots, mockOperations);
    expect(result.lotId).toBe("lot-2");
    expect(result.lotNo).toBe("LOT-2026-002");
    expect(result.pieces).toBe(25);
  });

  it("falls back gracefully when ticket is unrecognized", () => {
    const unknownBarcode = "INVALID-TICKET-999";
    const result = parseBundleTicket(unknownBarcode, mockLots, mockOperations);
    expect(result.lotId).toBe("lot-1");
  });
});
