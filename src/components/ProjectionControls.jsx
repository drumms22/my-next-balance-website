import React from "react";

const row = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 12,
};

const monthsSelect = {
  minWidth: 56,
  padding: "10px 32px 10px 14px",
  fontSize: 16,
  lineHeight: 1.35,
  borderRadius: 8,
  border: "1px solid rgba(128, 128, 128, 0.45)",
  backgroundColor: "#1a1a1a",
  color: "rgba(255, 255, 255, 0.92)",
  cursor: "pointer",
  boxSizing: "border-box",
};

const actionBtn = {
  height: 50,
  minWidth: 168,
  padding: "0 22px",
  fontSize: 16,
  fontWeight: 600,
  fontFamily: "inherit",
  borderRadius: 8,
  cursor: "pointer",
  boxSizing: "border-box",
};

const backupsBtn = {
  ...actionBtn,
  backgroundColor: "transparent",
  color: "rgba(255, 255, 255, 0.92)",
  border: "2px solid rgba(255, 255, 255, 0.72)",
};

const ProjectionControls = ({ months, setMonths, run, onOpenBackups }) => {
  return (
    <div style={{ marginBottom: 28, marginTop: 20 }}>
      <div style={row}>
        <label htmlFor="months-to-project" style={{ fontSize: 18, whiteSpace: "nowrap" }}>
          Months to Project:
        </label>

        <select
          id="months-to-project"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          style={monthsSelect}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <button type="button" onClick={run} style={actionBtn}>
          Run Projection
        </button>

        <button type="button" onClick={onOpenBackups} style={backupsBtn}>
          Backups
        </button>
      </div>
    </div>
  );
};

export default ProjectionControls;
