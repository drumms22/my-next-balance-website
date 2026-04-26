import React, { useState } from "react";
import ExpenseSelector from "./ExpenseSelector";

const styles = {
  row: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 },
  input: { padding: "12px 14px", fontSize: 16, borderRadius: 8, border: "1px solid #ccc" },
  small: { width: 90, padding: "12px 14px", fontSize: 16, borderRadius: 8, border: "1px solid #ccc" },
    item: {
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #eee",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6
  },
  field: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: 13,
    fontWeight: 600
    },
  button: { padding: "12px 18px", fontSize: 16, borderRadius: 8, border: "none", background: "#dc2626", color: "white", cursor: "pointer" }
};

export default function ExcludeForm({ config, setConfig }) {
  const [name, setName] = useState("");
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [howMany, setHowMany] = useState(-1);

  const add = () => {
    const entry = {
      name,
      month: Number(month),
      day: Number(day),
      howMany: Number(howMany)
    };

    setConfig(prev => ({
      ...prev,
      excludes: [...(prev.excludes || []), entry]
    }));
  };

const remove = (i) => {
    setConfig(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, idx) => idx !== i)
    }));
  };

  return (
    <div>
      <h3>Exclude Expense</h3>

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
            <label>Month</label>
            <input
            style={styles.small}
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
            style={styles.small}
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={e => setDay(e.target.value)}
            />
        </div>

        <div style={styles.field}>
            <label>Times</label>
            <input
            style={styles.small}
            type="number"
            placeholder="-1 forever"
            value={howMany}
            onChange={e => setHowMany(e.target.value)}
            />
        </div>

        <div style={{ ...styles.field, justifyContent: "flex-end" }}>
            <label>&nbsp;</label>
            <button style={styles.button} onClick={add}>
            Add
            </button>
        </div>
        </div>
            {/* LIST */}
        <div style={{maxHeight: "200px", overflowX: config.excludes?.length > 2 ? "auto" : null }}>
        <h4>Active Excludes</h4>
        {config.excludes?.map((e, i) => (
            <div key={i} style={styles.item}>
            <span>
                {e.name || "Exclude"} — ({e.month}/{e.day}) - {e.howMany < 1 ? "Indefinite" : e.howMany}
            </span>
            <button style={{marginLeft: "10px"}} onClick={() => remove(i)}>Remove</button>
            </div>
        ))}
      </div>
    </div>
  );
}