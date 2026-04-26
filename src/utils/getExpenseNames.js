export function getExpenseNames(days) {
  const set = new Set();

  Object.values(days).forEach(day => {
    day.expenses?.forEach(e => {
      set.add(e.name);
    });
  });

  return Array.from(set).sort();
}