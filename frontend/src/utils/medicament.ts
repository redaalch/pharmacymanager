import type { Medicament } from "../api";

export type StockStatus = "ok" | "low" | "out";

export function stockStatus(medicament: Pick<Medicament, "stock_actuel" | "stock_minimum">): StockStatus {
  if (medicament.stock_actuel <= 0) return "out";
  if (medicament.stock_actuel <= medicament.stock_minimum) return "low";
  return "ok";
}
