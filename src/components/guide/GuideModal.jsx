import React, { useEffect } from "react";
import AppGuideContent from "./AppGuideContent";

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 120,
  background: "rgba(0, 0, 0, 0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  boxSizing: "border-box",
};

const dialog = {
  width: "min(920px, 96vw)",
  maxHeight: "min(88vh, 900px)",
  overflow: "auto",
  background: "#141414",
  borderRadius: 14,
  border: "1px solid rgba(128, 128, 128, 0.35)",
  boxShadow: "0 18px 60px rgba(0, 0, 0, 0.55)",
  padding: "16px 16px 18px",
  boxSizing: "border-box",
  textAlign: "left",
  color: "rgba(255, 255, 255, 0.92)",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 8,
};

const title = {
  margin: 0,
  fontSize: 16,
  fontWeight: 800,
};

const closeBtn = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid rgba(128, 128, 128, 0.35)",
  background: "rgba(26, 26, 26, 0.9)",
  color: "rgba(255, 255, 255, 0.92)",
  cursor: "pointer",
  fontWeight: 700,
};

export default function GuideModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
        className="guideCard guideCardModal"
        style={dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={topBar}>
          <h2 id="guide-modal-title" style={title}>
            How My Next Balance works
          </h2>
          <button type="button" style={closeBtn} onClick={onClose}>
            Close
          </button>
        </div>

        <AppGuideContent variant="modal" />
      </div>
    </div>
  );
}
