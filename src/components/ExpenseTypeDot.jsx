import React from "react";
import { getExpenseTypeBadge } from "../constants/expenseTypeBadges";

/**
 * Small color chip matching the Expenses rail legend.
 * @param {{ type?: string; variant?: "dark" | "light"; style?: React.CSSProperties }} props
 */
export default function ExpenseTypeDot({ type, variant = "dark", style = {} }) {
  const badge = getExpenseTypeBadge(type);
  const ring =
    variant === "light"
      ? "0 0 0 1px rgba(0, 0, 0, 0.14)"
      : "0 0 0 2px rgba(255, 255, 255, 0.08)";

  return (
    <span
      aria-hidden="true"
      title={badge.label}
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        flexShrink: 0,
        background: badge.dot,
        boxShadow: ring,
        ...style,
      }}
    />
  );
}
