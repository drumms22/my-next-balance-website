import React from "react";
import { format } from "date-fns";
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
                <div key={i}>+${item.amount} — {item.name}</div>
            ))}
            </>
        )}

        {day.expenseItems?.length > 0 && (
            <>
            <div style={{ color: "red", fontWeight: 600, marginTop: 6 }}>
                Expenses
            </div>
            {day.expenseItems.map((item, i) => (
                <div key={i}>-${item.amount} — {item.name}</div>
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