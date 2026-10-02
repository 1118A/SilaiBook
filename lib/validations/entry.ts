import { z } from "zod";

export const pieceEntrySchema = z.object({
  tailor_id: z.string().min(1, "validation.tailorRequired"),
  lot_id: z.string().min(1, "validation.lotRequired"),
  operation_id: z.string().min(1, "validation.operationRequired"),
  work_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  pieces: z.number({ invalid_type_error: "validation.piecesPositive" }).int().gt(0, "validation.piecesPositive"),
  rate_paise: z.number({ invalid_type_error: "validation.rateNonNegative" }).int().gte(0, "validation.rateNonNegative"),
  note: z.string().optional(),
});

export type PieceEntryInput = z.infer<typeof pieceEntrySchema>;

export const lotSchema = z.object({
  lot_no: z.string().min(1, "Lot number is required"),
  style: z.string().min(1, "Style name is required"),
  total_pieces: z.number().int().gt(0, "Target pieces must be greater than 0"),
});

export type LotInput = z.infer<typeof lotSchema>;

export const tailorSchema = z.object({
  name: z.string().min(1, "validation.nameRequired"),
  phone: z.string().optional(),
});

export type TailorInput = z.infer<typeof tailorSchema>;

export const operationSchema = z.object({
  name: z.string().min(1, "validation.nameRequired"),
  default_rate_paise: z.number().int().gte(0, "validation.rateNonNegative"),
});

export type OperationInput = z.infer<typeof operationSchema>;
