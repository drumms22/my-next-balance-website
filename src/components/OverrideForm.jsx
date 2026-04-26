import React, { useState } from "react";
import ExpenseSelector from "./ExpenseSelector";

const styles = {
  container: {
    marginBottom: 30
  },
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
    background: "#2563eb",
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

export default function OverrideForm({ config, setConfig }) {
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addOverride = () => {
    if (!name || !amount) return;

    const override = {
      month: Number(month),
      day: Number(day),
      name,
      amount: Number(amount)
    };

    setConfig(prev => ({
      ...prev,
      overrides: [...prev.overrides, override]
    }));

    setName("");
    setAmount("");
  };

  const removeOverride = (index) => {
    setConfig(prev => ({
      ...prev,
      overrides: prev.overrides.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={styles.container}>
      <h3>Add Override</h3>

      <div style={styles.row}>
        <div style={styles.field}>
            <label>Name</label>
            <ExpenseSelector
            days={config.days}
            value={name}
            onChange={setName}
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
            value={month}
            onChange={e => setMonth(e.target.value)}
            />
        </div>

        <div style={styles.field}>
            <label>Day</label>
            <input
            style={styles.smallInput}
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={e => setDay(e.target.value)}
            />
        </div>

        <div style={{ ...styles.field, justifyContent: "flex-end" }}>
            <label>&nbsp;</label>
            <button style={styles.button} onClick={addOverride}>
            Add
            </button>
        </div>
    </div>

      {/* ---------- ACTIVE OVERRIDES ---------- */}

      {config.overrides?.length > 0 && (
        <div style={{maxHeight: "200px", overflowX: config.overrides?.length > 2 ? "auto" : null }}>
          <h4>Active Overrides</h4>

          {config.overrides.map((o, i) => (
            <div key={i} style={styles.listItem}>
              <span>
                {o.name} — ${o.amount} (Month {o.month}, Day {o.day})
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