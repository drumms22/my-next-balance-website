import { useEffect } from "react";

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 130,
  background: "rgba(0, 0, 0, 0.62)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  boxSizing: "border-box",
};

const dialog = {
  width: "min(440px, 94vw)",
  maxHeight: "min(85vh, 640px)",
  overflow: "auto",
  background: "#141414",
  borderRadius: 14,
  border: "1px solid rgba(128, 128, 128, 0.35)",
  boxShadow: "0 18px 60px rgba(0, 0, 0, 0.55)",
  padding: "20px 20px 18px",
  boxSizing: "border-box",
  textAlign: "left",
  color: "rgba(255, 255, 255, 0.92)",
};

const title = {
  margin: "0 0 12px",
  fontSize: 17,
  fontWeight: 800,
  letterSpacing: "-0.02em",
};

const body = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  opacity: 0.9,
};

const actions = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 12,
  marginTop: 20,
};

const okBtn = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "none",
  background: "#16a34a",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 15,
  fontFamily: "inherit",
};

const link = {
  fontSize: 13,
  textAlign: "center",
  color: "#93c5fd",
  textDecoration: "underline",
  textUnderlineOffset: 3,
};

export default function PrivacyAcknowledgmentModal({ open, onAcknowledge }) {
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
    <div style={overlay} aria-hidden={false}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-ack-title"
        style={dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="privacy-ack-title" style={title}>
          Your privacy
        </h2>
        <p style={body}>
          <strong style={{ opacity: 1 }}>My Next Balance</strong> runs in your browser. The income,
          expenses, and settings you enter are stored <strong style={{ opacity: 1 }}>on your device</strong>{" "}
          (in browser storage) so the app can remember them. We don’t ask you to create an account, and we
          don’t collect or store your financial details on our servers.
        </p>
        <p style={{ ...body, marginTop: 12 }}>
          Like any website, loading the app may generate normal technical requests; our hosting provider may
          process basic connection data needed to deliver the site.
        </p>
        <div style={actions}>
          <button type="button" style={okBtn} onClick={onAcknowledge}>
            OK
          </button>
          <a href="/privacy.html" style={link} target="_blank" rel="noopener noreferrer">
            Privacy policy
          </a>
        </div>
      </div>
    </div>
  );
}
