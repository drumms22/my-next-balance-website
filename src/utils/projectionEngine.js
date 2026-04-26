import {
  addDays,
  addMonths,
  getDate,
  getMonth,
  getDay,
  differenceInDays,
  isAfter,
  isLastDayOfMonth,
  isValid,
  parseISO,
} from "date-fns";

export function runProjection(data, months) {

  let balance = data.startingBalance;

    const now = new Date();

    const startDay = data.startConfig?.day ?? now.getDate();
    const startMonth = data.startConfig?.month ?? (now.getMonth() + 1);

    // Decide correct year
    let startYear = now.getFullYear();

    // If selected month/day already passed this year → use next year
    if (
    startMonth < (now.getMonth() + 1) ||
    (startMonth === (now.getMonth() + 1) && startDay < now.getDate())
    ) {
    startYear += 1;
    }

    const startDate = new Date(startYear, startMonth - 1, startDay);

    const endDate = addMonths(startDate, months);

    let currentDate = startDate;

  // clone mutable data so we don't mutate config
  const remaining = JSON.parse(JSON.stringify(data.days));
  const excludes = JSON.parse(JSON.stringify(data.excludes || []));
  const incomeOverrides = JSON.parse(JSON.stringify(data.incomeOverrides || []));
  const weeklySpendingMode = data.weeklySpendingMode === "items" ? "items" : "flat";
  const weeklySpendingItems = JSON.parse(JSON.stringify(data.weeklySpendingItems || [])).map(
    (row) => ({
      name: row.name,
      amount: Number(row.amount) || 0,
    })
  );
  const results = [];

  while (!isAfter(currentDate, endDate)) {

    const day = getDate(currentDate);
    const month = getMonth(currentDate) + 1;
    const weekday = getDay(currentDate);
    const weekdayName = [
    "Sunday","Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday"
    ][weekday];

    let spent = 0;
    let income = 0;

    let incomeItems = [];
    let expenseItems = [];

    /* ---------- INCOME RULES ---------- */

    data.incomeRules?.forEach(rule => {

        let matches = false;

        if (rule.frequency === "weekly" && weekday === rule.weekday) {
            matches = true;
        }

        if (rule.frequency === "biweekly" && weekday === rule.weekday) {
          const anchor = rule.startDate ? parseISO(rule.startDate) : null;
          if (
            anchor &&
            isValid(anchor) &&
            differenceInDays(currentDate, anchor) % 14 === 0
          ) {
            matches = true;
          }
        }

        if (rule.frequency === "monthly" && rule.day === day) {
            matches = true;
        }

        if (
            rule.frequency === "once" &&
            rule.day === day &&
            rule.month === month
        ) {
            matches = true;
        }

        if (!matches) return;


        /* ---------- CHECK FOR OVERRIDE ---------- */

        const override = incomeOverrides.find(o => {

            if (o.howMany === 0) return false;

            const match =
            (typeof o.day === "number" && o.day === day && o.month === month)
            ||
            (typeof o.day === "string" && o.day === weekdayName && o.month === month);

            if (!match) return false;

            if (o.howMany > 0) o.howMany--;

            return true;
        });


        const amount = override ? override.amount : rule.amount;


        income += amount;

        incomeItems.push({
            name: override?.name || rule.name || "Income",
            amount
        });

        });

    /* ---------- EXTRA INCOME ---------- */

    data.extraIncome?.forEach(entry => {
      if (entry.month === month && entry.day === day) {
        income += entry.amount;

        incomeItems.push({
          name: entry.name || "Extra Income",
          amount: entry.amount
        });
      }
    });

    /* ---------- WEEKLY SPENDING ---------- */
    // applies once per payday (not per income rule)

    if (weeklySpendingMode === "flat") {
      const amt = Number(data.weeklySpending) || 0;
      if (income > 0 && amt) {
        spent += amt;
        expenseItems.push({
          name: "Weekly spending",
          amount: amt,
          type: "spending",
        });
      }
    } else if (income > 0 && weeklySpendingItems.length) {
      let total = 0;
      const labels = [];

      weeklySpendingItems.forEach((row) => {
        const n = Number(row.amount) || 0;
        if (!n) return;
        total += n;
        labels.push(String(row.name ?? "").trim() || "Weekly spending");
      });

      if (total > 0) {
        spent += total;
        const uniq = [...new Set(labels)];
        const name =
          uniq.length === 1 ? uniq[0] : `Weekly spending (${uniq.join(", ")})`;
        expenseItems.push({
          name,
          amount: total,
          type: "spending",
        });
      }
    }

    /* ---------- EXPENSES ---------- */

    let expenses = [...(remaining[day]?.expenses || [])];

    // if last day of month, include payments scheduled after this day
    if (isLastDayOfMonth(currentDate)) {
      Object.entries(remaining).forEach(([scheduledDay, obj]) => {
        if (Number(scheduledDay) > day) {
          expenses.push(...obj.expenses);
        }
      });
    }

    expenses.forEach(e => {
      if (e.remaining === 0) return;

      /* ---------- EXCLUSIONS ---------- */

      const exclusion = excludes.find(ex =>
        ex.name === e.name &&
        (
          ex.month < month ||
          (ex.month === month && ex.day <= day)
        )
      );

      if (exclusion) {
        if (exclusion.howMany === -1) return;

        if (exclusion.howMany > 0) {
          exclusion.howMany--;
          return;
        }
      }

      /* ---------- OVERRIDES ---------- */

      const override = data.overrides?.find(
        o => o.month === month && o.day === day && o.name === e.name
      );

      const amount = override ? override.amount : e.amount;

      spent += amount;

      expenseItems.push({
        name: e.name,
        amount,
        type: e.type
      });

      if (e.remaining > 0) e.remaining--;
    });

    /* ---------- UPDATE BALANCE ---------- */

    balance += income;
    balance -= spent;

    results.push({
      date: currentDate,
      income,
      spent,
      balance,
      incomeItems,
      expenseItems
    });

    currentDate = addDays(currentDate, 1);
  }

  return results;
}