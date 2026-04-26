import React, { useState, useEffect } from "react";

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

  select: {
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc"
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

export default function StartConfigSettings({ config, setConfig }) {
  const [day, setDay] = useState(config.startConfig.day);
  const [month, setMonth] = useState(config.startConfig.month);

  useEffect(() => {
    setDay(config.startConfig.day);
    setMonth(config.startConfig.month);
  }, [config]);

  const save = () => {
    setConfig(prev => ({
      ...prev,
      startConfig: {
        day: Number(day),
        month: Number(month)
      }
    }));
  };

  const useToday = () => {
    const today = new Date();

    setDay(today.getDate());
    setMonth(today.getMonth() + 1);
    };

  return (
    <div style={styles.container}>
      <h3>Start Date</h3>

      <div style={styles.row}>
        {/* DAY */}
        <div>
          <div style={styles.label}>Day</div>
          <select
            value={day}
            onChange={e => setDay(e.target.value)}
            style={styles.select}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* MONTH */}
        <div>
          <div style={styles.label}>Month</div>
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            style={styles.select}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <button style={styles.button} onClick={save}>
          Save
        </button>
        <button style={styles.button} onClick={useToday}>
          Use Today
        </button>
      </div>
    </div>
  );
}