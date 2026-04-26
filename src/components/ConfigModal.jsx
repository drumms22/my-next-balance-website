import React from "react";
import IncomeForm from "./IncomeForm.jsx";
import OverrideForm from "./OverrideForm";
import FinancialSettings from "./FinancialSettings";
import ExtraIncomeForm from "./ExtraIncomeForm";
import ExcludeForm from "./ExcludeForm.jsx";
import StartConfigSettings from "./StartConfigSettings.jsx";
import IncomeOverrideForm from "./IncomeOverrideForm.jsx";

const ConfigModal = ({ config, setConfig, onClose }) => {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Edit financial setup</h2>
        <p style={{ marginTop: 0, marginBottom: 22, opacity: 0.75, fontSize: 14, lineHeight: 1.5 }}>
          Starting date, balances, income rules, one-off items, and exclusions. Close when finished
          — the Financial setup panel updates on save.
        </p>

        <StartConfigSettings config={config} setConfig={setConfig} />
        <FinancialSettings config={config} setConfig={setConfig} />
        <IncomeForm config={config} setConfig={setConfig} />
        <IncomeOverrideForm config={config} setConfig={setConfig} />
        <ExtraIncomeForm config={config} setConfig={setConfig} />
        <OverrideForm config={config} setConfig={setConfig} />
        <ExcludeForm config={config} setConfig={setConfig} />

        <button style={{ marginTop: 36, fontSize: "1rem", minHeight: 44 }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ConfigModal;

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  background: "rgba(0,0,0,.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  position: "relative",
  zIndex: 101,
  background: "black",
  padding: 30,
  borderRadius: 10,
  width: 600,
  maxWidth: "min(600px, 94vw)",
  maxHeight: "93%",
  overflowX: "auto",
  textAlign: "left",
  boxSizing: "border-box",
};