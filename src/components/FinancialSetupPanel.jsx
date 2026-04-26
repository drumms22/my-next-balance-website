import React, { useEffect, useMemo, useState } from "react";
import {
  RAIL_OVERLAY_WIDTH_PX,
  RAIL_SLIDE_TRANSITION,
} from "../constants/sideRails";
import ExpenseSelector from "./ExpenseSelector";
import ToolTip from "./ToolTip";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const shellBase = {
  position: "fixed",
  top: 0,
  right: 0,
  zIndex: 45,
  width: RAIL_OVERLAY_WIDTH_PX,
  height: "100vh",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgba(22, 22, 22, 0.98)",
  borderLeft: "1px solid rgba(128, 128, 128, 0.35)",
  boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.5)",
  textAlign: "left",
  overflow: "hidden",
  willChange: "transform",
};

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
  dangerBtn: { background: "#dc2626" },
  intro: {
    flexShrink: 0,
    margin: 0,
    padding: "10px 14px 14px",
    fontSize: 13,
    lineHeight: 1.55,
    opacity: 0.78,
  },
  scrollRegion: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "0 14px 18px",
    minHeight: 0,
  },
  section: {
    border: "1px solid rgba(128, 128, 128, 0.26)",
    borderRadius: 12,
    padding: 12,
    background: "rgba(255, 255, 255, 0.02)",
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    fontStyle: "italic",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "rgba(255, 255, 255, 0.82)",
    opacity: 1,
    marginBottom: 12,
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
    height: 42,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(180, 180, 180, 0.45)",
    backgroundColor: "#1a1a1a",
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: 13,
    lineHeight: 1.2,
    boxSizing: "border-box",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  listItem: {
    border: "1px solid rgba(128, 128, 128, 0.22)",
    borderRadius: 10,
    padding: 10,
    background: "rgba(0,0,0,0.18)",
  },
  listItemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
  },
  listItemTitle: { fontSize: 13, fontWeight: 700, opacity: 0.92 },
  listItemMeta: { fontSize: 12, opacity: 0.7, whiteSpace: "nowrap" },
  itemActions: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 },
  smallBtn: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(128, 128, 128, 0.28)",
    background: "rgba(26, 26, 26, 0.9)",
    color: "rgba(255, 255, 255, 0.92)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
  },
  empty: { fontSize: 13, opacity: 0.6, fontStyle: "italic" },
  editor: { marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(128, 128, 128, 0.22)" },
  editorActions: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 },
  fieldLabelRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    opacity: 0.62,
    whiteSpace: "nowrap",
  },
  infoIconBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    padding: 0,
    border: "1px solid rgba(180, 180, 180, 0.4)",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255, 255, 255, 0.88)",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 800,
    fontStyle: "italic",
    lineHeight: 1,
    flexShrink: 0,
  },
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isSame(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function formatMoney(n) {
  const num = typeof n === "number" ? n : Number(n);
  if (Number.isNaN(num)) return "$0";
  return `$${num.toFixed(2)}`;
}

function formatMonthDay(m, d) {
  const mm = Number(m);
  const dd = Number(d);
  if (!mm || !dd) return "";
  return `${MONTH_NAMES[mm - 1]} ${dd}`;
}

function HowManyTimesLabel({ help }) {
  return (
    <div style={styles.fieldLabelRow}>
      <span>Times</span>
      <ToolTip content={help} trigger="click" interactive placement="top">
        <button type="button" style={styles.infoIconBtn} aria-label="About Times">
          i
        </button>
      </ToolTip>
    </div>
  );
}

function computeStartYear(month, day) {
  const now = new Date();
  const m = Number(month) || now.getMonth() + 1;
  const d = Number(day) || now.getDate();
  let y = now.getFullYear();
  if (m < now.getMonth() + 1 || (m === now.getMonth() + 1 && d < now.getDate())) {
    y += 1;
  }
  return y;
}

function getDaysInMonth(year, month) {
  const y = Number(year);
  const m = Number(month);
  if (!y || !m) return 31;
  return new Date(y, m, 0).getDate(); // month is 1-12
}

/** YYYY-MM-DD in local time (for `<input type="date" />`). */
function formatIsoDateLocal(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MONTH_DAY_PICKER_EDIT_TYPES = new Set([
  "incomeOverrides",
  "extraIncome",
  "overrides",
  "excludes",
]);

function MonthDaySelects({ month, day, daysInMonth, setEditorValue }) {
  const m = month ?? 1;
  const d = day ?? 1;
  return (
    <>
      <div>
        <label style={styles.fieldLabel}>Month</label>
        <select
          style={styles.control}
          value={m}
          onChange={(e) => {
            const nextMonth = Number(e.target.value);
            setEditorValue((p) => {
              const prevMonth = p.month ?? 1;
              const prevDay =
                typeof p.day === "number" && !Number.isNaN(p.day) ? p.day : 1;
              const y = computeStartYear(prevMonth, prevDay);
              const maxDay = getDaysInMonth(y, nextMonth);
              return { ...p, month: nextMonth, day: Math.min(prevDay, maxDay) };
            });
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((mm) => (
            <option key={mm} value={mm}>
              {MONTH_NAMES[mm - 1]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label style={styles.fieldLabel}>Day</label>
        <select
          style={styles.control}
          value={d}
          onChange={(e) =>
            setEditorValue((p) => ({ ...p, day: Number(e.target.value) }))
          }
        >
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dd) => (
            <option key={dd} value={dd}>
              {dd}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default function FinancialSetupPanel({
  config,
  setConfig,
  isOpen,
  onClose,
}) {
  const [draft, setDraft] = useState(() => deepClone(config));
  const [editing, setEditing] = useState(null); // { type, index } or null
  const [editorValue, setEditorValue] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync draft when rail opens / config changes
    setDraft(deepClone(config));
    setEditing(null);
    setEditorValue(null);
  }, [isOpen, config]);

  const isDirty = useMemo(() => !isSame(draft, config), [draft, config]);

  const shell = {
    ...shellBase,
    transform: isOpen ? "translateX(0)" : "translateX(100%)",
    transition: RAIL_SLIDE_TRANSITION,
    pointerEvents: isOpen ? "auto" : "none",
  };

  const saveAll = () => {
    setConfig(draft);
  };

  const revertAll = () => {
    setDraft(deepClone(config));
    setEditing(null);
    setEditorValue(null);
  };

  const beginEdit = (type, index, initial) => {
    setEditing({ type, index });
    const v = deepClone(initial);
    if (type === "incomeRules" && v?.frequency === "biweekly" && !String(v.startDate ?? "").trim()) {
      v.startDate = formatIsoDateLocal(new Date());
    }
    if (type === "incomeRules" && v?.frequency === "once") {
      const m = Number(v.month) || 1;
      const d = Number(v.day) || 1;
      const y = computeStartYear(m, d);
      const maxD = getDaysInMonth(y, m);
      v.month = m;
      v.day = Math.min(d, maxD);
    }
    if (MONTH_DAY_PICKER_EDIT_TYPES.has(type) && v) {
      const m = Number(v.month) || 1;
      const rawD = v.day;
      const d =
        typeof rawD === "number" && !Number.isNaN(rawD) ? rawD : 1;
      const y = computeStartYear(m, d);
      const maxD = getDaysInMonth(y, m);
      v.month = m;
      v.day = Math.min(d, maxD);
    }
    setEditorValue(v);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditorValue(null);
  };

  const commitEdit = () => {
    if (!editing || !editorValue) return;
    const { type, index } = editing;
    let payload;
    if (type === "weeklySpendingItems") {
      payload = {
        name: editorValue.name ?? "",
        amount: Number(editorValue.amount) || 0,
      };
    } else if (type === "incomeRules") {
      payload = deepClone(editorValue);
      if (payload.frequency === "biweekly") {
        let sd = String(payload.startDate ?? "").trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(sd)) {
          sd = formatIsoDateLocal(new Date());
        } else {
          const t = new Date(`${sd}T12:00:00`);
          if (Number.isNaN(t.getTime())) {
            sd = formatIsoDateLocal(new Date());
          }
        }
        payload.startDate = sd;
      } else {
        delete payload.startDate;
      }
      if (payload.frequency === "once") {
        payload.month = Number(payload.month) || 1;
        payload.day = Number(payload.day) || 1;
      }
    } else if (MONTH_DAY_PICKER_EDIT_TYPES.has(type)) {
      payload = deepClone(editorValue);
      payload.month = Number(payload.month) || 1;
      payload.day = Number(payload.day) || 1;
    } else {
      payload = editorValue;
    }
    setDraft((prev) => {
      const next = deepClone(prev);
      const list = Array.isArray(next[type]) ? next[type] : [];
      if (index == null) {
        next[type] = [...list, payload];
      } else {
        const copy = [...list];
        copy[index] = payload;
        next[type] = copy;
      }
      return next;
    });
    setEditing(null);
    setEditorValue(null);
  };

  const removeItem = (type, index) => {
    setDraft((prev) => {
      const next = deepClone(prev);
      const list = Array.isArray(next[type]) ? next[type] : [];
      next[type] = list.filter((_, i) => i !== index);
      return next;
    });
    if (editing?.type === type && editing?.index === index) {
      cancelEdit();
    }
  };

  const useToday = () => {
    const t = new Date();
    setDraft((prev) => ({
      ...prev,
      startConfig: { day: t.getDate(), month: t.getMonth() + 1 },
    }));
  };

  const incomeRules = draft.incomeRules || [];
  const incomeOverrides = draft.incomeOverrides || [];
  const extraIncome = draft.extraIncome || [];
  const overrides = draft.overrides || [];
  const excludes = draft.excludes || [];
  const weeklySpendingMode = draft.weeklySpendingMode === "items" ? "items" : "flat";
  const weeklySpendingItems = draft.weeklySpendingItems || [];

  const startMonth = draft.startConfig?.month ?? 1;
  const startDay = draft.startConfig?.day ?? 1;
  const startYear = useMemo(
    () => computeStartYear(startMonth, startDay),
    [startMonth, startDay]
  );
  const daysInSelectedMonth = useMemo(
    () => getDaysInMonth(startYear, startMonth),
    [startYear, startMonth]
  );

  const incomeOnceMonth =
    editing?.type === "incomeRules" && editorValue?.frequency === "once"
      ? (editorValue?.month ?? 1)
      : 1;
  const incomeOnceDay =
    editing?.type === "incomeRules" && editorValue?.frequency === "once"
      ? (editorValue?.day ?? 1)
      : 1;
  const incomeOnceStartYear = useMemo(
    () => computeStartYear(incomeOnceMonth, incomeOnceDay),
    [incomeOnceMonth, incomeOnceDay]
  );
  const incomeOnceDaysInMonth = useMemo(
    () => getDaysInMonth(incomeOnceStartYear, incomeOnceMonth),
    [incomeOnceStartYear, incomeOnceMonth]
  );

  const mdPickerActive = MONTH_DAY_PICKER_EDIT_TYPES.has(editing?.type);
  const mdPickerMonth = mdPickerActive ? (editorValue?.month ?? 1) : 1;
  const mdPickerDay = mdPickerActive
    ? typeof editorValue?.day === "number" && !Number.isNaN(editorValue.day)
      ? editorValue.day
      : 1
    : 1;
  const mdPickerStartYear = useMemo(
    () => computeStartYear(mdPickerMonth, mdPickerDay),
    [mdPickerMonth, mdPickerDay]
  );
  const mdPickerDaysInMonth = useMemo(
    () => getDaysInMonth(mdPickerStartYear, mdPickerMonth),
    [mdPickerStartYear, mdPickerMonth]
  );

  return (
    <aside
      style={shell}
      aria-label="Financial setup"
      aria-hidden={!isOpen}
    >
      <div style={styles.topBar}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={styles.title}>Financial setup</h2>
        </div>
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

      <div style={styles.intro}>
        <p style={{ margin: 0, opacity: 0.92 }}>
          <strong style={{ opacity: 1 }}>Financial setup</strong> is where you define everything the
          projection runs on: the start date, account balance, income rules, payday spending,
          recurring bills (from the Expenses panel), one-off overrides, and what to skip. When you
          run the forecast on the main screen, it uses the values you save here.
        </p>
        <p style={{ margin: "12px 0 0", opacity: 0.78, fontSize: 12.5 }}>
          Edit any section below, then press <strong style={{ opacity: 1 }}>Save</strong> at the top
          to store your changes. <strong style={{ opacity: 1 }}>Cancel</strong> reverts this panel to
          the last saved config.
        </p>
      </div>

      <div style={styles.scrollRegion}>
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Schedule</div>
          <div style={styles.grid2}>
            <div>
              <label style={styles.fieldLabel}>Start month</label>
              <select
                style={styles.control}
                value={draft.startConfig?.month ?? 1}
                onChange={(e) => {
                  const nextMonth = Number(e.target.value);
                  const maxDay = getDaysInMonth(startYear, nextMonth);
                  setDraft((prev) => {
                    const prevDay = prev.startConfig?.day ?? 1;
                    return {
                      ...prev,
                      startConfig: {
                        ...(prev.startConfig || {}),
                        month: nextMonth,
                        day: Math.min(prevDay, maxDay),
                      },
                    };
                  });
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {MONTH_NAMES[m - 1]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Start day</label>
              <select
                style={styles.control}
                value={draft.startConfig?.day ?? 1}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    startConfig: {
                      ...(prev.startConfig || {}),
                      day: Number(e.target.value),
                    },
                  }))
                }
              >
                {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ ...styles.editorActions, marginTop: 10 }}>
            <button type="button" style={styles.smallBtn} onClick={useToday}>
              Use Today
            </button>
            <div style={{ fontSize: 12, opacity: 0.7, marginRight: "auto" }}>
              Current: {formatMonthDay(draft.startConfig?.month, draft.startConfig?.day)}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>Balances & spending</div>
          <div style={styles.grid2}>
            <div>
              <label style={styles.fieldLabel}>Starting balance</label>
              <input
                style={styles.control}
                type="number"
                inputMode="decimal"
                value={draft.startingBalance ?? 0}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    startingBalance: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label style={styles.fieldLabel}>Weekly spending</label>
              {weeklySpendingMode === "flat" ? (
                <input
                  style={styles.control}
                  type="number"
                  inputMode="decimal"
                  value={draft.weeklySpending ?? 0}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      weeklySpending: Number(e.target.value),
                    }))
                  }
                />
              ) : (
                <div
                  style={{
                    ...styles.control,
                    display: "flex",
                    alignItems: "center",
                    opacity: 0.72,
                    fontSize: 13,
                  }}
                >
                  Sum of items:{" "}
                  {formatMoney(
                    weeklySpendingItems.reduce((s, it) => s + (Number(it.amount) || 0), 0)
                  )}
                </div>
              )}
            </div>
          </div>
          <div style={{ ...styles.editorActions, marginTop: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              style={{
                ...styles.smallBtn,
                ...(weeklySpendingMode === "flat"
                  ? { borderColor: "rgba(37, 99, 235, 0.65)", color: "#93c5fd" }
                  : {}),
              }}
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  weeklySpendingMode: "flat",
                }))
              }
            >
              Single amount
            </button>
            <button
              type="button"
              style={{
                ...styles.smallBtn,
                ...(weeklySpendingMode === "items"
                  ? { borderColor: "rgba(37, 99, 235, 0.65)", color: "#93c5fd" }
                  : {}),
              }}
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  weeklySpendingMode: "items",
                }))
              }
            >
              Itemized list
            </button>
            <div style={{ fontSize: 12, opacity: 0.65, width: "100%" }}>
              Use one mode or the other. Itemized lines apply on every payday; totals are summed.
            </div>
          </div>
          {weeklySpendingMode === "items" ? (
            <>
              <div style={{ ...styles.editorActions, marginTop: 10 }}>
                <button
                  type="button"
                  style={styles.smallBtn}
                  onClick={() =>
                    beginEdit("weeklySpendingItems", null, {
                      name: "",
                      amount: 0,
                    })
                  }
                >
                  + Add weekly spending item
                </button>
              </div>
              {weeklySpendingItems.length === 0 ? (
                <div style={styles.empty}>None</div>
              ) : (
                <div style={{ ...styles.list, marginTop: 10 }}>
                  {weeklySpendingItems.map((w, i) => (
                    <div key={`ws-${i}`} style={styles.listItem}>
                      <div style={styles.listItemTop}>
                        <div style={styles.listItemTitle}>{w.name || "Weekly spending"}</div>
                        <div style={styles.listItemMeta}>{formatMoney(w.amount)}</div>
                      </div>
                      <div style={styles.itemActions}>
                        <button
                          type="button"
                          style={styles.smallBtn}
                          onClick={() => beginEdit("weeklySpendingItems", i, w)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          style={{ ...styles.smallBtn, borderColor: "rgba(220,80,80,0.5)", color: "#fca5a5" }}
                          onClick={() => removeItem("weeklySpendingItems", i)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {editing?.type === "weeklySpendingItems" && editorValue ? (
                <div style={styles.editor}>
                  <div>
                    <label style={styles.fieldLabel}>Name</label>
                    <input
                      style={styles.control}
                      value={editorValue.name ?? ""}
                      onChange={(e) => setEditorValue((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div style={{ ...styles.grid2, marginTop: 10 }}>
                    <div>
                      <label style={styles.fieldLabel}>Amount</label>
                      <input
                        style={styles.control}
                        type="number"
                        inputMode="decimal"
                        value={editorValue.amount ?? 0}
                        onChange={(e) =>
                          setEditorValue((p) => ({ ...p, amount: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div />
                  </div>
                  <div style={styles.editorActions}>
                    <button type="button" style={styles.smallBtn} onClick={cancelEdit}>
                      Cancel
                    </button>
                    <button type="button" style={{ ...styles.smallBtn, ...styles.greenBtn }} onClick={commitEdit}>
                      Save item
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>Income</div>
          <div style={styles.editorActions}>
            <button
              type="button"
              style={styles.smallBtn}
              onClick={() =>
                beginEdit("incomeRules", null, {
                  name: "Income",
                  amount: 0,
                  frequency: "weekly",
                  weekday: 5,
                })
              }
            >
              + Add income rule
            </button>
          </div>
          <p style={{ ...styles.intro, padding: "8px 0 0", margin: 0, fontSize: 12 }}>
            You can add <strong style={{ opacity: 1 }}>multiple</strong> income rules. Every rule that
            matches a calendar day counts. Biweekly rules need a start date so paydays line up every 14
            days.
          </p>
          {incomeRules.length === 0 ? (
            <div style={styles.empty}>None</div>
          ) : (
            <div style={styles.list}>
              {incomeRules.map((r, i) => (
                <div key={`ir-${i}`} style={styles.listItem}>
                  <div style={styles.listItemTop}>
                    <div style={styles.listItemTitle}>{r.name || "Income"}</div>
                    <div style={styles.listItemMeta}>
                      {r.frequency === "weekly"
                        ? weekdays[r.weekday]
                        : r.frequency === "biweekly"
                          ? `${weekdays[r.weekday ?? 0]} · from ${r.startDate || "—"}`
                          : r.frequency === "once"
                            ? `once · ${formatMonthDay(r.month, r.day)}`
                            : r.frequency}{" "}
                      · {formatMoney(r.amount)}
                    </div>
                  </div>
                  <div style={styles.itemActions}>
                    <button
                      type="button"
                      style={styles.smallBtn}
                      onClick={() => beginEdit("incomeRules", i, r)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.smallBtn, borderColor: "rgba(220,80,80,0.5)", color: "#fca5a5" }}
                      onClick={() => removeItem("incomeRules", i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editing?.type === "incomeRules" && editorValue ? (
            <div style={styles.editor}>
              <div style={styles.grid2}>
                <div>
                  <label style={styles.fieldLabel}>Name</label>
                  <input
                    style={styles.control}
                    value={editorValue.name ?? ""}
                    onChange={(e) => setEditorValue((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={styles.fieldLabel}>Amount</label>
                  <input
                    style={styles.control}
                    type="number"
                    inputMode="decimal"
                    value={editorValue.amount ?? 0}
                    onChange={(e) => setEditorValue((p) => ({ ...p, amount: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div style={{ ...styles.grid2, marginTop: 10 }}>
                <div>
                  <label style={styles.fieldLabel}>Frequency</label>
                  <select
                    style={styles.control}
                    value={editorValue.frequency ?? "weekly"}
                    onChange={(e) => {
                      const f = e.target.value;
                      setEditorValue((p) => {
                        const next = { ...p, frequency: f };
                        if (f === "biweekly" && !String(next.startDate ?? "").trim()) {
                          next.startDate = formatIsoDateLocal(new Date());
                        }
                        if (f === "once") {
                          next.month = next.month ?? 1;
                          next.day = next.day ?? 1;
                        }
                        return next;
                      });
                    }}
                  >
                    <option value="weekly">weekly</option>
                    <option value="biweekly">biweekly</option>
                    <option value="monthly">monthly</option>
                    <option value="once">once</option>
                  </select>
                </div>
                {editorValue.frequency === "weekly" || editorValue.frequency === "biweekly" ? (
                  <div>
                    <label style={styles.fieldLabel}>Weekday</label>
                    <select
                      style={styles.control}
                      value={editorValue.weekday ?? 5}
                      onChange={(e) =>
                        setEditorValue((p) => ({ ...p, weekday: Number(e.target.value) }))
                      }
                    >
                      {weekdays.map((d, idx) => (
                        <option key={d} value={idx}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : editorValue.frequency === "monthly" ? (
                  <div>
                    <label style={styles.fieldLabel}>Day (1-31)</label>
                    <input
                      style={styles.control}
                      type="number"
                      min="1"
                      max="31"
                      value={editorValue.day ?? 1}
                      onChange={(e) => setEditorValue((p) => ({ ...p, day: Number(e.target.value) }))}
                    />
                  </div>
                ) : (
                  <div aria-hidden="true" />
                )}
              </div>
              {editorValue.frequency === "once" ? (
                <div style={{ ...styles.grid2, marginTop: 10 }}>
                  <div>
                    <label style={styles.fieldLabel}>Month</label>
                    <select
                      style={styles.control}
                      value={editorValue.month ?? 1}
                      onChange={(e) => {
                        const nextMonth = Number(e.target.value);
                        setEditorValue((p) => {
                          const prevMonth = p.month ?? 1;
                          const prevDay = p.day ?? 1;
                          const y = computeStartYear(prevMonth, prevDay);
                          const maxDay = getDaysInMonth(y, nextMonth);
                          return {
                            ...p,
                            month: nextMonth,
                            day: Math.min(prevDay, maxDay),
                          };
                        });
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          {MONTH_NAMES[m - 1]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={styles.fieldLabel}>Day</label>
                    <select
                      style={styles.control}
                      value={editorValue.day ?? 1}
                      onChange={(e) =>
                        setEditorValue((p) => ({ ...p, day: Number(e.target.value) }))
                      }
                    >
                      {Array.from({ length: incomeOnceDaysInMonth }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
              {editorValue.frequency === "biweekly" ? (
                <div style={{ marginTop: 10 }}>
                  <label style={styles.fieldLabel}>Biweekly start date</label>
                  <input
                    style={styles.control}
                    type="date"
                    value={editorValue.startDate ?? ""}
                    onChange={(e) => setEditorValue((p) => ({ ...p, startDate: e.target.value }))}
                  />
                </div>
              ) : null}
              <div style={styles.editorActions}>
                <button type="button" style={{ ...styles.smallBtn }} onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="button" style={{ ...styles.smallBtn, ...styles.greenBtn }} onClick={commitEdit}>
                  Save rule
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>Weekly income overrides</div>
          <div style={styles.editorActions}>
            <button
              type="button"
              style={styles.smallBtn}
              onClick={() =>
                beginEdit("incomeOverrides", null, {
                  name: "Income Override",
                  amount: 0,
                  month: 1,
                  day: 1,
                  howMany: -1,
                })
              }
            >
              + Add override
            </button>
          </div>
          {incomeOverrides.length === 0 ? (
            <div style={styles.empty}>None</div>
          ) : (
            <div style={styles.list}>
              {incomeOverrides.map((o, i) => (
                <div key={`io-${i}`} style={styles.listItem}>
                  <div style={styles.listItemTop}>
                    <div style={styles.listItemTitle}>{o.name || "Income Override"}</div>
                    <div style={styles.listItemMeta}>
                      {formatMoney(o.amount)} · {formatMonthDay(o.month, o.day)} ·{" "}
                      {Number(o.howMany) === -1 ? "recurring" : `×${o.howMany}`}
                    </div>
                  </div>
                  <div style={styles.itemActions}>
                    <button
                      type="button"
                      style={styles.smallBtn}
                      onClick={() => beginEdit("incomeOverrides", i, o)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.smallBtn, borderColor: "rgba(220,80,80,0.5)", color: "#fca5a5" }}
                      onClick={() => removeItem("incomeOverrides", i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {editing?.type === "incomeOverrides" && editorValue ? (
            <div style={styles.editor}>
              <div style={styles.grid2}>
                <div>
                  <label style={styles.fieldLabel}>Name</label>
                  <input
                    style={styles.control}
                    value={editorValue.name ?? ""}
                    onChange={(e) => setEditorValue((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={styles.fieldLabel}>Amount</label>
                  <input
                    style={styles.control}
                    type="number"
                    inputMode="decimal"
                    value={editorValue.amount ?? 0}
                    onChange={(e) => setEditorValue((p) => ({ ...p, amount: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div style={{ ...styles.grid3, marginTop: 10 }}>
                <MonthDaySelects
                  month={editorValue.month ?? 1}
                  day={
                    typeof editorValue.day === "number" && !Number.isNaN(editorValue.day)
                      ? editorValue.day
                      : 1
                  }
                  daysInMonth={mdPickerDaysInMonth}
                  setEditorValue={setEditorValue}
                />
                <div>
                  <HowManyTimesLabel help="Each time this override matches a payday, one use is consumed. Use -1 for unlimited matches, or 1+ to cap how many times it applies." />
                  <input
                    style={styles.control}
                    type="number"
                    value={editorValue.howMany ?? -1}
                    onChange={(e) =>
                      setEditorValue((p) => ({ ...p, howMany: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>
              <div style={styles.editorActions}>
                <button type="button" style={styles.smallBtn} onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="button" style={{ ...styles.smallBtn, ...styles.greenBtn }} onClick={commitEdit}>
                  Save override
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>Extra income</div>
          <div style={styles.editorActions}>
            <button
              type="button"
              style={styles.smallBtn}
              onClick={() =>
                beginEdit("extraIncome", null, { name: "Extra Income", amount: 0, month: 1, day: 1 })
              }
            >
              + Add extra income
            </button>
          </div>
          {extraIncome.length === 0 ? (
            <div style={styles.empty}>None</div>
          ) : (
            <div style={styles.list}>
              {extraIncome.map((x, i) => (
                <div key={`ei-${i}`} style={styles.listItem}>
                  <div style={styles.listItemTop}>
                    <div style={styles.listItemTitle}>{x.name || "Extra Income"}</div>
                    <div style={styles.listItemMeta}>
                      {formatMoney(x.amount)} · {formatMonthDay(x.month, x.day)}
                    </div>
                  </div>
                  <div style={styles.itemActions}>
                    <button type="button" style={styles.smallBtn} onClick={() => beginEdit("extraIncome", i, x)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.smallBtn, borderColor: "rgba(220,80,80,0.5)", color: "#fca5a5" }}
                      onClick={() => removeItem("extraIncome", i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {editing?.type === "extraIncome" && editorValue ? (
            <div style={styles.editor}>
              <div style={styles.grid2}>
                <div>
                  <label style={styles.fieldLabel}>Name</label>
                  <input
                    style={styles.control}
                    value={editorValue.name ?? ""}
                    onChange={(e) => setEditorValue((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={styles.fieldLabel}>Amount</label>
                  <input
                    style={styles.control}
                    type="number"
                    inputMode="decimal"
                    value={editorValue.amount ?? 0}
                    onChange={(e) => setEditorValue((p) => ({ ...p, amount: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div style={{ ...styles.grid2, marginTop: 10 }}>
                <MonthDaySelects
                  month={editorValue.month ?? 1}
                  day={
                    typeof editorValue.day === "number" && !Number.isNaN(editorValue.day)
                      ? editorValue.day
                      : 1
                  }
                  daysInMonth={mdPickerDaysInMonth}
                  setEditorValue={setEditorValue}
                />
              </div>
              <div style={styles.editorActions}>
                <button type="button" style={styles.smallBtn} onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="button" style={{ ...styles.smallBtn, ...styles.greenBtn }} onClick={commitEdit}>
                  Save extra income
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>One-off overrides (expenses)</div>
          <div style={styles.editorActions}>
            <button
              type="button"
              style={styles.smallBtn}
              onClick={() => beginEdit("overrides", null, { name: "", amount: 0, month: 1, day: 1 })}
            >
              + Add override
            </button>
          </div>
          {overrides.length === 0 ? (
            <div style={styles.empty}>None</div>
          ) : (
            <div style={styles.list}>
              {overrides.map((o, i) => (
                <div key={`ov-${i}`} style={styles.listItem}>
                  <div style={styles.listItemTop}>
                    <div style={styles.listItemTitle}>{o.name || "Override"}</div>
                    <div style={styles.listItemMeta}>
                      {formatMoney(o.amount)} · {formatMonthDay(o.month, o.day)}
                    </div>
                  </div>
                  <div style={styles.itemActions}>
                    <button type="button" style={styles.smallBtn} onClick={() => beginEdit("overrides", i, o)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.smallBtn, borderColor: "rgba(220,80,80,0.5)", color: "#fca5a5" }}
                      onClick={() => removeItem("overrides", i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {editing?.type === "overrides" && editorValue ? (
            <div style={styles.editor}>
              <div>
                <label style={styles.fieldLabel}>Expense name</label>
                <ExpenseSelector
                  days={draft.days}
                  value={editorValue.name ?? ""}
                  onChange={(v) => setEditorValue((p) => ({ ...p, name: v }))}
                />
              </div>
              <div style={{ ...styles.grid2, marginTop: 10 }}>
                <div>
                  <label style={styles.fieldLabel}>Amount</label>
                  <input
                    style={styles.control}
                    type="number"
                    inputMode="decimal"
                    value={editorValue.amount ?? 0}
                    onChange={(e) => setEditorValue((p) => ({ ...p, amount: Number(e.target.value) }))}
                  />
                </div>
                <div />
              </div>
              <div style={{ ...styles.grid2, marginTop: 10 }}>
                <MonthDaySelects
                  month={editorValue.month ?? 1}
                  day={
                    typeof editorValue.day === "number" && !Number.isNaN(editorValue.day)
                      ? editorValue.day
                      : 1
                  }
                  daysInMonth={mdPickerDaysInMonth}
                  setEditorValue={setEditorValue}
                />
              </div>
              <div style={styles.editorActions}>
                <button type="button" style={styles.smallBtn} onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="button" style={{ ...styles.smallBtn, ...styles.greenBtn }} onClick={commitEdit}>
                  Save override
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>Excludes (skip expenses)</div>
          <div style={styles.editorActions}>
            <button
              type="button"
              style={styles.smallBtn}
              onClick={() => beginEdit("excludes", null, { name: "", month: 1, day: 1, howMany: -1 })}
            >
              + Add exclude
            </button>
          </div>
          {excludes.length === 0 ? (
            <div style={styles.empty}>None</div>
          ) : (
            <div style={styles.list}>
              {excludes.map((x, i) => (
                <div key={`ex-${i}`} style={styles.listItem}>
                  <div style={styles.listItemTop}>
                    <div style={styles.listItemTitle}>{x.name || "Exclude"}</div>
                    <div style={styles.listItemMeta}>
                      {formatMonthDay(x.month, x.day)} ·{" "}
                      {Number(x.howMany) === -1 ? "forever" : `×${x.howMany}`}
                    </div>
                  </div>
                  <div style={styles.itemActions}>
                    <button type="button" style={styles.smallBtn} onClick={() => beginEdit("excludes", i, x)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.smallBtn, borderColor: "rgba(220,80,80,0.5)", color: "#fca5a5" }}
                      onClick={() => removeItem("excludes", i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {editing?.type === "excludes" && editorValue ? (
            <div style={styles.editor}>
              <div>
                <label style={styles.fieldLabel}>Expense name</label>
                <ExpenseSelector
                  days={draft.days}
                  value={editorValue.name ?? ""}
                  onChange={(v) => setEditorValue((p) => ({ ...p, name: v }))}
                />
              </div>
              <div style={{ ...styles.grid3, marginTop: 10 }}>
                <MonthDaySelects
                  month={editorValue.month ?? 1}
                  day={
                    typeof editorValue.day === "number" && !Number.isNaN(editorValue.day)
                      ? editorValue.day
                      : 1
                  }
                  daysInMonth={mdPickerDaysInMonth}
                  setEditorValue={setEditorValue}
                />
                <div>
                  <HowManyTimesLabel help="How long the exclusion lasts once it applies. Use -1 to exclude indefinitely, or 1+ for a limited number of payment cycles." />
                  <input
                    style={styles.control}
                    type="number"
                    value={editorValue.howMany ?? -1}
                    onChange={(e) => setEditorValue((p) => ({ ...p, howMany: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div style={styles.editorActions}>
                <button type="button" style={styles.smallBtn} onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="button" style={{ ...styles.smallBtn, ...styles.greenBtn }} onClick={commitEdit}>
                  Save exclude
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
