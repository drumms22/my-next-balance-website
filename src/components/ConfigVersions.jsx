import React, { useState } from "react";
import {
  loadSnapshotHistory,
  persistSnapshotHistory,
  pushSnapshot,
  MAX_CONFIG_SNAPSHOTS,
} from "../utils/configSnapshotStorage";

const boxPage = {
  border: "1px solid rgba(128, 128, 128, 0.35)",
  borderRadius: 10,
  padding: "14px 16px 16px",
  margin: "12px auto 0",
  maxWidth: 520,
  width: "100%",
  boxSizing: "border-box",
};

const boxModal = {
  border: "none",
  borderRadius: 10,
  padding: "0 4px 8px",
  margin: 0,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
};

const row = { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" };

const versionSelect = {
  height: 40,
  fontSize: 15,
  lineHeight: 1.25,
  borderRadius: 8,
  border: "1px solid rgba(128, 128, 128, 0.45)",
  backgroundColor: "#1a1a1a",
  color: "rgba(255, 255, 255, 0.92)",
  padding: "0 12px",
  cursor: "pointer",
  boxSizing: "border-box",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 14,
  paddingBottom: 12,
  borderBottom: "1px solid rgba(128, 128, 128, 0.3)",
};

const modalTitle = {
  margin: 0,
  fontSize: "1rem",
  fontWeight: 600,
  letterSpacing: "0.02em",
  textAlign: "left",
};

const closeBtn = {
  height: 40,
  padding: "0 16px",
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 8,
  cursor: "pointer",
  flexShrink: 0,
};

const ConfigVersions = ({
  config,
  onRestoreConfig,
  onCleanSlate,
  onAlert,
  variant = "page",
  onClose,
}) => {
  const isModal = variant === "modal";
  const [snapshots, setSnapshots] = useState(loadSnapshotHistory);
  const [selectedId, setSelectedId] = useState("");

  const persistAndSet = (next) => {
    persistSnapshotHistory(next);
    setSnapshots(next);
  };

  const handleSaveVersion = () => {
    const next = pushSnapshot(config, snapshots);
    persistAndSet(next);
    setSelectedId(next[0]?.id ?? "");
    onAlert?.("success", `Saved version (${next.length}/${MAX_CONFIG_SNAPSHOTS} slots)`);
  };

  const handleLoad = () => {
    const snap = snapshots.find((s) => s.id === selectedId);
    if (!snap?.config) {
      onAlert?.("danger", "Pick a saved version first");
      return;
    }
    onRestoreConfig(snap.config);
  };

  const handleClearHistory = () => {
    if (!snapshots.length) return;
    if (
      !window.confirm(
        "Remove all saved versions? Your current editor state stays as-is until you change it."
      )
    ) {
      return;
    }
    persistAndSet([]);
    setSelectedId("");
    onAlert?.("success", "Saved versions cleared");
  };

  return (
    <section
      style={isModal ? boxModal : boxPage}
      aria-labelledby="saved-versions-heading"
    >
      {isModal && onClose ? (
        <div style={modalHeader}>
          <h2 id="saved-versions-heading" style={modalTitle}>
            Backups (this browser)
          </h2>
          <button type="button" style={closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <h2
          id="saved-versions-heading"
          style={{
            marginTop: 0,
            marginBottom: 6,
            fontSize: "0.95rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          Backups (this browser)
        </h2>
      )}

      <p style={{ marginTop: 0, marginBottom: 14, opacity: 0.72, fontSize: 13, lineHeight: 1.45 }}>
        Optional: save up to {MAX_CONFIG_SNAPSHOTS} restore points. Your working data still saves
        automatically in this browser.
      </p>

      <div style={{ ...row, marginBottom: 12 }}>
        <button type="button" style={{ height: 40 }} onClick={handleSaveVersion}>
          Save current as version
        </button>
        {snapshots.length > 0 && (
          <button type="button" style={{ height: 40 }} onClick={handleClearHistory}>
            Clear all versions
          </button>
        )}
      </div>

      <div style={{ ...row, marginBottom: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 220px" }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>Load a version</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={versionSelect}
          >
            <option value="">Select…</option>
            {snapshots.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.savedAt).toLocaleString()}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          style={{ height: 40, alignSelf: "flex-end" }}
          disabled={!selectedId}
          onClick={handleLoad}
        >
          Load selected
        </button>
      </div>

      <div style={row}>
        <button
          type="button"
          style={{ height: 40, border: "1px solid rgba(220, 80, 80, 0.85)", color: "#e85d5d" }}
          onClick={onCleanSlate}
        >
          Clean slate (reset to defaults)
        </button>
      </div>
    </section>
  );
};

export default ConfigVersions;
