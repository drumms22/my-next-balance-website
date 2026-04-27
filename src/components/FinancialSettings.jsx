import React, { useState, useEffect } from "react";
import { normalizeFinanceConfig } from "../utils/financeConfig";

const styles = {
  container: {
    marginBottom: 30
  },

  row: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },

  input: {
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    width: 80
  },

  label: {
    fontWeight: 600,
    marginRight: 6
  },

  button: {
    padding: "12px 18px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#16a34a",
    color: "white",
    cursor: "pointer"
  }
};

export default function FinancialSettings({ config, setConfig }) {
  const [startingBalance, setStartingBalance] = useState(config.startingBalance);
  const [weeklySpending, setWeeklySpending] = useState(config.weeklySpending);

  useEffect(() => {
    setStartingBalance(config.startingBalance);
    setWeeklySpending(config.weeklySpending);
  }, [config]);

  const saveSettings = () => {
    setConfig((prev) =>
      normalizeFinanceConfig({
        ...prev,
        weeklySpendingMode: "flat",
        weeklySpendingItems: [],
        startingBalance: Number(startingBalance),
        weeklySpending: Number(weeklySpending),
      })
    );
  };

  return (
    <div style={styles.container}>
      <h3>Financial Settings</h3>

      <div style={styles.row}>
        <div>
          <div style={styles.label}>Starting Balance</div>
          <input
            style={styles.input}
            type="number"
            value={Number(startingBalance) === 0 ? "" : startingBalance}
            onChange={e => setStartingBalance(e.target.value)}
            onFocus={() => setStartingBalance((prev) => (Number(prev) === 0 ? "" : prev))}
          />
        </div>

        <div>
          <div style={styles.label}>Weekly Spending</div>
          <input
            style={styles.input}
            type="number"
            value={Number(weeklySpending) === 0 ? "" : weeklySpending}
            onChange={e => setWeeklySpending(e.target.value)}
            onFocus={() => setWeeklySpending((prev) => (Number(prev) === 0 ? "" : prev))}
          />
        </div>

        <button style={styles.button} onClick={saveSettings}>
          Save
        </button>
      </div>
    </div>
  );
}