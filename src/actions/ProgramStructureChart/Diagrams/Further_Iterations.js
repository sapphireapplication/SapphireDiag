import { prepareBranch } from "./RecurrentBranching.js";

function furtherIteration(entityId, maxEntityChildren, maxLvl, programs) {
  this.maxEntityChildren = maxEntityChildren;
  this.maxLvl = maxLvl;
  this.PrevPlacedPgms = [];
  this.currentEntity = {};
  this.lvl = 0;
  this.cluster = 0;
  this.obj = 0;
  this.programs = programs;
  this.entityId = entityId;

  this.PrevPlacedObjs = [];

  this.newDuplicates = [];

  this.setcurrentEntity = function (entity) {
    this.currentEntity = entity;
  };

  this.setIndices = function (lvl, cluster, obj) {
    this.lvl = lvl;
    this.cluster = cluster;
    this.obj = obj;
  };
}

function createNewDiagEnt(Pgm, furtherIterationObj, nocalledPgmsFlag) {
  let Moved_Object = false;
  let calledPrograms = getcalledPgms(Pgm, furtherIterationObj);

  // if called programs length is greater than max entity children
  if (calledPrograms.length > furtherIterationObj.maxEntityChildren) {
    Moved_Object = true;
    calledPrograms = [];
  } else if (nocalledPgmsFlag) {
    calledPrograms = [];
  }

  furtherIterationObj.entityId++;
  furtherIterationObj.lvl++;

  return {
    program: Pgm,
    calledPrograms: calledPrograms,
    parentProgram: furtherIterationObj.currentEntity.program,
    parentId: furtherIterationObj.currentEntity.entityId,
    entityId: furtherIterationObj.entityId,
    childIds: [],
    Moved_Object: Moved_Object,
    Level: furtherIterationObj.lvl,
  };
}

function CheckIfRecurringDuplicateOrPrevPlaced(
  NewDiagPgm,
  Diagram,
  furtherIterationObj,
  branchIterationObj
) {
  let recurringInfo = [];
  let addedInfo1 = [];
  let addedInfo2 = [];
  let PrevPlacedObj = {};
  let Lvls = 0;
  let Pgm = "";

  if (branchIterationObj.Branch.includes(NewDiagPgm)) {
    Pgm = NewDiagPgm;
    recurringInfo = AddRecurringEntityToDiagram(
      Pgm,
      Diagram,
      furtherIterationObj,
      branchIterationObj
    );
    Diagram = recurringInfo[0];
    furtherIterationObj = recurringInfo[1];
    branchIterationObj = recurringInfo[2];
  } else if (furtherIterationObj.PrevPlacedPgms.includes(NewDiagPgm)) {
    // check if not already placed at a higher level
    PrevPlacedObj = furtherIterationObj.PrevPlacedObjs.filter((Obj) => {
      return Obj.program === NewDiagPgm;
    });
    Lvls = PrevPlacedObj.map((Obj) => {
      return Obj.level;
    });
    const PrevPlacedMaxLvl = Math.max(...Lvls);
    if (furtherIterationObj.lvl + 1 > PrevPlacedMaxLvl) {
      if (!branchIterationObj.branchDuplicates.includes(NewDiagPgm)) {
        Pgm = NewDiagPgm;
        addedInfo2 = AddEntitiesToDiagram(
          Pgm,
          Diagram,
          furtherIterationObj,
          branchIterationObj
        );
        Diagram = addedInfo2[0];
        furtherIterationObj = addedInfo2[1];
        branchIterationObj = addedInfo2[2];
      } else {
      }
    }
  }
  return [Diagram, furtherIterationObj, branchIterationObj];
}

function branchIteration() {
  this.Branch = [];
  this.branchDuplicates = [];
  this.newDuplicates = [];
}

