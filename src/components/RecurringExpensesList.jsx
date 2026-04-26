import React, { useState } from "react";
import {
  RAIL_OVERLAY_WIDTH_PX,
  RAIL_SLIDE_TRANSITION,
} from "../constants/sideRails";

const shellBase = {
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 45,
  width: RAIL_OVERLAY_WIDTH_PX,
  height: "100vh",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgba(22, 22, 22, 0.98)",
  borderRight: "1px solid rgba(128, 128, 128, 0.35)",
  boxShadow: "8px 0 32px rgba(0, 0, 0, 0.5)",
  textAlign: "left",
  overflow: "hidden",
  willChange: "transform",
};

const scrollRegion = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  padding: "0 14px 24px",
  minHeight: 0,
};

const styles = {
  topBar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    flexShrink: 0,
    padding: "16px 14px 8px",
  },

  intro: {
    flexShrink: 0,
    margin: 0,
    padding: "0 14px 14px",
    fontSize: 13,
    lineHeight: 1.55,
    opacity: 0.78,
    borderBottom: "1px solid rgba(128, 128, 128, 0.28)",
  },

  button: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
  },

  grayBtn: { background: "#6b7280" },
  redBtn: { background: "#dc2626" },

  dayBlock: {
    marginBottom: 0,
    paddingBottom: 16,
  },

  dayBlockWithSeparator: {
    borderTop: "1px solid rgba(128, 128, 128, 0.38)",
    paddingTop: 16,
    marginTop: 0,
  },

  dayHeader: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  expense: {
    paddingLeft: 4,
    marginBottom: 6,
  },

  expenseCard: {
    border: "1px solid rgba(128, 128, 128, 0.35)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    background: "rgba(255, 255, 255, 0.03)",
  },

  fieldBlock: {
    marginBottom: 10,
  },

  fieldLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    opacity: 0.62,
    marginBottom: 5,
  },

  fieldHint: {
    display: "block",
    fontSize: 11,
    lineHeight: 1.4,
    opacity: 0.52,
    marginTop: 5,
  },

  inputControl: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid rgba(180, 180, 180, 0.45)",
    backgroundColor: "#1a1a1a",
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: 14,
    boxSizing: "border-box",
  },

  inputMoney: {
    width: "100%",
    maxWidth: 140,
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid rgba(180, 180, 180, 0.45)",
    backgroundColor: "#1a1a1a",
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: 14,
    boxSizing: "border-box",
  },

  amountRemainingRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    alignItems: "start",
  },

  expenseActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 4,
    paddingTop: 10,
    borderTop: "1px solid rgba(128, 128, 128, 0.22)",
  },

  removeExpenseBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#dc2626",
    color: "white",
    fontSize: 13,
    fontWeight: 600,
  },
};

const EXPENSE_TYPES = [
  "subscription",
  "bill",
  "debt",
  "credit_card",
  "utility",
  "insurance",
  "other"
];

const actionsRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  justifyContent: "flex-end",
  alignItems: "center",
};

