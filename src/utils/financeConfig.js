import { financeData } from "../data/monthly";

/** @param {unknown} raw */
export function normalizeFinanceConfig(raw) {
  const base =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? { ...raw }
      : { ...financeData };

  let weeklySpendingMode = base.weeklySpendingMode;
  if (weeklySpendingMode !== "flat" && weeklySpendingMode !== "items") {
    weeklySpendingMode =
      Array.isArray(base.weeklySpendingItems) && base.weeklySpendingItems.length > 0
        ? "items"
        : "flat";
  }

  const weeklySpendingItems = Array.isArray(base.weeklySpendingItems)
    ? base.weeklySpendingItems.map((row) => {
        if (!row || typeof row !== "object") {
          return { name: "", amount: 0 };
        }
        return {
          name: row.name ?? "",
          amount: Number(row.amount) || 0,
        };
      })
    : [];

  const weeklySpending = Number(base.weeklySpending) || 0;

  if (weeklySpendingMode === "items") {
    return {
      ...base,
      weeklySpendingMode: "items",
      weeklySpendingItems,
      weeklySpending: 0,
    };
  }

  return {
    ...base,
    weeklySpendingMode: "flat",
    weeklySpendingItems: [],
    weeklySpending,
  };
}
