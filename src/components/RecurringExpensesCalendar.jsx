import React, { useEffect, useMemo, useState } from "react";
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

function useIsMobileRail() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(Boolean(mq.matches));
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);
  return isMobile;
}

const styles = {
  topBar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    flexShrink: 0,
    padding: "16px 14px 10px",
    borderBottom: "1px solid rgba(128, 128, 128, 0.22)",
  },

  title: { margin: 0, fontSize: "1.05rem", fontWeight: 700 },

  actionsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  button: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: 600,
  },

  grayBtn: { background: "#6b7280" },
  greenBtn: { background: "#16a34a" },

  intro: {
    flexShrink: 0,
    margin: 0,
    padding: "10px 14px 14px",
    fontSize: 13,
    lineHeight: 1.55,
    opacity: 0.78,
  },

  legend: {
    flexShrink: 0,
    padding: "0 14px 12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 14px",
    alignItems: "center",
    borderBottom: "1px solid rgba(128, 128, 128, 0.22)",
    marginBottom: 2,
  },

  legendItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    opacity: 0.85,
    whiteSpace: "nowrap",
  },

  scrollRegion: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "0 14px 18px",
    minHeight: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: 10,
    paddingTop: 10,
    paddingBottom: 8,
  },

  mobileList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingTop: 10,
    paddingBottom: 8,
  },

  dayCell: {
    border: "1px solid rgba(128, 128, 128, 0.35)",
    borderRadius: 10,
    padding: 10,
    background: "rgba(255, 255, 255, 0.02)",
    boxSizing: "border-box",
    minHeight: 96,
  },

  dayHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  dayNum: { fontSize: 14, fontWeight: 700, opacity: 0.92 },

  plusBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: "1px solid rgba(128, 128, 128, 0.45)",
    background: "rgba(26, 26, 26, 0.9)",
    color: "rgba(255, 255, 255, 0.92)",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "26px",
    textAlign: "center",
    padding: 0,
  },

  list: { display: "flex", flexDirection: "column", gap: 6 },

  expenseRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 8,
    alignItems: "start",
  },

  expenseName: {
    fontSize: 12,
    lineHeight: 1.3,
    opacity: 0.92,
    wordBreak: "break-word",
  },

  nameRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    minWidth: 0,
  },

  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    flexShrink: 0,
    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.08)",
    marginTop: 3,
  },

  nameText: {
    minWidth: 0,
    whiteSpace: "normal",
    lineHeight: 1.25,
  },

  expenseAmounts: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
    fontSize: 12,
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  },

  amount: { fontWeight: 600, opacity: 0.95 },
  remainingText: { fontSize: 11, opacity: 0.65 },

  itemActions: {
    display: "flex",
    gap: 6,
    justifyContent: "flex-end",
    marginTop: 4,
  },

  iconBtn: {
    border: "1px solid rgba(128, 128, 128, 0.4)",
    background: "rgba(26, 26, 26, 0.9)",
    color: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    cursor: "pointer",
    width: 34,
    height: 34,
    padding: 0,
    fontSize: 18,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  iconBtnDanger: {
    borderColor: "rgba(220, 80, 80, 0.55)",
    color: "#fca5a5",
  },

  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid rgba(128, 128, 128, 0.22)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
    fontSize: 12,
    opacity: 0.92,
  },

  editor: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid rgba(128, 128, 128, 0.22)",
  },

  fieldLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    opacity: 0.62,
    marginBottom: 4,
  },

  control: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(180, 180, 180, 0.45)",
    backgroundColor: "#1a1a1a",
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: 13,
    boxSizing: "border-box",
  },

  editorGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 10,
  },

  editorActions: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    marginTop: 10,
  },

  editorIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(128, 128, 128, 0.4)",
    background: "rgba(26, 26, 26, 0.9)",
    color: "rgba(255, 255, 255, 0.92)",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  editorIconBtnDanger: {
    borderColor: "rgba(220, 80, 80, 0.55)",
    color: "#fca5a5",
  },

  editorIconBtnPrimary: {
    borderColor: "rgba(37, 99, 235, 0.65)",
    background: "rgba(37, 99, 235, 0.15)",
    color: "#bfdbfe",
  },
};

const EXPENSE_TYPES = [
  "subscription",
  "bill",
  "debt",
  "credit_card",
  "utility",
  "insurance",
  "other",
];

const TYPE_BADGES = {
  subscription: { label: "Subscription", dot: "#818cf8" }, // indigo-400
  bill: { label: "Bill", dot: "#60a5fa" }, // blue-400
  debt: { label: "Debt", dot: "#f87171" }, // red-400
  credit_card: { label: "Card", dot: "#fbbf24" }, // amber-400
  utility: { label: "Utility", dot: "#34d399" }, // emerald-400
  insurance: { label: "Insurance", dot: "#c084fc" }, // purple-400
  other: { label: "Other", dot: "#cbd5e1" }, // slate-300
};