export default function RecurringExpensesList({ config, setConfig, isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftDays, setDraftDays] = useState(structuredClone(config.days));

  const sortedDays = Object.entries(draftDays).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  /* ---------------- change field ---------------- */

  const handleChange = (day, index, field, value) => {
    const updated = structuredClone(draftDays);
    if (field === "amount" || field === "remaining") {
      const n = Number(value);
      updated[day].expenses[index][field] = Number.isNaN(n) ? 0 : n;
    } else {
      updated[day].expenses[index][field] = value;
    }
    setDraftDays(updated);
  };

  /* ---------------- delete expense ---------------- */

  const deleteExpense = (day, index) => {
    const updated = structuredClone(draftDays);
    updated[day].expenses.splice(index, 1);
    setDraftDays(updated);
  };

  /* ---------------- add expense ---------------- */

const addExpense = day => {
  const updated = structuredClone(draftDays);

  updated[day].expenses.push({
    type: "bill",
    name: "New Expense",
    amount: 0,
    remaining: -1
  });

  setDraftDays(updated);
};

  /* ---------------- add day ---------------- */

  const addDay = () => {
    const newDay = prompt("Enter day number:");

    if (!newDay || draftDays[newDay]) return;

    setDraftDays(prev => ({
      ...prev,
      [newDay]: { expenses: [] }
    }));
  };

  /* ---------------- delete day ---------------- */

  const deleteDay = day => {
    const updated = structuredClone(draftDays);
    delete updated[day];
    setDraftDays(updated);
  };

  /* ---------------- save ---------------- */

  const saveChanges = () => {
    setConfig(prev => ({
      ...prev,
      days: draftDays
    }));
    setIsEditing(false);
  };

  /* ---------------- cancel ---------------- */

  const cancelChanges = () => {
    setDraftDays(structuredClone(config.days));
    setIsEditing(false);
  };

  /* ================= RENDER ================= */

  const shell = {
    ...shellBase,
    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
    transition: RAIL_SLIDE_TRANSITION,
    pointerEvents: isOpen ? "auto" : "none",
    backgroundColor: isEditing ? "rgba(0, 0, 0, 0.98)" : shellBase.backgroundColor,
  };

  return (
    <div style={shell} aria-hidden={!isOpen}>
      <div style={styles.topBar}>
        <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>Recurring Expenses</h3>

        <div style={actionsRow}>
          {isOpen && (
            <button type="button" style={{ ...styles.button, ...styles.grayBtn }} onClick={onClose}>
              Close
            </button>
          )}
          {!isEditing ? (
            <button type="button" style={styles.button} onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <>
              <button type="button" style={styles.button} onClick={addDay}>
                + Day
              </button>

              <button type="button" style={styles.button} onClick={saveChanges}>
                Save
              </button>

              <button
                type="button"
                style={{ ...styles.button, ...styles.grayBtn }}
                onClick={cancelChanges}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <p style={styles.intro}>
        Charges are grouped by the day of the month they usually post. Use{" "}
        <strong style={{ fontWeight: 600, opacity: 1 }}>Edit</strong> to change entries, then{" "}
        <strong style={{ fontWeight: 600, opacity: 1 }}>Save</strong>.{" "}
        <strong style={{ fontWeight: 600, opacity: 1 }}>+ Day</strong> adds another day;{" "}
        <strong style={{ fontWeight: 600, opacity: 1 }}>Delete Day</strong> removes that whole
        group. When you run a projection, expenses on days 29–31 are applied on the last calendar
        day of each month whenever that month is shorter (for example February).
      </p>

      <div style={scrollRegion}>
      {sortedDays.map(([day, data], index) => (
        <div
          key={day}
          style={{
            ...styles.dayBlock,
            ...(index > 0 ? styles.dayBlockWithSeparator : { paddingTop: 4 }),
          }}
        >
          <div style={styles.dayHeader}>
            <span>Day {day}</span>

            {isEditing && (
              <button
                type="button"
                style={{
                  ...styles.button,
                  ...styles.redBtn,
                }}
                onClick={() => deleteDay(day)}
              >
                Delete Day
              </button>
            )}
          </div>

          {data.expenses.map((expense, i) => {
            const fieldId = `re-${day}-${i}`;
            return (
              <div key={i} style={styles.expense}>
                {!isEditing ? (
                  <>
                    {expense.name} — ${expense.amount.toFixed(2)}
                    {expense.remaining > 0 && (
                      <span style={{ marginLeft: 6, color: "#888" }}>
                        ({expense.remaining} left)
                      </span>
                    )}
                    {expense.remaining === -1 && (
                      <span style={{ marginLeft: 6, color: "#888", fontSize: 12 }}>
                        (ongoing)
                      </span>
                    )}
                  </>
                ) : (
                  <div style={styles.expenseCard}>
                    <div style={styles.fieldBlock}>
                      <label htmlFor={`${fieldId}-category`} style={styles.fieldLabel}>
                        Category
                      </label>
                      <select
                        id={`${fieldId}-category`}
                        style={styles.inputControl}
                        value={expense.type}
                        onChange={(e) => handleChange(day, i, "type", e.target.value)}
                      >
                        {EXPENSE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.fieldBlock}>
                      <label htmlFor={`${fieldId}-name`} style={styles.fieldLabel}>
                        Name
                      </label>
                      <input
                        id={`${fieldId}-name`}
                        style={styles.inputControl}
                        value={expense.name}
                        onChange={(e) => handleChange(day, i, "name", e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div style={styles.amountRemainingRow}>
                      <div style={{ ...styles.fieldBlock, marginBottom: 0 }}>
                        <label htmlFor={`${fieldId}-amount`} style={styles.fieldLabel}>
                          Amount
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ opacity: 0.75, fontSize: 15 }}>$</span>
                          <input
                            id={`${fieldId}-amount`}
                            style={styles.inputMoney}
                            type="number"
                            inputMode="decimal"
                            step="any"
                            min="0"
                            value={expense.amount}
                            onChange={(e) => handleChange(day, i, "amount", e.target.value)}
                          />
                        </div>
                      </div>
                      <div style={{ ...styles.fieldBlock, marginBottom: 0 }}>
                        <label htmlFor={`${fieldId}-remaining`} style={styles.fieldLabel}>
                          Payments left
                        </label>
                        <input
                          id={`${fieldId}-remaining`}
                          style={styles.inputMoney}
                          type="number"
                          step="1"
                          value={expense.remaining}
                          onChange={(e) => handleChange(day, i, "remaining", e.target.value)}
                        />
                        <span style={styles.fieldHint}>
                          Use <strong style={{ fontWeight: 600, opacity: 1 }}>−1</strong> for
                          ongoing (every month). <strong style={{ fontWeight: 600, opacity: 1 }}>0</strong> skips
                          the charge. A positive number goes down by 1 each time this expense runs in
                          the projection.
                        </span>
                      </div>
                    </div>

                    <div style={styles.expenseActions}>
                      <button
                        type="button"
                        style={styles.removeExpenseBtn}
                        onClick={() => deleteExpense(day, i)}
                      >
                        Remove expense
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isEditing && (
            <button style={styles.button} onClick={() => addExpense(day)}>
              + Add Expense
            </button>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}