import { getBranchPgm } from "./RecurrentBranching.js";

function getInitialArrayObj(topprogram, programs) {
  let programNameData = programs.filter((program) => {
    return topprogram === program.PGMID;
  });
  let calledPrograms = programNameData.map((data) => {
    return data.CLDPGM;
  });
  return [
    {
      program: topprogram,
      calledPrograms: calledPrograms,
      parentProgram: "",
      parentId: 0,
      entityId: 1,
      childIds: [],
      Moved_Object: false,
      Level: 0,
    },
  ];
}

export const getProgramHierarchy = (
  topprogram,
  programs,
  maxLvl,
  maxEntityChildren
) => {
  // inssert top level program information into previous level programs
  let InitialPgmArrayObject = getInitialArrayObj(topprogram, programs);
  let IterationArrayObject = new IterationArray(
    InitialPgmArrayObject,
    topprogram,
    maxEntityChildren
  );
  let FinalLvlPgmArrayObj = [];

  // continue until there are no more previous level programs
  while (
    IterationArrayObject.PrevlevelPgms.length > 0 &&
    IterationArrayObject.Level < maxLvl
  ) {
    IterationArrayObject.Level++;
    // append programs to all level program array [initial starts with top level program]

    IterationArrayObject = getcalledPgmsInNxtLvl(
      IterationArrayObject,
      programs
    );

    // look through previous level pgms and find set child ids based on parent ids in previous level
    if (IterationArrayObject.PrevlevelPgmArrayObjects.length > 0) {
      FinalLvlPgmArrayObj = AddPgmstoLevelSoChildIdsAreCorrect(
        IterationArrayObject.PrevlevelPgmArrayObjects,
        IterationArrayObject.currentlevelPgmArrayObjects
      );
    }
    // current and next level pgm

    // already placed programs/ allevelarraypgsm
    if (FinalLvlPgmArrayObj.length > 0) {
      IterationArrayObject.AlllevelPgmsDataArray.push(FinalLvlPgmArrayObj);
    }

    IterationArrayObject.PrevlevelPgmArrayObjects =
      IterationArrayObject.currentlevelPgmArrayObjects;
    IterationArrayObject.PrevlevelPgms = IterationArrayObject.currentlevelPgms;
  }
  return IterationArrayObject;
};

function AddPgmstoLevelSoChildIdsAreCorrect(
  PrevlevelPgmArrayObjects,
  currentlevelPgmArrayObjects
) {
  let FinalPgmArrayObj = [];

  if (currentlevelPgmArrayObjects.length > 0) {
    let RedcurrentlevelPgmArrayObjects = currentlevelPgmArrayObjects.reduce(
      (acc, pgm) => {
        return acc.concat(pgm);
      }
    );
    FinalPgmArrayObj = PrevlevelPgmArrayObjects.map((clter) => {
      clter = clter.map((obj) => {
        obj.childIds = AddChildrenIds(
          obj.entityId,
          RedcurrentlevelPgmArrayObjects
        );
        return obj;
      });
      return clter;
    });
  } else {
    return PrevlevelPgmArrayObjects;
  }
  return FinalPgmArrayObj;
}

function IterationArray(InitialPgmArrayObject, topprogram, maxEntityChildren) {
  this.PrevPlacedPgms = [topprogram];
  this.AlllevelPgmsDataArray = [];
  this.currentlevelPgms = [];
  this.currentlevelPgmArrayObjects = [];
  this.PrevlevelPgms = [topprogram];
  this.PrevlevelPgmArrayObjects = [InitialPgmArrayObject];

  this.Level = 0;
  this.entityId = 1;
  this.parentId = 0;

  this.maxEntityChildren = maxEntityChildren;
}

function createPgmArrayObj(
  IterationArrayObj,
  pgm,
  programs,
  Branch,
  parentProgram
) {
  // branchpgms
  // check if a recurring pgm
  if (Branch.includes(pgm)) {
    pgm = pgm + "rec";
  }

  // check if previously place programs
  let calledPrograms = [];
  let Moved_Object = false;
  if (!IterationArrayObj.PrevPlacedPgms.includes(pgm)) {
    let programNameData = programs.filter((program) => {
      return pgm === program.PGMID;
    });
    calledPrograms = programNameData.map((data) => {
      return data.CLDPGM;
    });

    if (calledPrograms.length > IterationArrayObj.maxEntityChildren) {
      Moved_Object = true;
      calledPrograms = [];
    }

    IterationArrayObj.entityId++;

    IterationArrayObj.PrevPlacedPgms.push(pgm);
    return {
      program: pgm,
      calledPrograms: calledPrograms,
      parentProgram: parentProgram,
      parentId: IterationArrayObj.parentId,
      entityId: IterationArrayObj.entityId,
      childIds: [],
      Moved_Object: Moved_Object,
      Level: IterationArrayObj.Level,
    };
  } else {
    return "PREV_PLACED";
  }
}

function getcalledPgmsInNxtLvl(IterationArrayObj, programs) {
  let NextLevelPgmArrayObj = [];
  let NextLevelPgms = [];
  let PrevArrayObjects = IterationArrayObj.PrevlevelPgmArrayObjects;
  let ClusterLevelPgmArrayObj = [];
  let ClusterLevelPgms;

  let parentProgram = "";
  let CalledPrograms = [];

  PrevArrayObjects = PrevArrayObjects.reduce((acc, obj) => {
    return acc.concat(obj);
  });

  for (let PgmObj of PrevArrayObjects) {
    IterationArrayObj.parentId++;
    parentProgram = PgmObj.program;
    CalledPrograms = PgmObj.calledPrograms;
    if (CalledPrograms.length > 0) {
      // for each called object ad one to parentid

      let Branch = getBranchPgm(
        IterationArrayObj.AlllevelPgmsDataArray,
        PgmObj
      );

      ClusterLevelPgmArrayObj = CalledPrograms.map((pgm) => {
        return createPgmArrayObj(
          IterationArrayObj,
          pgm,
          programs,
          Branch,
          parentProgram
        );
      });

      ClusterLevelPgmArrayObj = ClusterLevelPgmArrayObj.filter((obj) => {
        return obj !== "PREV_PLACED";
      });
      ClusterLevelPgms = ClusterLevelPgmArrayObj.map((obj) => {
        return obj.program;
      });
      if (ClusterLevelPgms.length > 0) {
        NextLevelPgmArrayObj.push(ClusterLevelPgmArrayObj);
        NextLevelPgms.push(ClusterLevelPgms);
      }
    }
  }
  if (NextLevelPgms.length > 1) {
    NextLevelPgms = NextLevelPgms.reduce((acc, pgm) => {
      return acc.concat(pgm);
    });
  }
  IterationArrayObj.currentlevelPgmArrayObjects = NextLevelPgmArrayObj;
  IterationArrayObj.currentlevelPgms = NextLevelPgms;
  return IterationArrayObj;
}

function AddChildrenIds(entityId, RedcurrentlevelPgmArrayObjects) {
  let ChildObjectBelow = RedcurrentlevelPgmArrayObjects.filter((obj) => {
    return obj.parentId === entityId;
  });
  let Childids = ChildObjectBelow.map((obj) => {
    return obj.entityId;
  });
  return Childids;
}
