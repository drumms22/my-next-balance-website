import React from "react";

const sectionTitle = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.72,
  margin: "0 0 10px",
};

const p = {
  margin: "0 0 12px",
  fontSize: 15,
  lineHeight: 1.65,
  opacity: 0.92,
};

const list = {
  margin: "0 0 14px",
  paddingLeft: 18,
  fontSize: 15,
  lineHeight: 1.65,
  opacity: 0.92,
};

const shot = {
  width: "100%",
  height: "auto",
  borderRadius: 12,
  border: "1px solid rgba(128, 128, 128, 0.35)",
  display: "block",
  margin: "10px 0 0",
};

const shotCaption = {
  marginTop: 8,
  fontSize: 12,
  lineHeight: 1.45,
  opacity: 0.7,
};

const figureBlock = { margin: "16px 0 0" };

/**
 * Shared “About / How to use” content.
 *
 * `variant`:
 * - "landing": roomy layout for the first-run page
 * - "modal": tighter layout for an in-app modal
 */
export default function AppGuideContent({ variant = "landing" }) {
  const isModal = variant === "modal";

  const section = {
    marginTop: isModal ? 16 : 22,
  };

  const h = {
    margin: "0 0 10px",
    fontSize: isModal ? 22 : 28,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  };

  return (
    <div className="guideContent">
      <h2 style={h}>What is My Next Balance?</h2>
      <p style={p}>
        My Next Balance is a simple cashflow projector: you tell it what you earn, what you spend,
        and when bills hit — then it walks forward day-by-day and shows how your balance changes.
      </p>

      <figure className="guideFigure" style={{ margin: "14px 0 0" }}>
        <img
          className="guideShot"
          src="/marketing/home.png"
          alt="Main view when you first open the app"
          style={shot}
        />
        <figcaption style={shotCaption}>
          Main view: set how many months to project, run the projection, then explore results below.
        </figcaption>
      </figure>

      <section style={section}>
        <h3 style={sectionTitle}>How to use it (fast path)</h3>
        <ol style={list}>
          <li>
            <strong>Decide what money you’re tracking</strong>: add up the balances you want included
            (checking, savings, or other accounts) — that total is your <strong>Starting Balance</strong>.
          </li>
          <li>
            <strong>Setup</strong> (right tab): set your starting date and starting balance, then add your
            income schedule and any one-off adjustments.
          </li>
          <li>
            <strong>Expenses</strong> (left tab): add recurring expenses on the days they hit your account.
          </li>
          <li>
            Choose <strong>Months to Project</strong>, click <strong>Run Projection</strong>, then open a month to
            see the calendar.
          </li>
          <li>
            Use <strong>PDF</strong> to print/save, or the trash control to reset the projection and return to the
            controls.
          </li>
        </ol>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>Screenshots</h3>

        <figure className="guideFigure" style={figureBlock}>
          <img className="guideShot" src="/marketing/setup.png" alt="Financial setup panel" style={shot} />
          <figcaption style={shotCaption}>
            Setup: starting date and balance, income, one-offs — edit inline, then Save.
          </figcaption>
        </figure>

        <figure className="guideFigure" style={figureBlock}>
          <img className="guideShot" src="/marketing/expenses.png" alt="Recurring expenses calendar" style={shot} />
          <figcaption style={shotCaption}>
            Expenses: recurring items on the days they hit your account.
          </figcaption>
        </figure>

        <figure className="guideFigure" style={figureBlock}>
          <img
            className="guideShot"
            src="/marketing/results1.png"
            alt="Projection results with months collapsed"
            style={shot}
          />
          <figcaption style={shotCaption}>
            After you run: each month shows as a card — click a month to expand the day-by-day calendar.
          </figcaption>
        </figure>

        <figure className="guideFigure" style={figureBlock}>
          <img
            className="guideShot"
            src="/marketing/results2.png"
            alt="Projection results with a month expanded"
            style={shot}
          />
          <figcaption style={shotCaption}>
            Expanded month: see line items per day and totals at the bottom of each day card.
          </figcaption>
        </figure>
      </section>

      <section style={section}>
        <h3 style={sectionTitle}>Tips</h3>
        <ul style={list}>
          <li>
            If something looks wrong, check <strong>Setup</strong> first (starting date/balance and income rules).
          </li>
          <li>
            Use <strong>Backups</strong> to keep named snapshots while you experiment.
          </li>
        </ul>
      </section>
    </div>
  );
}
