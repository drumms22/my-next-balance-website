import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { financeData } from "../data/monthly";
import { runProjection } from "../utils/projectionEngine";
import { cloneConfig } from "../utils/configSnapshotStorage";
import { normalizeFinanceConfig } from "../utils/financeConfig";
import {
  MAIN_CONTENT_PADDING_X_PX,
} from "../constants/sideRails";

import ProjectionResults from "../components/ProjectionResults";

import ConfigVersions from "../components/ConfigVersions";

import RecurringExpensesCalendar from "../components/RecurringExpensesCalendar";
import FinancialSetupPanel from "../components/FinancialSetupPanel";

function useIsMobileHeader() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(Boolean(mq.matches));
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);
  return isMobile;
}

// Desktop/web header layout (keeps logo/title from scaling up with vw)
const heroDesktop = {
  maxWidth: 980,
  margin: "0.4rem auto 1rem",
  padding: "0 0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 18,
  flexWrap: "nowrap",
  textAlign: "left",
};

const heroCopyDesktop = {
  maxWidth: 560,
  flex: "0 1 auto",
  textAlign: "left",
  marginTop: 0,
};

const heroMiniTitleDesktop = {
  margin: "0 0 2px",
  fontSize: 56,
  fontWeight: 900,
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
  textAlign: "left",
};

const heroLogoDesktop = {
  display: "block",
  width: 132,
  height: 132,
  objectFit: "contain",
  flexShrink: 0,
  margin: 0,
  borderRadius: 14,
  border: "1px solid rgba(255, 255, 255, 0.42)",
  background: "rgba(0, 0, 0, 0.22)",
  filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))",
};

const leadDesktop = {
  margin: 0,
  fontSize: "1.02rem",
  lineHeight: 1.5,
  opacity: 0.82,
  fontWeight: 400,
};

// Mobile header layout
const heroMobile = {
  maxWidth: "min(900px, calc(100vw - 180px))",
  margin: "0.6rem auto 1.2rem",
  padding: "0 0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(10px, 3vw, 22px)",
  flexWrap: "wrap",
  textAlign: "left",
};

const heroCopyMobile = {
  maxWidth: 520,
  minWidth: 220,
  flex: "1 1 260px",
  textAlign: "left",
  marginTop: 6,
};

const heroMiniTitleMobile = {
  margin: "0 0 2px",
  fontSize: "clamp(20px, 4.2vw, 26px)",
  fontWeight: 900,
  letterSpacing: "-0.02em",
  lineHeight: 1,
  textAlign: "center",
};

const heroLogoMobile = {
  display: "block",
  width: "clamp(112px, 22vw, 168px)",
  height: "clamp(112px, 22vw, 168px)",
  objectFit: "contain",
  flexShrink: 0,
  margin: 0,
  marginTop: 6,
  borderRadius: 14,
  border: "1px solid rgba(255, 255, 255, 0.42)",
  background: "rgba(0, 0, 0, 0.22)",
  filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))",
};

const leadMobile = {
  margin: "0 0 clamp(4px, 0.9vh, 8px)",
  fontSize: "clamp(0.76rem, 2.45vw, 0.98rem)",
  lineHeight: 1.42,
  opacity: 0.82,
  fontWeight: 400,
};

const leadClampMobile = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 6,
  overflow: "hidden",
};

const expensesTab = {
  position: "fixed",
  top: "max(12px, env(safe-area-inset-top, 0px))",
  left: 0,
  zIndex: 50,
  padding: "clamp(10px, 2.8vw, 18px) clamp(6px, 1.6vw, 16px)",
  minHeight: "clamp(120px, 18vh, 160px)",
  width: "clamp(44px, 10vw, 72px)",
  fontWeight: 600,
  fontSize: "clamp(12px, 2.8vw, 16px)",
  lineHeight: 1,
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  letterSpacing: "0.04em",
  cursor: "pointer",
  borderTop: "1px solid rgba(128, 128, 128, 0.45)",
  borderRight: "1px solid rgba(128, 128, 128, 0.45)", // inside edge
  borderBottom: "1px solid rgba(128, 128, 128, 0.45)",
  borderLeft: "none", // screen edge
  borderRadius: "0 10px 10px 0",
  background: "rgba(28, 28, 28, 0.96)",
  color: "rgba(255, 255, 255, 0.92)",
  boxShadow: "0 4px 18px rgba(0, 0, 0, 0.4)",
  boxSizing: "border-box",
};

