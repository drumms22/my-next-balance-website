import React from "react";
import { getExpenseNames } from "../utils/getExpenseNames";

const ExpenseSelector = ({ days, value, onChange }) => {
  const names = getExpenseNames(days);

  return (
    <select
      style={{
        width: "100%",
        height: 42,
        padding: "8px 12px",
        fontSize: 14,
        lineHeight: 1.2,
        borderRadius: 8,
        border: "1px solid rgba(180, 180, 180, 0.45)",
        backgroundColor: "#1a1a1a",
        color: "rgba(255, 255, 255, 0.92)",
        boxSizing: "border-box",
      }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select expense</option>

      {names.map(name => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default ExpenseSelector;