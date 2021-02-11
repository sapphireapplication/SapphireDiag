export const getCorePgmrelations = (DiagramCoord) => {
  let DiagramCoordCopy = DiagramCoord.slice(0);
  let CoreRelationObj = DiagramCoord.map((rel) => {
    const parent = findParent(rel.parentId, DiagramCoordCopy);
    if (parent) {
      const newrel = {
        relID: parent.program + ":" + rel.program,
        parent: {
          ...parent,
        },
        child: {
          ...rel,
        },
      };
      return newrel;
    } else {
      return "NO_PARENT";
    }
  }).filter((rel) => {
    return rel !== "NO_PARENT";
  });

  let CoreRelationsCoords = CoreRelationObj.map((rel) => {
    let relID = rel.relID;
    let newrel = {
      relID,
    };
    return newrel;
  });

  return CoreRelationsCoords;
};

function findParent(parentId, DiagramCoordCopy) {
  let DiagramCoordObj = DiagramCoordCopy.filter((Coord) => {
    return Coord.entityId === parentId;
  })[0];
  return DiagramCoordObj;
}
