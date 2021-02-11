export const getLevelsCount = (PgmStrChart) => {
  const acc = [];
  const levels = PgmStrChart.forEach((level) => acc.push(level.length));
  return acc;
};
