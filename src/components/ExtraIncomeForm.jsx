import React, { useState } from "react";

const styles = {
  row: {
    display: "flex",
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

  small: {
    width: 90,
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc"
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
field: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: 13,
    fontWeight: 600
    },
  item: {
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #eee",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6
  },
  label: {}
};

export default function ExtraIncomeForm({ config, setConfig }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const add = () => {
    if (!amount) return;

    const entry = {
      name,
      amount: Number(amount),
      month: Number(month),
      day: Number(day)
    };

    setConfig(prev => ({
      ...prev,
      extraIncome: [...(prev.extraIncome || []), entry]
    }));

    setName("");
    setAmount("");
  };

  const remove = (i) => {
    setConfig(prev => ({
      ...prev,
      extraIncome: prev.extraIncome.filter((_, idx) => idx !== i)
    }));
  };

  return (
    <div>
      <h3>Extra Income</h3>

      <div style={styles.row}>
        <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
            style={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
            />
        </div>

        <div style={styles.field}>
            <label style={styles.label}>Amount</label>
            <input
            style={styles.input}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            />
        </div>

        <div style={styles.field}>
            <label style={styles.label}>Month</label>
            <input
            style={styles.small}
            type="number"
            min="1"
            max="12"
            value={Number(month) === 0 ? "" : month}
            onFocus={() => setMonth((prev) => (Number(prev) === 0 ? "" : prev))}
            onChange={e => setMonth(e.target.value)}
            />
        </div>

        <div style={styles.field}>
            <label style={styles.label}>Day</label>
            <input
            style={styles.small}
            type="number"
            min="1"
            max="31"
            value={Number(day) === 0 ? "" : day}
            onFocus={() => setDay((prev) => (Number(prev) === 0 ? "" : prev))}
            onChange={e => setDay(e.target.value)}
            />
        </div>

        <div style={{ ...styles.field, justifyContent: "flex-end" }}>
            <label style={styles.label}>&nbsp;</label>
            <button style={styles.button} onClick={add}>
            Add
            </button>
        </div>
        </div>
        <div style={{maxHeight: "200px", overflowX: config.extraIncome?.length > 2 ? "auto" : null }}>
        <h4>Active Extra Income</h4>
        {config.extraIncome?.map((e, i) => (
            <div key={i} style={styles.item}>
            <span>
                {e.name || "Extra Income"} — ${e.amount} ({e.month}/{e.day})
            </span>
            <button onClick={() => remove(i)}>Remove</button>
            </div>
        ))}
      </div>
    </div>
  );
}