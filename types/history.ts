import { HistoricItemType } from "@prisma/client";

export type HistoryEntry =
    | { action: "created"; item: Record<string, unknown>; type:HistoricItemType;  at: Date }
    | { action: "modified"; item: Record<string, unknown>; type:HistoricItemType; field: string; from: unknown; to: unknown; at: Date }
    | { action: "deleted"; item: Record<string, unknown>; type:HistoricItemType; at: Date }