const setupTab = {
  position: "fixed",
  top: "max(12px, env(safe-area-inset-top, 0px))",
  right: 0,
  zIndex: 50,
  padding: "clamp(10px, 2.8vw, 18px) clamp(6px, 1.6vw, 16px)",
  minHeight: "clamp(120px, 18vh, 160px)",
  width: "clamp(44px, 10vw, 72px)",
  fontWeight: 600,
  fontSize: "clamp(12px, 2.8vw, 16px)",
  lineHeight: 1,
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  letterSpacing: "0.04em",
  cursor: "pointer",
  borderTop: "1px solid rgba(128, 128, 128, 0.45)",
  borderLeft: "1px solid rgba(128, 128, 128, 0.45)", // inside edge
  borderBottom: "1px solid rgba(128, 128, 128, 0.45)",
  borderRight: "none", // screen edge
  borderRadius: "10px 0 0 10px",
  background: "rgba(28, 28, 28, 0.96)",
  color: "rgba(255, 255, 255, 0.92)",
  boxShadow: "0 4px 18px rgba(0, 0, 0, 0.4)",
  boxSizing: "border-box",
};

const edgeTabLabel = {
  display: "inline-block",
  transform: "rotate(180deg)",
};

const helpBtn = {
  position: "fixed",
  right: "clamp(16px, 6vw, 96px)",
  bottom: "max(14px, env(safe-area-inset-bottom, 0px))",
  // Keep below GuideModal overlay (z-index 120) so the intro doesn't peek above the dimmer.
  zIndex: 90,
  width: "clamp(40px, 11vw, 44px)",
  height: "clamp(40px, 11vw, 44px)",
  borderRadius: 999,
  border: "1px solid rgba(128, 128, 128, 0.45)",
  background: "rgba(28, 28, 28, 0.96)",
  color: "rgba(255, 255, 255, 0.92)",
  cursor: "pointer",
  boxShadow: "0 4px 18px rgba(0, 0, 0, 0.4)",
  fontSize: "clamp(14px, 4vw, 18px)",
  fontWeight: 800,
  lineHeight: "clamp(38px, 10.5vw, 42px)",
  textAlign: "center",
  padding: 0,
  boxSizing: "border-box",
};

const backupsOverlay = {
  position: "fixed",
  inset: 0,
  zIndex: 95,
  background: "rgba(0, 0, 0, 0.52)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  boxSizing: "border-box",
};

const backupsDialog = {
  background: "#161616",
  borderRadius: 12,
  border: "1px solid rgba(128, 128, 128, 0.35)",
  maxWidth: "min(520px, 94vw)",
  width: "100%",
  maxHeight: "88vh",
  overflow: "auto",
  padding: "18px 20px 22px",
  boxSizing: "border-box",
  textAlign: "left",
};

const fixedHeader = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 20,
  //paddingTop: "max(12px, env(safe-area-inset-top, 0px))",
  paddingBottom: 8,
  background:
    "linear-gradient(to bottom, rgba(20,20,20,0.98), rgba(20,20,20,0.94) 70%, rgba(20,20,20,0.0))",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
};

const headerInner = {
  width: "100%",
  margin: 0,
  paddingLeft: MAIN_CONTENT_PADDING_X_PX,
  paddingRight: MAIN_CONTENT_PADDING_X_PX,
  boxSizing: "border-box",
  // Let the header height be measured naturally (ResizeObserver sets headerH).
};

const scrollBody = (topOffsetPx) => ({
  position: "relative",
  //height: "100vh",
  paddingTop: topOffsetPx,
  overflow: "hidden",
  boxSizing: "border-box",
});

const scrollContent = (topOffsetPx) => ({
  height: `calc(100vh - ${topOffsetPx}px)`,
  overflowY: "auto",
  overflowX: "hidden",
  paddingLeft: MAIN_CONTENT_PADDING_X_PX,
  paddingRight: MAIN_CONTENT_PADDING_X_PX,
  paddingBottom: 48,
  boxSizing: "border-box",
});