function TypeDot({ type }) {
  const key = String(type || "other");
  const badge = TYPE_BADGES[key] ?? TYPE_BADGES.other;
  return (
    <span
      style={{
        ...styles.typeDot,
        background: badge.dot,
      }}
      title={badge.label}
    />
  );
}

function Legend() {
  const items = [
    "subscription",
    "bill",
    "debt",
    "credit_card",
    "utility",
    "insurance",
    "other",
  ];
  return (
    <div style={styles.legend} aria-label="Expense type legend">
      {items.map((t) => (
        <span key={t} style={styles.legendItem}>
          <TypeDot type={t} />
          <span>{TYPE_BADGES[t]?.label ?? "Other"}</span>
        </span>
      ))}
    </div>
  );
}

function formatMoney(n) {
  const num = typeof n === "number" ? n : Number(n);
  if (Number.isNaN(num)) return "$0";
  return `$${num.toFixed(2)}`;
}

function formatRemaining(remaining) {
  const r = typeof remaining === "number" ? remaining : Number(remaining);
  if (Number.isNaN(r)) return "";
  if (r === -1) return "(ongoing)";
  if (r > 0) return `(${r} left)`;
  return "";
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function RecurringExpensesCalendar({
  config,
  setConfig,
  isOpen,
  onClose,
}) {
  const isMobile = useIsMobileRail();
  const [draftDays, setDraftDays] = useState(() => deepClone(config.days));
  const [expandedDay, setExpandedDay] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draftExpense, setDraftExpense] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    // When the rail opens, sync draft state from the latest config.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftDays(deepClone(config.days));
    setExpandedDay(null);
    setEditingIndex(null);
    setDraftExpense(null);
  }, [isOpen, config.days]);

  const shell = {
    ...shellBase,
    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
    transition: RAIL_SLIDE_TRANSITION,
    pointerEvents: isOpen ? "auto" : "none",
  };

  const daysArray = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const isDirty = useMemo(() => {
    try {
      return JSON.stringify(draftDays) !== JSON.stringify(config.days);
    } catch {
      return true;
    }
  }, [draftDays, config.days]);

  const saveAll = () => {
    setConfig((prev) => ({ ...prev, days: draftDays }));
  };

  const revertAll = () => {
    setDraftDays(deepClone(config.days));
    setExpandedDay(null);
    setEditingIndex(null);
    setDraftExpense(null);
  };

  const openAdd = (day) => {
    setExpandedDay(day);
    setEditingIndex(null);
    setDraftExpense({
      type: "bill",
      name: "",
      amount: 0,
      remaining: -1,
    });
  };

  const openEdit = (day, index) => {
    const current = draftDays?.[day]?.expenses?.[index];
    if (!current) return;
    setExpandedDay(day);
    setEditingIndex(index);
    setDraftExpense(deepClone(current));
  };

  const removeExpense = (day, index) => {
    const updated = deepClone(draftDays);
    if (!updated[day]?.expenses) return;
    updated[day].expenses.splice(index, 1);
    if (updated[day].expenses.length === 0) delete updated[day];
    setDraftDays(updated);
    if (expandedDay === day && editingIndex === index) {
      setEditingIndex(null);
      setDraftExpense(null);
    }
  };

  const commitEditor = () => {
    if (!expandedDay || !draftExpense) return;
    const day = expandedDay;
    const updated = deepClone(draftDays);
    const dayObj = updated[day] ?? { expenses: [] };
    const next = {
      type: draftExpense.type || "bill",
      name: (draftExpense.name || "").trim() || "Unnamed",
      amount: Number(draftExpense.amount) || 0,
      remaining:
        typeof draftExpense.remaining === "number"
          ? draftExpense.remaining
          : Number(draftExpense.remaining) || 0,
    };

    if (editingIndex == null) {
      dayObj.expenses.push(next);
    } else {
      dayObj.expenses[editingIndex] = next;
    }

    updated[day] = dayObj;
    setDraftDays(updated);
    setEditingIndex(null);
    setDraftExpense(null);
  };

  const cancelEditor = () => {
    setEditingIndex(null);
    setDraftExpense(null);
  };

  const getExpensesForDay = (day) => draftDays?.[day]?.expenses ?? [];

  const computeDayTotals = (expenses) => {
    let running = 0;
    const rows = expenses.map((e) => {
      const amount = Number(e.amount) || 0;
      running += amount;
      return { ...e, running, amount };
    });
    return { rows, total: running };
  };

  return (
    <div style={shell} aria-hidden={!isOpen}>
      <div style={styles.topBar}>
        <h3 style={styles.title}>Recurring Expenses</h3>
        <div style={styles.actionsRow}>
          <button type="button" style={{ ...styles.button, ...styles.grayBtn }} onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            style={{ ...styles.button, ...styles.greenBtn, opacity: isDirty ? 1 : 0.6 }}
            disabled={!isDirty}
            onClick={saveAll}
          >
            Save
          </button>
          <button
            type="button"
            style={{ ...styles.button, ...styles.grayBtn, opacity: isDirty ? 1 : 0.6 }}
            disabled={!isDirty}
            onClick={revertAll}
          >
            Cancel
          </button>
        </div>
      </div>

      <p style={styles.intro}>
        Click a day to add expenses. Each day shows its items, a running total, and a daily total.
        Expenses on days 29–31 apply on the last calendar day for shorter months.
      </p>

      <Legend />

      <div style={styles.scrollRegion}>
        <div style={isMobile ? styles.mobileList : styles.grid}>
          {daysArray.map((day) => {
            const expenses = getExpensesForDay(day);
            const { rows, total } = computeDayTotals(expenses);
            const isExpanded = expandedDay === day;

            return (
              <div key={day} style={styles.dayCell}>
                <div style={styles.dayHeader}>
                  <div style={styles.dayNum}>Day {day}</div>
                  <button type="button" style={styles.plusBtn} onClick={() => openAdd(day)}>
                    +
                  </button>
                </div>

                {expenses.length === 0 ? (
                  <div style={{ fontSize: 12, opacity: 0.5 }}>No expenses</div>
                ) : (
                  <div style={styles.list}>
                    {rows.map((e, idx) => (
                      <div key={`${day}-${idx}`}>
                        <div style={styles.expenseRow}>
                          <div style={styles.expenseName}>
                            <div style={styles.nameRow}>
                              <TypeDot type={e.type} />
                              <span style={styles.nameText}>{e.name}</span>
                            </div>
                          </div>
                          <div style={styles.expenseAmounts}>
                            <div style={styles.amount}>{formatMoney(e.amount)}</div>
                            {formatRemaining(e.remaining) ? (
                              <div style={styles.remainingText}>{formatRemaining(e.remaining)}</div>
                            ) : null}
                          </div>
                        </div>
                        <div style={styles.itemActions}>
                          <button
                            type="button"
                            style={styles.iconBtn}
                            onClick={() => openEdit(day, idx)}
                            aria-label="Edit expense"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            style={{ ...styles.iconBtn, ...styles.iconBtnDanger }}
                            onClick={() => removeExpense(day, idx)}
                            aria-label="Delete expense"
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={styles.totalRow}>
                  <span style={{ opacity: 0.7 }}>Day total</span>
                  <span style={{ fontWeight: 700 }}>{formatMoney(total)}</span>
                </div>

                {isExpanded && draftExpense ? (
                  <div style={styles.editor}>
                    <div>
                      <label style={styles.fieldLabel}>Category</label>
                      <select
                        style={styles.control}
                        value={draftExpense.type}
                        onChange={(e) =>
                          setDraftExpense((prev) => ({ ...prev, type: e.target.value }))
                        }
                      >
                        {EXPENSE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <label style={styles.fieldLabel}>Name</label>
                      <input
                        style={styles.control}
                        value={draftExpense.name}
                        onChange={(e) =>
                          setDraftExpense((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g. Rent"
                        autoComplete="off"
                      />
                    </div>

                    <div style={styles.editorGrid}>
                      <div>
                        <label style={styles.fieldLabel}>Amount</label>
                        <input
                          style={styles.control}
                          type="number"
                          inputMode="decimal"
                          step="any"
                          value={draftExpense.amount}
                          onFocus={() =>
                            setDraftExpense((prev) => ({
                              ...prev,
                              amount: prev.amount === 0 ? "" : prev.amount,
                            }))
                          }
                          onChange={(e) =>
                            setDraftExpense((prev) => ({
                              ...prev,
                              amount: e.target.value === "" ? "" : Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label style={styles.fieldLabel}>Payments left</label>
                        <input
                          style={styles.control}
                          type="number"
                          step="1"
                          value={draftExpense.remaining}
                          onFocus={() =>
                            setDraftExpense((prev) => ({
                              ...prev,
                              remaining: prev.remaining === 0 ? "" : prev.remaining,
                            }))
                          }
                          onChange={(e) =>
                            setDraftExpense((prev) => ({
                              ...prev,
                              remaining: e.target.value === "" ? "" : Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div style={styles.editorActions}>
                      <button
                        type="button"
                        aria-label="Close editor"
                        title="Close"
                        style={{ ...styles.editorIconBtn, ...styles.editorIconBtnDanger }}
                        onClick={cancelEditor}
                      >
                        ×
                      </button>
                      <button
                        type="button"
                        aria-label={editingIndex == null ? "Add expense" : "Update expense"}
                        title={editingIndex == null ? "Add" : "Update"}
                        style={{ ...styles.editorIconBtn, ...styles.editorIconBtnPrimary }}
                        onClick={commitEditor}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

