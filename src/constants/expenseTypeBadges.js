/** Matches recurring expense `type` values + projection `spending` line items. */
export const EXPENSE_TYPE_BADGES = {
  subscription: { label: "Subscription", dot: "#818cf8" },
  bill: { label: "Bill", dot: "#60a5fa" },
  debt: { label: "Debt", dot: "#f87171" },
  credit_card: { label: "Card", dot: "#fbbf24" },
  utility: { label: "Utility", dot: "#34d399" },
  insurance: { label: "Insurance", dot: "#c084fc" },
  other: { label: "Other", dot: "#cbd5e1" },
  /** Weekly spending (projection engine) */
  spending: { label: "Weekly spending", dot: "#94a3b8" },
};

export const EXPENSE_TYPE_ORDER = [
  "subscription",
  "bill",
  "debt",
  "credit_card",
  "utility",
  "insurance",
  "other",
];

/** Day cards + legend: recurring types plus weekly spending from the projection engine. */
export const PROJECTION_EXPENSE_LEGEND_ORDER = [...EXPENSE_TYPE_ORDER, "spending"];

export function getExpenseTypeBadge(type) {
  const key = String(type || "other");
  return EXPENSE_TYPE_BADGES[key] ?? EXPENSE_TYPE_BADGES.other;
}

/** First-seen order of expense `type` values for a day (for dot clusters). */
export function getOrderedUniqueExpenseTypes(expenseItems) {
  const items = expenseItems || [];
  const seen = new Set();
  const order = [];
  for (const item of items) {
    const t = item?.type != null ? String(item.type) : "other";
    if (seen.has(t)) continue;
    seen.add(t);
    order.push(t);
  }
  return order;
}
