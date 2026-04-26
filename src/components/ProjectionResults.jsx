import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { format, getDay } from "date-fns";
import ToolTip from "./ToolTip";
import DayTooltip from "./DayTooltip";
import ProjectionControls from "./ProjectionControls";
import loadingImg from "../assets/images/loading.gif";

const weekdayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const styles = {
    resultsContainer: {
        width: "100%",
        paddingBottom: 20
    },

    resultsHeader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        marginTop: 40,
        marginBottom: "clamp(18px, 4vh, 34px)",
        flexWrap: "wrap"
    },

    headerRow: {
        position: "relative",
        width: "100%",
        // Reserve space for the stacked action icons so header + first result card
        // don't feel cramped against them on small screens.
        paddingRight: 0,
        boxSizing: "border-box",
    },

    headerIcons: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexDirection: "column",
    },

    iconBtn: {
        width: 46,
        height: 46,
        borderRadius: 10,
        border: "1px solid rgba(128, 128, 128, 0.35)",
        // Keep icon buttons visually consistent in both light/dark OS themes.
        // (Global `index.css` uses a light button surface in `prefers-color-scheme: light`,
        // which can make white SVG strokes effectively invisible.)
        background: "rgba(18, 18, 18, 0.92)",
        color: "rgba(255, 255, 255, 0.92)",
        cursor: "pointer",
        fontSize: 20,
        fontWeight: 800,
        lineHeight: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
    },

    balancePill: {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        padding: "12px 18px",
        borderRadius: 12,
        border: "1px solid rgba(128, 128, 128, 0.35)",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.92)",
    },

    balanceLabel: {
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        opacity: 0.72,
        whiteSpace: "nowrap",
    },

    balanceValue: {
        fontSize: 21,
        fontWeight: 800,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        opacity: 0.98,
    },

    headerArrow: {
        fontSize: 18,
        opacity: 0.7,
        lineHeight: 1,
        userSelect: "none",
    },

    monthToggle: {
        border: "1px solid #ddd",
        borderRadius: 10,
        marginBottom: 22,
        width: "100%",
    },

    monthSummaryRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 16,
        width: "100%"
    },

    monthToggleSummary: {
        listStyle: "none",
        cursor: "pointer",
        padding: "14px 16px",
        background: "rgba(255,255,255,0.04)",
        userSelect: "none"
    },

    monthToggleSummaryTitle: {
        fontSize: 22,
        fontWeight: "bold",
        margin: 0
    },

    monthToggleSummaryMeta: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 2,
        fontSize: 12,
        opacity: 0.85
    },

    monthToggleHint: {
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        opacity: 0.72,
        whiteSpace: "nowrap",
        marginTop: 8,
        textAlign: "center",
    },

    monthToggleBody: {
        padding: 20,
        overflowX: "auto"
    },

    weekList: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },

    weekCard: {
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 12,
        overflow: "hidden",
        background: "rgba(0,0,0,0.10)",
    },

    weekCardSummary: {
        listStyle: "none",
        cursor: "pointer",
        padding: "12px 12px",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 10,
        userSelect: "none",
    },

    weekCardTitle: {
        fontWeight: 800,
        fontSize: 13,
        opacity: 0.95,
        whiteSpace: "nowrap",
    },

    weekCardMeta: {
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        fontSize: 12,
        opacity: 0.9,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
    },

    weekDaysList: {
        borderTop: "1px solid rgba(255,255,255,0.10)",
        padding: "10px 12px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    weekDayRow: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.92)",
        fontVariantNumeric: "tabular-nums",
    },

    weekDayDate: {
        fontWeight: 800,
        fontSize: 12,
        opacity: 0.92,
        whiteSpace: "nowrap",
    },

    weekDayTotals: {
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
        alignItems: "baseline",
        fontSize: 12,
        whiteSpace: "nowrap",
    },

    month: {
        border: "1px solid #ddd",
        padding: 20,
        marginBottom: 30,
        borderRadius: 10,
        width: "100%"
    },

    week: {
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gap: 6,
        marginBottom: 6
    },

    day: {
        border: "1px solid #eee",
        padding: 8,
        minHeight: 104,
        borderRadius: 6,
        fontSize: 12,
        background: "#fafafa",
        color: "#000",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        overflow: "hidden",
    },

    dayCardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        fontWeight: 800,
        fontSize: 12,
        lineHeight: 1.1,
    },

    dayCardBody: {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        paddingRight: 2, // keep scrollbar from covering text
    },

    itemRow: {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 6,
        alignItems: "baseline",
        fontSize: 11,
        lineHeight: 1.15,
    },

    itemName: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        opacity: 0.92,
    },

    itemAmount: {
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        fontWeight: 700,
    },

    emptyDayText: {
        fontSize: 11,
        opacity: 0.55,
    },

    dayCardFooter: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 2,
        paddingTop: 6,
        borderTop: "1px solid rgba(0,0,0,0.08)",
        fontSize: 11,
        lineHeight: 1.1,
        fontVariantNumeric: "tabular-nums",
    },

    income: {
        color: "green"
    },

    spent: {
        color: "red"
    },

    balance: {
        fontWeight: "bold"
    },
    monthSummary: {
    marginTop: 20,
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 16,
    background: "#fafafa",
    maxWidth: 320,
    color: "#000"
    },

    summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 14
    },

    divider: {
    borderTop: "1px solid #ddd",
    margin: "10px 0"
    },

    positive: {
    color: "#16a34a",
    fontWeight: 600
    },

    negative: {
    color: "#dc2626",
    fontWeight: 600
    },
    weekHeader: {
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        marginBottom: 8,
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center"
    },

    weekHeaderCell: {
        paddingBottom: 4
    }   
};