const Home = ({ onOpenGuide, guideModalOpen = false }) => {
  const isMobileHeader = useIsMobileHeader();
  const [monthsToProject, setMonthsToProject] = useState(3);
  const [results, setResults] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [showAlert, setShowAlert] = useState({
    type: "success",
    message: "",
    show: false,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [leftRailOpen, setLeftRailOpen] = useState(false);
  const [rightRailOpen, setRightRailOpen] = useState(false);
  const [backupsOpen, setBackupsOpen] = useState(false);
  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(220);
  const [config, setLocalConfig] = useState(() => {
    const saved = localStorage.getItem("financeConfig");
    const raw = saved ? JSON.parse(saved) : financeData;
    return normalizeFinanceConfig(raw);
  });

  const setConfig = (dataOrUpdater) => {
    setLocalConfig((prev) => {
      const raw = typeof dataOrUpdater === "function" ? dataOrUpdater(prev) : dataOrUpdater;
      return normalizeFinanceConfig(raw);
    });
    handleAlert("success", "Configuration Saved");
  };

  const handleRun = () => {
    console.log(config);
    setHasRun(true);
    setIsRunning(true);
    setTimeout(() => {
      const output = runProjection(config, monthsToProject);
      setResults(output);
      setIsRunning(false);
    }, 2000);
  };

  const handleClearProjection = () => {
    setIsRunning(false);
    setResults([]);
    setHasRun(false);
  };

  useEffect(() => {
    localStorage.setItem("financeConfig", JSON.stringify(config));
    //document.body.style.overflow = "hidden";
  }, [config]);

  useEffect(() => {
    document.body.style.overflow =
      backupsOpen || leftRailOpen || rightRailOpen || guideModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [backupsOpen, leftRailOpen, rightRailOpen, guideModalOpen]);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      const next = Math.max(140, Math.ceil(el.getBoundingClientRect().height));
      setHeaderH(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (guideModalOpen) {
        onOpenGuide?.(false);
        return;
      }
      if (backupsOpen) {
        setBackupsOpen(false);
        return;
      }
      setLeftRailOpen(false);
      setRightRailOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [backupsOpen, guideModalOpen, onOpenGuide]);

  const handleAlert = (type, message) => {
    setShowAlert({
      type: type,
      message: message,
      show: true,
    });
  };

  const handleRestoreSavedConfig = (saved) => {
    setLocalConfig(cloneConfig(saved));
    handleAlert("success", "Loaded saved version");
  };

  const handleCleanSlate = () => {
    if (
      !window.confirm(
        "Reset all configuration to the original template? Unsaved edits will be replaced."
      )
    ) {
      return;
    }
    setLocalConfig(cloneConfig(financeData));
    setResults([]);
    setHasRun(false);
    handleAlert("success", "Reset to defaults");
  };

  const closeRails = () => {
    setLeftRailOpen(false);
    setRightRailOpen(false);
  };

  const railBackdropVisible =
    (leftRailOpen || rightRailOpen) && !backupsOpen;

  const AlertMess = ({ showAlert, onClose }) => {
    useEffect(() => {
      if (!showAlert?.show) return;
      const t = window.setTimeout(() => onClose?.(), 1000);
      return () => window.clearTimeout(t);
    }, [showAlert?.show, onClose]);

    if (!showAlert.show) return null;

    return (
      <p
        className="no-print"
        style={{
          position: "fixed",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: showAlert.type === "danger" ? "#ff0000ff" : "#3b9a00ff",
          borderRadius: "10px",
          fontSize: "30px",
          padding: 20,
          zIndex: 200,
          border: "2px solid #fff",
        }}
      >
        {showAlert.message || "Alerted"}
      </p>
    );
  };

  // Keep rails + edge tabs above the fixed header, but tuck them under overlays/backdrops
  // so the other tab can't be clicked while a panel is open.
  const edgeTabZ = guideModalOpen || railBackdropVisible || backupsOpen ? 30 : 200;
  const edgeTabLeftZ = { ...expensesTab, zIndex: edgeTabZ };
  const edgeTabRightZ = { ...setupTab, zIndex: edgeTabZ };

  return (
    <div className="app-root" style={scrollBody(headerH)}>
      {showAlert.show ? (
        <AlertMess
          showAlert={showAlert}
          onClose={() =>
            setShowAlert({
              message: "",
              type: "success",
              show: false,
            })
          }
        />
      ) : null}

      {railBackdropVisible ? (
        <button
          type="button"
          className="no-print"
          aria-label="Close side panels"
          onClick={closeRails}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 38,
            margin: 0,
            padding: 0,
            border: "none",
            cursor: "pointer",
            background: "rgba(0, 0, 0, 0.42)",
          }}
        />
      ) : null}

      {!leftRailOpen ? (
        <button
          type="button"
          className="no-print"
          style={edgeTabLeftZ}
          onClick={() => setLeftRailOpen(true)}
          aria-expanded={false}
          aria-controls="recurring-expenses-rail"
        >
          <span style={edgeTabLabel}>Expenses</span>
        </button>
      ) : null}

      {!rightRailOpen ? (
        <button
          type="button"
          className="no-print"
          style={edgeTabRightZ}
          onClick={() => setRightRailOpen(true)}
          aria-expanded={false}
          aria-controls="financial-setup-rail"
        >
          <span style={edgeTabLabel}>Setup</span>
        </button>
      ) : null}

      <button
        type="button"
        className="no-print"
        style={helpBtn}
        onClick={() => onOpenGuide?.(true)}
        aria-label="How to use"
        title="How to use"
      >
        i
      </button>

      <header ref={headerRef} className="no-print" style={fixedHeader}>
        <div style={headerInner}>
          <div style={isMobileHeader ? heroMobile : heroDesktop}>
            <img
              src="/logo-full-v1.png"
              alt="My Next Balance"
              style={isMobileHeader ? heroLogoMobile : heroLogoDesktop}
            />
            <div style={isMobileHeader ? heroCopyMobile : heroCopyDesktop}>
              <h1 style={isMobileHeader ? heroMiniTitleMobile : heroMiniTitleDesktop}>My Next Balance</h1>
              <p
                style={
                  isMobileHeader
                    ? { ...leadMobile, ...leadClampMobile }
                    : leadDesktop
                }
              >
                Use the <strong style={{ fontWeight: 600, opacity: 1 }}>Expenses</strong> and{" "}
                <strong style={{ fontWeight: 600, opacity: 1 }}>Setup</strong> tabs on the screen edges
                to slide the panels open. Each panel has{" "}
                <strong style={{ fontWeight: 600, opacity: 1 }}>Edit</strong> for changes.
                {" "}
                We never collect or store your financial details.{" "}
                <a
                  href="/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgba(147, 197, 253, 0.95)",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Privacy policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </header>

      <main style={scrollContent(headerH)}>
        <ProjectionResults
          startingBalance={config.startingBalance}
          data={results}
          isRunning={isRunning}
          hasRun={hasRun}
          monthsToProject={monthsToProject}
          setMonthsToProject={setMonthsToProject}
          run={handleRun}
          onOpenBackups={() => setBackupsOpen(true)}
          onClearProjection={handleClearProjection}
        />
      </main>

      <div id="recurring-expenses-rail" className="no-print">
        <RecurringExpensesCalendar
          config={config}
          setConfig={setConfig}
          days={financeData.days}
          isOpen={leftRailOpen}
          onClose={() => setLeftRailOpen(false)}
        />
      </div>
      <div id="financial-setup-rail" className="no-print">
        <FinancialSetupPanel
          config={config}
          setConfig={setConfig}
          isOpen={rightRailOpen}
          onClose={() => setRightRailOpen(false)}
        />
      </div>

      {backupsOpen ? (
        <div className="no-print" style={backupsOverlay} onClick={() => setBackupsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-versions-heading"
            style={backupsDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <ConfigVersions
              variant="modal"
              onClose={() => setBackupsOpen(false)}
              config={config}
              onRestoreConfig={handleRestoreSavedConfig}
              onCleanSlate={handleCleanSlate}
              onAlert={handleAlert}
            />
          </div>
        </div>
      ) : null}

    </div>
  );
};

export default Home;
