import { normalizeFinanceConfig } from "./financeConfig";

const HISTORY_KEY = "financeConfigHistory";
export const MAX_CONFIG_SNAPSHOTS = 5;

function cloneConfig(config) {
  return normalizeFinanceConfig(JSON.parse(JSON.stringify(config)));
}

export function loadSnapshotHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSnapshotHistory(snapshots) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(snapshots));
}

/** Prepends a snapshot and trims to MAX_CONFIG_SNAPSHOTS. Returns the new list. */
export function pushSnapshot(config, previousList) {
  const entry = {
    id: String(Date.now()),
    savedAt: new Date().toISOString(),
    config: cloneConfig(config),
  };
  return [entry, ...previousList].slice(0, MAX_CONFIG_SNAPSHOTS);
}

export { cloneConfig };
