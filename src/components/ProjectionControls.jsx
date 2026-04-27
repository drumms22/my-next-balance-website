import React, { useEffect, useState } from "react";

const wrap = {
  marginBottom: 28,
  marginTop: 20,
  width: "100%",
  maxWidth: 560,
  marginLeft: "auto",
  marginRight: "auto",
  boxSizing: "border-box",
};

const primaryRow = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 12,
};

const secondaryRowBase = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "center",
  gap: 12,
  marginTop: 12,
  width: "100%",
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

const backupsBtnBase = {
  ...actionBtn,
  backgroundColor: "transparent",
  color: "rgba(255, 255, 255, 0.92)",
  border: "2px solid rgba(255, 255, 255, 0.72)",
};

/** Matches Run / Backups / Upload width on narrow screens */
const MOBILE_ACTION_BTN_WIDTH = "min(260px, calc(100% - 8px))";

function useStackSecondaryButtons() {
  const [stack, setStack] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setStack(Boolean(mq.matches));
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);
  return stack;
}

const ProjectionControls = ({
  months,
  setMonths,
  run,
  onOpenBackups,
  onOpenUpload = () => {},
}) => {
  const stackSecondary = useStackSecondaryButtons();
  const secondaryRow = {
    ...secondaryRowBase,
    flexDirection: stackSecondary ? "column" : "row",
    alignItems: stackSecondary ? "center" : "stretch",
  };
  const mobileBtnSizing = stackSecondary
    ? {
        flex: "none",
        width: MOBILE_ACTION_BTN_WIDTH,
        minWidth: 168,
        alignSelf: "center",
      }
    : null;

  const runBtnStyle = {
    ...actionBtn,
    ...(mobileBtnSizing || {}),
  };

  const backupsBtn = {
    ...backupsBtnBase,
    ...(stackSecondary
      ? mobileBtnSizing
      : { flex: "1 1 0", minWidth: 0 }),
  };

  return (
    <div style={wrap}>
      <div style={primaryRow}>
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

        <button type="button" onClick={run} style={runBtnStyle}>
          Run Projection
        </button>
      </div>

      <div style={secondaryRow}>
        <button type="button" onClick={onOpenBackups} style={backupsBtn}>
          Backups
        </button>
        <button type="button" onClick={onOpenUpload} style={backupsBtn}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default ProjectionControls;
