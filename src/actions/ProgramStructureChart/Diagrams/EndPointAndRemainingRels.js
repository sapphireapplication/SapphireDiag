export const getEndPointCoordsandRemainingRelations = (
  DiagObjs,
  CoreRelations
) => {
  // split into endpoint and remaining objs

  let EndPointObjs = DiagObjs.map((Obj) => {
    Obj.EndPointPgms = Obj.EndPointPgms.map((ent) => {
      return ent;
    });
    return Obj.EndPointPgms;
  });

  EndPointObjs = EndPointObjs.reduce((acc, endpoint) => {
    return acc.concat(endpoint);
  });

  const RemainingRelationsCoords = getRemainingRels(
    EndPointObjs,
    CoreRelations
  );

  return RemainingRelationsCoords;
};

function getRemainingRels(RemainingObjs, CoreRelations) {
  let RemainingRels = RemainingObjs.map((Obj) => {
    const newObj = findCalledPgmCoord(Obj);
    return newObj;
  });

  let RemainingRelationsCoords = RemainingRels.map((rel) => {
    const relID = rel.relID;
    let newrel = {
      relID,
    };
    return newrel;
  });

  CoreRelations = CoreRelations.map((rel) => {
    return rel.relID;
  });
  RemainingRelationsCoords = RemainingRelationsCoords.filter((rel) => {
    return !CoreRelations.includes(rel.relID);
  });

  return RemainingRelationsCoords;
}

function findCalledPgmCoord(RemObj) {
  return {
    relID: RemObj.parentProgram + ":" + RemObj.calledPgm,
  };
}
