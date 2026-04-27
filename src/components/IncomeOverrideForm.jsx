import React, { useState } from "react";

const styles = {
  container: { marginBottom: 30 },

  field: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: 13,
    fontWeight: 600
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10
  },

  input: {
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc"
  },

  smallInput: {
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    width: 90
  },

  button: {
    padding: "12px 18px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#16a34a",
    color: "white",
    cursor: "pointer"
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #eee",
    padding: 8,
    marginBottom: 6,
    borderRadius: 6
  }
};

const WEEKDAYS = [
  "Sunday","Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday"
];

export default function IncomeOverrideForm({ config, setConfig }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState("");
  const [weekday, setWeekday] = useState("");
  const [howMany, setHowMany] = useState(-1);

  const addOverride = () => {
    if (!amount) return;

    const override = {
      name: name || "Income Override",
      amount: Number(amount),
      month: month ? Number(month) : null,
      day: day ? Number(day) : weekday || null,
      howMany: Number(howMany)
    };

    setConfig(prev => ({
      ...prev,
      incomeOverrides: [...(prev.incomeOverrides || []), override]
    }));

    setName("");
    setAmount("");
    setDay("");
    setWeekday("");
  };

  const removeOverride = (index) => {
    setConfig(prev => ({
      ...prev,
      incomeOverrides: prev.incomeOverrides.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={styles.container}>
      <h3>Add Weekly Income Override</h3>

      <div style={styles.row}>

        <div style={styles.field}>
          <label>Name</label>
          <input
            style={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label>Amount</label>
          <input
            style={styles.input}
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label>Month</label>
          <input
            style={styles.smallInput}
            type="number"
            min="1"
            max="12"
            value={Number(month) === 0 ? "" : month}
            onFocus={() => setMonth((prev) => (Number(prev) === 0 ? "" : prev))}
            onChange={e => setMonth(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label>Day #</label>
          <input
            style={styles.smallInput}
            type="number"
            min="1"
            max="31"
            value={Number(day) === 0 ? "" : day}
            onFocus={() => setDay((prev) => (Number(prev) === 0 ? "" : prev))}
            onChange={e => {
              setDay(e.target.value);
              setWeekday("");
            }}
          />
        </div>

        <div style={styles.field}>
          <label>or Weekday</label>
          <select
            style={styles.smallInput}
            value={weekday}
            onChange={e => {
              setWeekday(e.target.value);
              setDay("");
            }}
          >
            <option value="">—</option>
            {WEEKDAYS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label>Times</label>
          <input
            style={styles.smallInput}
            type="number"
            value={Number(howMany) === 0 ? "" : howMany}
            onFocus={() => setHowMany((prev) => (Number(prev) === 0 ? "" : prev))}
            onChange={e => setHowMany(e.target.value)}
          />
        </div>

        <div style={{ ...styles.field, justifyContent: "flex-end" }}>
          <label>&nbsp;</label>
          <button style={styles.button} onClick={addOverride}>
            Add
          </button>
        </div>
      </div>

      {/* ---------- ACTIVE LIST ---------- */}

      {config.incomeOverrides?.length > 0 && (
        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          <h4>Active Weekly Income Overrides</h4>

          {config.incomeOverrides.map((o, i) => (
            <div key={i} style={styles.listItem}>
              <span>
                {o.name} — ${o.amount}
                {" ("}
                {o.day}
                {typeof o.day === "number" ? "" : ""}
                {o.month ? `, Month ${o.month}` : ""}
                {o.howMany !== -1 ? `, ${o.howMany}x` : ", forever"}
                {")"}
              </span>

              <button onClick={() => removeOverride(i)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}