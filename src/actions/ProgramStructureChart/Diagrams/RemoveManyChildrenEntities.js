export const removeManyChildrenEntities = (PgmStrChart, RemRels) => {
  const childCount = RemRels.reduce((acc, rel) => {
    const child = rel.relID.split(":")[1];
    if (acc[child]) acc[child] += 1;
    else acc[child] = 1;
    return acc;
  }, {});

  const excludedPgms = Object.keys(childCount).filter(
    (exclPgm) => childCount[exclPgm] > 10
  );

  const eliminateManyChildPgms = (children) => {
    return children
      .map((child) => {
        if (excludedPgms.includes(child.name)) return (child = "ELIMINATED");
        if (child.children.length > 0)
          child.children = eliminateManyChildPgms(child.children);
        return child;
      })
      .filter((child) => child !== "ELIMINATED");
  };

  const newPgmStrChart = eliminateManyChildPgms(PgmStrChart.children);
  const newRemRels = RemRels.filter(
    (rel) => !excludedPgms.includes(rel.relID.split(":")[1])
  );
  PgmStrChart.children = newPgmStrChart;
  return [PgmStrChart, newRemRels];
};
