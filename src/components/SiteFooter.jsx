import React from "react";
import { MAIN_CONTENT_PADDING_X_PX } from "../constants/sideRails";

/** Title (2×18) + gaps + copyright line — icon square matches this total height */
const FOOTER_TITLE_PX = 18;
const FOOTER_TITLE_LINES_GAP_PX = 2;
const FOOTER_TITLE_COPY_GAP_PX = 4;
const FOOTER_COPY_PX = 12;
const FOOTER_BRAND_LOGO_PX =
  FOOTER_TITLE_PX +
  FOOTER_TITLE_LINES_GAP_PX +
  FOOTER_TITLE_PX +
  FOOTER_TITLE_COPY_GAP_PX +
  FOOTER_COPY_PX;

const footerOuter = {
  flexShrink: 0,
  width: "100%",
  boxSizing: "border-box",
  borderTop: "1px solid rgba(128, 128, 128, 0.22)",
  paddingTop: 12,
  paddingBottom: "max(8px, env(safe-area-inset-bottom, 0px))",
};

const innerBase = {
  maxWidth: 980,
  width: "100%",
  minWidth: 0,
  margin: "0 auto",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  boxSizing: "border-box",
};

const brandRow = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
};

const brandLogo = {
  width: FOOTER_BRAND_LOGO_PX,
  height: FOOTER_BRAND_LOGO_PX,
  objectFit: "contain",
  borderRadius: 8,
  border: "1px solid rgba(255, 255, 255, 0.28)",
  background: "rgba(0, 0, 0, 0.25)",
  flexShrink: 0,
  boxSizing: "border-box",
};

const brandColumn = {
  display: "flex",
  flexDirection: "column",
  gap: FOOTER_TITLE_COPY_GAP_PX,
  lineHeight: 1,
  minWidth: 0,
};

const brandTitleStack = {
  display: "flex",
  flexDirection: "column",
  gap: FOOTER_TITLE_LINES_GAP_PX,
  lineHeight: 1,
};

const brandLineTop = {
  fontSize: FOOTER_TITLE_PX,
  fontWeight: 900,
  letterSpacing: "-0.02em",
  color: "rgba(255, 255, 255, 0.92)",
};

const brandLineBottom = {
  fontSize: FOOTER_TITLE_PX,
  fontWeight: 900,
  letterSpacing: "-0.02em",
  color: "rgba(255, 255, 255, 0.92)",
};

const copyright = {
  fontSize: FOOTER_COPY_PX,
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.55)",
  letterSpacing: "0.02em",
  lineHeight: 1,
};

const nav = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 14,
  fontSize: 14,
  fontWeight: 600,
};

const link = {
  color: "rgba(147, 197, 253, 0.95)",
  textDecoration: "underline",
  textUnderlineOffset: 3,
};

/**
 * @param {{ paddingX?: number; trailingReservePx?: number }} props
 * trailingReservePx — e.g. room for a fixed bottom-right control so links are not covered.
 */
export default function SiteFooter({ paddingX = MAIN_CONTENT_PADDING_X_PX, trailingReservePx = 0 }) {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print site-footer" style={{ ...footerOuter, paddingLeft: paddingX, paddingRight: paddingX }}>
      <div style={innerBase}>
        <div style={brandRow}>
          <img src="/icon.png" alt="" aria-hidden="true" style={brandLogo} />
          <div style={brandColumn}>
            <div style={brandTitleStack}>
              <span style={brandLineTop}>My Next</span>
              <span style={brandLineBottom}>Balance</span>
            </div>
            <div style={copyright}>© {year}</div>
          </div>
        </div>
        <nav
          style={{
            ...nav,
            ...(trailingReservePx > 0 ? { paddingRight: trailingReservePx } : {}),
          }}
          aria-label="Footer"
        >
          <a href="/" style={link}>
            Home
          </a>
          <a href="/privacy.html" style={link} target="_blank" rel="noopener noreferrer">
            Privacy policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
