import React, { useState } from "react";

const weekdays = [
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
];

const styles = {
  input: {
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginRight: 10,
    marginBottom: 10
  },

  button: {
    padding: "12px 18px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    marginLeft: "10px"
  },
  select: {
    padding: "12px 14px",
    height: "40px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc"
  }
};

export default function IncomeForm({ config, setConfig }) {
  const [amount, setAmount] = useState("");
  const [weekday, setWeekday] = useState(5);

  const addIncome = () => {
    if (!amount) return;

    const newRule = {
      name: "Income",
      amount: Number(amount),
      frequency: "weekly",
      weekday: Number(weekday)
    };

    setConfig(prev => ({
      ...prev,
      incomeRules: [...(prev.incomeRules || []), newRule]
    }));

    setAmount("");
  };

  const removeRule = (index) => {
    setConfig(prev => ({
      ...prev,
      incomeRules: prev.incomeRules.filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      <h3>Add Weekly Income</h3>

        <input
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <select
          style={styles.select}
          value={weekday}
          onChange={e => setWeekday(e.target.value)}
        >
          {weekdays.map((d, i) => (
            <option key={i} value={i}>{d}</option>
          ))}
        </select>

        <button style={styles.button} onClick={addIncome}>
          Add
        </button>

      {/* ---------- LIST ---------- */}

        {config.incomeRules?.length > 0 && (
          <div style={{ marginTop: 20, maxHeight: "200px", overflowX: config.incomeRules?.length > 2 ? "auto" : null }}>
            <h4>Active Weekly Income</h4>

            {config.incomeRules.map((rule, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid #eee",
                  padding: 8,
                  marginBottom: 6,
                  borderRadius: 6
                }}
              >
                <span>
                  ${rule.amount} — {weekdays[rule.weekday]}
                </span>

                <button onClick={() => removeRule(i)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}