function expandCalledPgms(
  NewDiagPgm,
  Diagram,
  furtherIterationObj,
  branchIterationObj
) {
  if (furtherIterationObj.lvl < furtherIterationObj.maxLvl - 1) {
    // check if duplicatepgm  or branch pgm or already placed pgm  or completely new pgm
    // if furtherIteration MaxLvl

    if (
      furtherIterationObj.PrevPlacedPgms.includes(NewDiagPgm) ||
      branchIterationObj.Branch.includes(NewDiagPgm)
    ) {
      const checkedInfo = CheckIfRecurringDuplicateOrPrevPlaced(
        NewDiagPgm,
        Diagram,
        furtherIterationObj,
        branchIterationObj
      );
      Diagram = checkedInfo[0];
      furtherIterationObj = checkedInfo[1];
      branchIterationObj = checkedInfo[2];
    } else {
      // as this suggests it is a program not previously added to the diagram
      const AddedInfo = AddEntitiesToDiagram(
        NewDiagPgm,
        Diagram,
        furtherIterationObj,
        branchIterationObj
      );
      Diagram = AddedInfo[0];
      furtherIterationObj = AddedInfo[1];
      branchIterationObj = AddedInfo[2];
    }
  } else {
    // potentially redundant
    const AddedInfo = AddEntitiesToDiagramOnce(
      NewDiagPgm,
      Diagram,
      furtherIterationObj,
      branchIterationObj
    );
    Diagram = AddedInfo[0];
    furtherIterationObj = AddedInfo[1];
    branchIterationObj = AddedInfo[2];
  }
  return [Diagram, furtherIterationObj, branchIterationObj];
}

export const expandPgmHierarchy = (
  Diagram,
  lastEntityId,
  maxLvl,
  maxEntityChildren,
  programs
) => {
  let DiagramBeforeExpansion = Diagram.slice(0);
  let furtherIterationObj = new furtherIteration(
    lastEntityId,
    maxEntityChildren,
    maxLvl,
    programs
  );
  let branchIterationObj = new branchIteration();

  let Lvl = DiagramBeforeExpansion.length - 1;
  let ArrayCluster = [];
  let ArrayObj = [];
  let Cluster = 0;
  let Obj = 0;

  while (Lvl >= 0) {
    ArrayCluster = DiagramBeforeExpansion[Lvl];
    Cluster = ArrayCluster.length - 1;

    while (Cluster >= 0) {
      ArrayObj = ArrayCluster[Cluster];
      Obj = ArrayObj.length - 1;

      while (Obj >= 0) {
        const DiagramEnt = ArrayObj[Obj];

        if (DiagramEnt.calledPrograms.length > 0) {
          branchIterationObj.Branch = prepareBranch(DiagramEnt, Diagram);
          for (let NewDiagPgm of DiagramEnt.calledPrograms) {
            furtherIterationObj.setcurrentEntity(DiagramEnt);
            furtherIterationObj.setIndices(Lvl, Cluster, Obj);
            const ExpandedInfo = expandCalledPgms(
              NewDiagPgm,
              Diagram,
              furtherIterationObj,
              branchIterationObj
            );
            Diagram = ExpandedInfo[0];
            furtherIterationObj = ExpandedInfo[1];
            branchIterationObj = ExpandedInfo[2];
          }
        }

        Obj--;
      }
      Cluster--;
    }
    Lvl--;
  }

  return [Diagram, furtherIterationObj];
};

function AddRecurringEntityToDiagram(
  Pgm,
  Diagram,
  furtherIterationObj,
  branchIterationObj
) {
  let NewDiagEnt = {};
  Pgm = Pgm + "rec";
  furtherIterationObj.PrevPlacedPgms.push(Pgm);
  furtherIterationObj.PrevPlacedObjs.push({
    program: Pgm,
    level: furtherIterationObj.lvl,
  });
  branchIterationObj.Branch.push(Pgm);
  branchIterationObj.branchDuplicates.push(Pgm);
  NewDiagEnt = createNewDiagEnt(Pgm, furtherIterationObj, true);
  const NewDiagInfo = AddNewDiagEnt(
    NewDiagEnt,
    Diagram,
    furtherIterationObj,
    branchIterationObj
  );
  Diagram = NewDiagInfo[0];
  furtherIterationObj = NewDiagInfo[1];
  return [Diagram, furtherIterationObj, branchIterationObj];
}

