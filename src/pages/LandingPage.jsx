import React from "react";
import AppGuideContent from "../components/guide/AppGuideContent";
import SiteFooter from "../components/SiteFooter";

const page = {
  minHeight: "100vh",
  boxSizing: "border-box",
  padding: "28px 0 0",
  display: "flex",
  flexDirection: "column",
  background: "radial-gradient(1200px 700px at 50% 0%, rgba(80, 80, 80, 0.35), rgba(20, 20, 20, 1))",
  color: "rgba(255, 255, 255, 0.92)",
};

const shell = {
  maxWidth: 980,
  margin: "0 auto",
  flex: "1 0 auto",
  width: "100%",
  padding: "0 18px 40px",
  boxSizing: "border-box",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 18,
};

const brand = {
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontWeight: 900,
  letterSpacing: "-0.02em",
  lineHeight: 1,
};

const brandText = {
  display: "flex",
  flexDirection: "column",
};

const brandLineTop = {
  fontSize: 30,
  opacity: 0.92,
};

const brandLineBottom = {
  fontSize: 30,
};

const brandLogo = {
  width: 56,
  height: 56,
  objectFit: "contain",
  borderRadius: 8,
  border: "1px solid rgba(255, 255, 255, 0.28)",
  background: "rgba(0, 0, 0, 0.25)",
  flexShrink: 0,
};

const actions = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const btnPrimary = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(135deg, #2563eb 0%, #22c55e 100%)",
  color: "white",
  fontWeight: 700,
  fontSize: 14,
};

const btnGhost = {
  ...btnPrimary,
  background: "transparent",
  border: "2px solid rgba(255, 255, 255, 0.72)",
};

const tagline = {
  margin: "0 0 20px",
  maxWidth: 640,
  fontSize: "clamp(15px, 2.4vw, 17px)",
  lineHeight: 1.55,
  fontWeight: 600,
  opacity: 0.88,
};

const card = {
  border: "1px solid rgba(128, 128, 128, 0.35)",
  background: "rgba(22, 22, 22, 0.72)",
  borderRadius: 14,
  padding: "18px 16px 20px",
  boxSizing: "border-box",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

export default function LandingPage({ onContinue }) {
  return (
    <div style={page}>
      <div style={shell}>
        <div className="landingTopRow" style={topRow}>
          <h1 className="landingBrand" style={brand}>
            <img src="/icon.png" alt="" aria-hidden="true" style={brandLogo} />
            <span style={brandText}>
              <span style={brandLineTop}>My Next</span>
              <span style={brandLineBottom}>Balance</span>
            </span>
          </h1>
          <div className="landingActions" style={actions}>
            <button type="button" style={btnGhost} onClick={() => onContinue()}>
              Skip intro
            </button>
            <button type="button" style={btnPrimary} onClick={() => onContinue()}>
              Get started
            </button>
          </div>
        </div>

        <p style={tagline}>
          Free <strong style={{ fontWeight: 700, opacity: 1 }}>cash flow calculator</strong> and{" "}
          <strong style={{ fontWeight: 700, opacity: 1 }}>balance projection</strong> — forecast your bank
          balance day-by-day after bills and income. No sign-up.
        </p>

        <div className="guideCard guideCardLanding" style={card}>
          <AppGuideContent variant="landing" />
        </div>
      </div>
      <SiteFooter paddingX={14} />
    </div>
  );
}
