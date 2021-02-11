export const getBranchPgm = (AlllevelPgmsDataArray, PgmObj) => {
  let ParentIdInLvlAbv = PgmObj.parentId;
  // FIND BOTTOM LEVEL
  // check if Pgm the same as parent
  // Add Parent to Branch
  let BottomLvl = AlllevelPgmsDataArray.length - 1;
  const Branch = getBranches(
    AlllevelPgmsDataArray,
    ParentIdInLvlAbv,
    [],
    BottomLvl
  );
  return Branch;
};

export const prepareBranch = (DiagramEnt, Diagram) => {
  let BottomLvl = DiagramEnt.Level;
  let Branch = getBranches(Diagram, DiagramEnt.entityId, [], BottomLvl);
  return Branch;
};

function getBranches(
  AlllevelPgmsDataArray,
  ParentIdInLvlAbv,
  Branch,
  BottomLvl
) {
  // compiles the branch the entity is located on the program (ie the preceeding programs)
  if (AlllevelPgmsDataArray.length > 0) {
    // search parents of currentlevelPgmsArray in levels above
    let LvlAbove = AlllevelPgmsDataArray[BottomLvl];
    let RedLevelAbove = LvlAbove.reduce((acc, obj) => {
      return acc.concat(obj);
    });
    let ObjInLvlAbv = RedLevelAbove.filter((obj) => {
      return obj.entityId === ParentIdInLvlAbv;
    });
    let PgmInLvlAbv = ObjInLvlAbv[0].program;
    ParentIdInLvlAbv = ObjInLvlAbv[0].parentId;
    Branch.push(PgmInLvlAbv);
    // get parent id in for entity in level above

    while (BottomLvl > 0) {
      BottomLvl--;
      LvlAbove = AlllevelPgmsDataArray[BottomLvl];
      RedLevelAbove = LvlAbove.reduce((acc, obj) => {
        return acc.concat(obj);
      });
      ObjInLvlAbv = RedLevelAbove.filter((obj) => {
        return obj.entityId === ParentIdInLvlAbv;
      });
      PgmInLvlAbv = ObjInLvlAbv[0].program;
      ParentIdInLvlAbv = ObjInLvlAbv[0].parentId;
      Branch.push(PgmInLvlAbv);
    }
  }

  return Branch;
}