function AddEntitiesToDiagramOnce(
  Pgm,
  Diagram,
  furtherIterationObj,
  branchIterationObj
) {
  // get programs array DiagramEnt.calledPrograms
  // if DiagramEnt.calledPrograms < 20 mark as Moved_Object
  if (branchIterationObj.Branch.includes(Pgm)) {
    Pgm = Pgm + "rec";
  }

  let NewDiagEnt = {};
  furtherIterationObj.PrevPlacedPgms.push(Pgm);
  furtherIterationObj.PrevPlacedObjs.push({
    program: Pgm,
    level: furtherIterationObj.lvl,
  });
  branchIterationObj.Branch.push(Pgm);
  branchIterationObj.branchDuplicates.push(Pgm);
  NewDiagEnt = createNewDiagEnt2(Pgm, furtherIterationObj, true);
  const NewDiagInfo = AddNewDiagEnt(
    NewDiagEnt,
    Diagram,
    furtherIterationObj,
    branchIterationObj
  );
  Diagram = NewDiagInfo[0];
  furtherIterationObj = NewDiagInfo[1];
  return [Diagram, furtherIterationObj, branchIterationObj];
}

function AddEntitiesToDiagram(
  Pgm,
  Diagram,
  furtherIterationObj,
  branchIterationObj
) {
  // get programs array DiagramEnt.calledPrograms
  // if DiagramEnt.calledPrograms < 20 mark as Moved_Object
  let NewDiagEnt = {};
  furtherIterationObj.PrevPlacedPgms.push(Pgm);
  furtherIterationObj.PrevPlacedObjs.push({
    program: Pgm,
    level: furtherIterationObj.lvl,
  });
  branchIterationObj.Branch.push(Pgm);
  branchIterationObj.branchDuplicates.push(Pgm);
  NewDiagEnt = createNewDiagEnt2(Pgm, furtherIterationObj, false);
  const NewDiagInfo = AddNewDiagEnt(
    NewDiagEnt,
    Diagram,
    furtherIterationObj,
    branchIterationObj
  );
  Diagram = NewDiagInfo[0];
  furtherIterationObj = NewDiagInfo[1];
  if (!furtherIterationObj.AlreadyAddedInPrevIteration) {
    let LvlBeforeGoingDown = furtherIterationObj.lvl;
    let calledPgms = furtherIterationObj.currentEntity.calledPrograms;
    let Branch = branchIterationObj.Branch;

    if (calledPgms.length > 0) {
      for (let calledPgm of calledPgms) {
        // already placed pgms
        const expandedInfo = expandCalledPgms(
          calledPgm,
          Diagram,
          furtherIterationObj,
          branchIterationObj
        );
        Diagram = expandedInfo[0];
        furtherIterationObj = expandedInfo[1];
        branchIterationObj = expandedInfo[2];
        branchIterationObj.Branch = Branch;
        furtherIterationObj.setcurrentEntity(NewDiagEnt);
        furtherIterationObj.lvl = LvlBeforeGoingDown;
      }
    }
  }
  // Checkif need to expand diagram with called programs
  // add remove items from branch where applicabe

  return [Diagram, furtherIterationObj, branchIterationObj];
}

function CheckIfPgmInANewLvl(NewDiagEnt, Diagram, furtherIterationObj) {
  let PgmAdded = false;
  let newLvl = [];

  furtherIterationObj.AlreadyAddedInPrevIteration = false;
  // add to previously placed pgms
  let FinalLevel = Diagram.length - 1;
  if (NewDiagEnt.Level > FinalLevel) {
    newLvl = [[NewDiagEnt]];
    Diagram.push(newLvl);
    PgmAdded = true;
  }

  return [Diagram, furtherIterationObj, PgmAdded];
}

