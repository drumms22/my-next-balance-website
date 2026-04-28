import React from "react";
import { format } from "date-fns";
import ExpenseTypeDot from "./ExpenseTypeDot";

const row = {
  display: "flex",
  alignItems: "baseline",
  gap: 6,
  minWidth: 0,
};

const incomeDot = {
  width: 8,
  height: 8,
  borderRadius: 999,
  flexShrink: 0,
  background: "#22c55e",
  boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.14)",
};

const DayTooltip = ({ day }) => {
  if (!day) return null;

  return (
    <div style={{ minWidth: 200 }}>
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>
        {format(day.date, "MMM d yyyy")}
      </div>

      {day.incomeItems?.length > 0 && (
        <>
          <div style={{ color: "green", fontWeight: 600 }}>Income</div>
          {day.incomeItems.map((item, i) => (
            <div key={i} style={row}>
              <span aria-hidden="true" title="Income" style={incomeDot} />
              <span style={{ flex: 1, minWidth: 0 }}>
                +${item.amount} — {item.name}
              </span>
            </div>
          ))}
        </>
      )}

      {day.expenseItems?.length > 0 && (
        <>
          <div style={{ color: "red", fontWeight: 600, marginTop: 6 }}>
            Expenses
          </div>
          {day.expenseItems.map((item, i) => (
            <div key={i} style={row}>
              <ExpenseTypeDot type={item?.type} variant="light" />
              <span style={{ flex: 1, minWidth: 0 }}>
                -${item.amount} — {item.name}
              </span>
            </div>
          ))}
        </>
      )}

      <div style={{ marginTop: 8, fontWeight: "bold" }}>
        Balance: ${day.balance.toFixed(2)}
      </div>
    </div>
  );
};

export default DayTooltip;