function formatMoney(n) {
  const num = typeof n === "number" ? n : Number(n);
  if (Number.isNaN(num)) return "$0";
  return `$${num.toFixed(0)}`;
}

function groupByMonth(data) {
  const monthMap = {};

  data.forEach(day => {
    const key = format(day.date, "yyyy-MM");
    if (!monthMap[key]) monthMap[key] = [];
    monthMap[key].push(day);
  });

  return monthMap;
}

const ProjectionResults = ({
  data = [],
  startingBalance = 0,
  isRunning = false,
  hasRun = false,
  monthsToProject,
  setMonthsToProject,
  run,
  onOpenBackups,
  onClearProjection,
}) => {
  const printSnapshotRef = useRef(null);
  const printFallbackTimerRef = useRef(null);

  const [isMobileTooltip, setIsMobileTooltip] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 640px)");
    const update = () => setIsMobileTooltip(Boolean(mq.matches));
    update();
    // Safari < 14 fallback
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const showConfig = !hasRun && !isRunning;
  const showLoader = isRunning;
  const showResults = !isRunning && data.length > 0;

  const monthsByKey = useMemo(() => (showResults ? groupByMonth(data) : {}), [showResults, data]);
  const [openMonths, setOpenMonths] = useState({});

  useEffect(() => {
    if (!showResults) return;
    // We intentionally reset the open/closed month UI state when new results arrive.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenMonths({});
  }, [showResults, data]);

  const restorePrintSnapshot = useCallback(() => {
    const snap = printSnapshotRef.current;
    printSnapshotRef.current = null;
    if (snap) setOpenMonths(snap);

    if (printFallbackTimerRef.current) {
      window.clearTimeout(printFallbackTimerRef.current);
      printFallbackTimerRef.current = null;
    }
  }, []);

  const handlePrintProjection = useCallback(() => {
    const keys = Object.keys(monthsByKey);
    if (keys.length === 0) return;

    // Expand all months for printing (closed <details> won't print body content consistently).
    printSnapshotRef.current = openMonths;
    const expanded = keys.reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});

    flushSync(() => {
      setOpenMonths(expanded);
    });

    window.addEventListener("afterprint", restorePrintSnapshot, { once: true });
    // Some browsers don't fire afterprint reliably; keep UI from getting stuck expanded.
    printFallbackTimerRef.current = window.setTimeout(() => {
      restorePrintSnapshot();
    }, 1500);
    window.print();
  }, [monthsByKey, openMonths, restorePrintSnapshot]);

  if (showConfig) {
    return (
      <div style={styles.resultsContainer}>
        <ProjectionControls
          months={monthsToProject}
          setMonths={setMonthsToProject}
          run={run}
          onOpenBackups={onOpenBackups}
        />
      </div>
    );
  }

  if (showLoader) {
    return (
      <div style={styles.resultsContainer}>
        <img
          src={loadingImg}
          style={{
            width: "auto",
            maxWidth: "min(280px, 70vw)",
            maxHeight: 180,
            margin: "48px auto 0",
            borderRadius: "5px",
            display: "block",
          }}
          alt=""
        />
      </div>
    );
  }

  if (!showResults) {
    return (
      <div style={styles.resultsContainer}>
        <ProjectionControls
          months={monthsToProject}
          setMonths={setMonthsToProject}
          run={run}
          onOpenBackups={onOpenBackups}
        />
        <div style={{ opacity: 0.8, textAlign: "center" }}>No results to display.</div>
      </div>
    );
  }

  return (
    <div id="projection-print-root" style={styles.resultsContainer}>
        <div style={{ ...styles.headerRow, paddingRight: isMobileTooltip ? 72 : 0 }}>
          <div className="resultsHeader" style={styles.resultsHeader}>
              <div
                className="balancePill"
                style={
                  isMobileTooltip
                    ? { ...styles.balancePill, padding: "10px 14px" }
                    : { ...styles.balancePill, flexDirection: "row", alignItems: "baseline", gap: 10 }
                }
              >
                <span className="balanceLabel" style={styles.balanceLabel}>Starting</span>
                <span
                  className="balanceValue"
                  style={isMobileTooltip ? { ...styles.balanceValue, fontSize: 18 } : styles.balanceValue}
                >
                  ${startingBalance.toFixed(2)}
                </span>
              </div>
              <span className="headerArrow" aria-hidden="true" style={styles.headerArrow}>→</span>
              <div
                className="balancePill"
                style={
                  isMobileTooltip
                    ? { ...styles.balancePill, padding: "10px 14px" }
                    : { ...styles.balancePill, flexDirection: "row", alignItems: "baseline", gap: 10 }
                }
              >
                <span className="balanceLabel" style={styles.balanceLabel}>Ending</span>
                <span
                  className="balanceValue"
                  style={isMobileTooltip ? { ...styles.balanceValue, fontSize: 18 } : styles.balanceValue}
                >
                  ${data[data.length - 1].balance.toFixed(2)}
                </span>
              </div>
          </div>

          <div className="no-print" style={styles.headerIcons} aria-label="Projection actions">
            <button
              type="button"
              style={styles.iconBtn}
              title="Export to PDF (print)"
              aria-label="Export to PDF"
              onClick={handlePrintProjection}
            >
              <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>
                📄
              </span>
            </button>
            <button
              type="button"
              style={styles.iconBtn}
              title="Clear projection"
              aria-label="Clear projection"
              onClick={() => onClearProjection?.()}
            >
              <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>
                🗑
              </span>
            </button>
          </div>
        </div>
        {Object.entries(monthsByKey).map(([monthKey, days], index) => {
            const monthName = format(days[0].date, "MMMM yyyy");

            let monthIncome = 0;
            let monthSpent = 0;

            days.forEach(d => {
            monthIncome += d.income;
            monthSpent += d.spent;
            });

            // group into weeks
            const weeks = [];
            let currentWeek = [];

            days.forEach(day => {
            if (currentWeek.length === 0) {
                const weekday = getDay(day.date);

                for (let i = 0; i < weekday; i++) {
                currentWeek.push(null);
                }
            }

            currentWeek.push(day);

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            });

            if (currentWeek.length) {
            while (currentWeek.length < 7) currentWeek.push(null);
            weeks.push(currentWeek);
            }

            const startingForMonth = index === 0 ? startingBalance : days[0].balance;
            const endingForMonth = days[days.length - 1].balance;
            const netChange = endingForMonth - startingForMonth;
            const isOpen = Boolean(openMonths[monthKey]);

            return (
            <details
              key={monthKey}
              style={styles.monthToggle}
              open={isOpen}
              onToggle={(e) => {
                const detailsEl = e?.currentTarget ?? e?.target;
                const nextOpen = Boolean(detailsEl?.open);
                setOpenMonths((prev) => ({
                  ...prev,
                  [monthKey]: nextOpen,
                }));
              }}
            >
                <summary style={styles.monthToggleSummary}>
                    <div style={styles.monthSummaryRow}>
                        <div style={styles.monthToggleSummaryTitle}>{monthName}</div>
                        <div style={styles.monthToggleSummaryMeta}>
                            <div>Ending: <strong>${endingForMonth.toFixed(0)}</strong></div>
                            <div style={netChange >= 0 ? styles.positive : styles.negative}>
                                {netChange >= 0 ? "+" : ""}{netChange.toFixed(0)}
                            </div>
                        </div>
                    </div>
                    <div className="no-print" style={styles.monthToggleHint}>
                      Click to {isOpen ? "Close" : "Open"}
                    </div>
                </summary>

                <div style={styles.monthToggleBody}>
                    {isMobileTooltip ? (
                      <div style={styles.weekList}>
                        {weeks.map((week, i) => {
                          const realDays = week.filter(Boolean);
                          const start = realDays[0]?.date;
                          const end = realDays[realDays.length - 1]?.date;

                          const weekIncome = realDays.reduce((acc, d) => acc + (d?.income || 0), 0);
                          const weekSpent = realDays.reduce((acc, d) => acc + (d?.spent || 0), 0);
                          const weekEnding = realDays[realDays.length - 1]?.balance;

                          const title =
                            start && end ? `${format(start, "MMM d")}–${format(end, "MMM d")}` : `Week ${i + 1}`;

                          return (
                            <details key={i} style={styles.weekCard}>
                              <summary style={styles.weekCardSummary}>
                                <div style={styles.weekCardTitle}>{title}</div>
                                <div style={styles.weekCardMeta}>
                                  <span style={styles.income}>+{formatMoney(weekIncome)}</span>
                                  <span style={styles.spent}>-{formatMoney(weekSpent)}</span>
                                  <span style={{ ...styles.balance, opacity: 0.95 }}>
                                    {weekEnding != null ? formatMoney(weekEnding) : ""}
                                  </span>
                                </div>
                              </summary>

                              <div style={styles.weekDaysList}>
                                {realDays.map((day, dIdx) => (
                                  <ToolTip
                                    key={dIdx}
                                    content={<DayTooltip day={day} />}
                                    delay={0}
                                    theme="light-border"
                                    trigger="click"
                                    interactive={true}
                                    placement="top"
                                  >
                                    <div style={styles.weekDayRow}>
                                      <div style={styles.weekDayDate}>{format(day.date, "EEE d")}</div>
                                      <div style={styles.weekDayTotals}>
                                        <span style={styles.income}>+{formatMoney(day.income || 0)}</span>
                                        <span style={styles.spent}>-{formatMoney(day.spent || 0)}</span>
                                        <span style={styles.balance}>{formatMoney(day.balance)}</span>
                                      </div>
                                    </div>
                                  </ToolTip>
                                ))}
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        <div style={styles.weekHeader}>
                          {weekdayHeaders.map((day) => (
                            <div key={day} style={styles.weekHeaderCell}>
                              {day}
                            </div>
                          ))}
                        </div>
                        {weeks.map((week, i) => (
                          <div key={i} style={styles.week}>
                            {week.map((day, idx) => (
                              <ToolTip
                                key={idx}
                                content={<DayTooltip day={day} />}
                                delay={[200, 0]}
                                theme="light-border"
                              >
                                <div key={idx} className="dayCell" style={styles.day}>
                                  {day ? (
                                    <>
                                      <div style={styles.dayCardHeader}>
                                        <div>{format(day.date, "d")}</div>
                                      </div>

                                      <div className="dayCardBody" style={styles.dayCardBody}>
                                        {day.expenseItems?.length > 0 || day.incomeItems?.length > 0 ? (
                                          <>
                                            {day.expenseItems?.map((item, j) => (
                                              <div key={`e-${j}`} style={styles.itemRow}>
                                                <div style={styles.itemName}>{item?.name ?? "Expense"}</div>
                                                <div style={{ ...styles.itemAmount, ...styles.spent }}>
                                                  -{formatMoney(item?.amount)}
                                                </div>
                                              </div>
                                            ))}

                                            {day.incomeItems?.map((item, j) => (
                                              <div key={`i-${j}`} style={styles.itemRow}>
                                                <div style={styles.itemName}>{item?.name ?? "Income"}</div>
                                                <div style={{ ...styles.itemAmount, ...styles.income }}>
                                                  +{formatMoney(item?.amount)}
                                                </div>
                                              </div>
                                            ))}
                                          </>
                                        ) : (
                                          <div style={styles.emptyDayText}>No items</div>
                                        )}
                                      </div>

                                      <div className="dayCardFooter" style={styles.dayCardFooter}>
                                        <div
                                          className="dayTotalsRow"
                                          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
                                        >
                                          <span className="dayTotalsLabel" style={{ opacity: 0.75 }}>
                                            Income
                                          </span>
                                          <span style={styles.income}>+{formatMoney(day.income || 0)}</span>
                                        </div>
                                        <div
                                          className="dayTotalsRow"
                                          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
                                        >
                                          <span className="dayTotalsLabel" style={{ opacity: 0.75 }}>
                                            Spent
                                          </span>
                                          <span style={styles.spent}>-{formatMoney(day.spent || 0)}</span>
                                        </div>
                                        <div
                                          className="dayTotalsRow"
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: 8,
                                            marginTop: 2,
                                          }}
                                        >
                                          <span className="dayTotalsLabel" style={{ opacity: 0.75 }}>
                                            Balance
                                          </span>
                                          <span style={styles.balance}>{formatMoney(day.balance)}</span>
                                        </div>
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                              </ToolTip>
                            ))}
                          </div>
                        ))}
                      </>
                    )}

                    <div style={styles.monthSummary}>
                        <div style={styles.summaryRow}>
                            <span>Starting Balance</span>
                            <strong>${startingForMonth.toFixed(2)}</strong>
                        </div>

                        <div style={styles.summaryRow}>
                            <span>Total Income</span>
                            <strong style={styles.positive}>
                            +${monthIncome.toFixed(2)}
                            </strong>
                        </div>

                        <div style={styles.summaryRow}>
                            <span>Total Spent</span>
                            <strong style={styles.negative}>
                            -${monthSpent.toFixed(2)}
                            </strong>
                        </div>

                        <div style={styles.divider} />

                        <div style={styles.summaryRow}>
                            <span>Ending Balance</span>
                            <strong>${endingForMonth.toFixed(2)}</strong>
                        </div>

                        <div style={styles.summaryRow}>
                            <span>Net Change</span>
                            <strong style={netChange >= 0 ? styles.positive : styles.negative}>
                            {netChange >= 0 ? "+" : ""}{netChange.toFixed(2)}
                            </strong>
                        </div>
                    </div>
                </div>
            </details>
            );
        })}
        

        {/* TODO: bring back overall summary after month toggles settle */}
        {/* <h2 style={{ marginTop: 40 }}>
            Final Balance: ${data[data.length - 1].balance.toFixed(2)}
        </h2> */}
    </div>
  );
};

export default ProjectionResults;