function CheckIfPgmInAnExistingClter(NewDiagEnt, Diagram, furtherIterationObj) {
  // find entity in same cluster and check if parent entity id is the same

  let lvl = NewDiagEnt.Level;
  let newEntDiagramLvl = Diagram[lvl];
  let newEntDiagramCluster = [];
  let DiagEnt = {};
  let PgmAdded = false;
  let Cluster = newEntDiagramLvl.length - 1;
  let DiagCluster = [];
  furtherIterationObj.AlreadyAddedInPrevIteration = false;
  let Obj = 0;
  while (Cluster >= 0) {
    newEntDiagramCluster = newEntDiagramLvl[Cluster];
    Obj = newEntDiagramCluster.length - 1;
    while (Obj >= 0) {
      DiagEnt = newEntDiagramCluster[Obj];
      // if in the same cluster
      if (DiagEnt.parentId === NewDiagEnt.parentId && !PgmAdded) {
        PgmAdded = true;
        DiagCluster = Diagram[lvl][Cluster];
        furtherIterationObj.AlreadyAddedInPrevIteration = checkAddedInPrevIteration(
          DiagCluster,
          NewDiagEnt
        );
        if (!furtherIterationObj.AlreadyAddedInPrevIteration) {
          Diagram[lvl][Cluster].push(NewDiagEnt);
        }
      }
      Obj--;
    }
    Cluster--;
  }
  return [Diagram, furtherIterationObj, PgmAdded];
}

function checkAddedInPrevIteration(DiagCluster, NewDiagEnt) {
  let Newpgm = NewDiagEnt.program;
  let ClusterPgms = DiagCluster.map((obj) => {
    return obj.program;
  });

  if (ClusterPgms.includes(Newpgm)) {
    return true;
  } else {
    return false;
  }
}

function AddPgmToANewCluster(NewDiagEnt, Diagram, furtherIterationObj) {
  let PgmAdded = true;
  let lvl = NewDiagEnt.Level;
  furtherIterationObj.AlreadyAddedInPrevIteration = false;
  Diagram[lvl].push([NewDiagEnt]);
  return [Diagram, furtherIterationObj, PgmAdded];
}

function AddNewDiagEnt(NewDiagEnt, Diagram, furtherIterationObj) {
  let NewDiagInfo = [];
  let PgmAdded = false;

  NewDiagInfo = CheckIfPgmInANewLvl(NewDiagEnt, Diagram, furtherIterationObj);
  Diagram = NewDiagInfo[0];
  furtherIterationObj = NewDiagInfo[1];
  PgmAdded = NewDiagInfo[2];
  if (!PgmAdded) {
    NewDiagInfo = CheckIfPgmInAnExistingClter(
      NewDiagEnt,
      Diagram,
      furtherIterationObj
    );
    Diagram = NewDiagInfo[0];
    furtherIterationObj = NewDiagInfo[1];
    PgmAdded = NewDiagInfo[2];
  }
  if (!PgmAdded) {
    NewDiagInfo = AddPgmToANewCluster(NewDiagEnt, Diagram, furtherIterationObj);
    Diagram = NewDiagInfo[0];
    furtherIterationObj = NewDiagInfo[1];
    PgmAdded = NewDiagInfo[2];
  }
  furtherIterationObj.setcurrentEntity(NewDiagEnt);
  return [Diagram, furtherIterationObj];
}

function getcalledPgms(NewDiagPgm, furtherIterationObj) {
  let programRelations = furtherIterationObj.programs.filter((pgm) => {
    return pgm.PGMID === NewDiagPgm;
  });
  let calledPgms = programRelations.map((rel) => {
    return rel.CLDPGM;
  });
  return calledPgms;
}

function createNewDiagEnt2(Pgm, furtherIterationObj, nocalledPgmsFlag) {
  let Moved_Object = false;
  let calledPrograms = getcalledPgms(Pgm, furtherIterationObj);

  // if called programs length is greater than max entity children
  if (calledPrograms.length > furtherIterationObj.maxEntityChildren) {
    Moved_Object = true;
    calledPrograms = [];
  } else if (nocalledPgmsFlag) {
    calledPrograms = [];
  }

  furtherIterationObj.entityId++;
  furtherIterationObj.lvl++;

  return {
    program: Pgm,
    calledPrograms: calledPrograms,
    parentProgram: furtherIterationObj.currentEntity.program,
    parentId: furtherIterationObj.currentEntity.entityId,
    entityId: furtherIterationObj.entityId,
    childIds: [],
    Moved_Object: Moved_Object,
    Level: furtherIterationObj.lvl,
  };
}
