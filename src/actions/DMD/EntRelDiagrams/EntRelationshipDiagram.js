const buildChartGoingDown = (startingPgm, entrels) => {
  // get child relationships going down
  const InitialObjInfo = createGoingDownObj(
    startingPgm,
    entrels,
    "",
    0,
    0,
    true
  );
  let InitialObj = InitialObjInfo[0];
  let entityId = InitialObjInfo[1];
  let parentId = 0;
  // place in double nested array
  let DiagramGoingDown = [[[InitialObj]]];
  let EntLvl = [[InitialObj]];
  let EntCluster = [];
  let EntObj = {};
  let newEntLvl = [];
  let EntObjInfo = [];
  let nextLevelChildren = [];
  let nextChildren = [];
  let DendogramObj = {};

  // next children from starting Pgm

  nextLevelChildren = EntLvl.reduce((acc, Obj) => {
    return acc.concat(Obj);
  })
    .map((Obj) => {
      return Obj.DiagramChildren;
    })
    .reduce((acc, Obj) => {
      return acc.concat(Obj);
    });

  let level = 0;
  while (nextLevelChildren.length > 0 && level < 10) {
    newEntLvl = [];
    EntLvl = EntLvl.reduce((acc, Obj) => {
      return acc.concat(Obj);
    });
    for (let cluster of EntLvl) {
      parentId++;
      const parent = cluster.DiagramEntity;
      nextChildren = cluster.DiagramChildren;
      // remove duplicates
      EntCluster = [];
      for (let child of nextChildren) {
        EntObjInfo = createGoingDownObj(
          child,
          entrels,
          parent,
          entityId,
          parentId,
          false
        );
        EntObj = EntObjInfo[0];
        entityId = EntObjInfo[1];
        EntCluster.push(EntObj);
      }
      if (EntCluster.length > 0) {
        newEntLvl.push(EntCluster);
      }
    }

    if (newEntLvl.length > 0) {
      nextLevelChildren = newEntLvl.reduce((acc, Obj) => {
        return acc.concat(Obj);
      });
      nextLevelChildren = nextLevelChildren.map((Obj) => {
        return Obj.DiagramChildren;
      });
      nextLevelChildren = nextLevelChildren.reduce((acc, Obj) => {
        return acc.concat(Obj);
      });
      DiagramGoingDown.push(newEntLvl);
      EntLvl = newEntLvl;
    } else {
      EntLvl = [];
    }
    level++;
  }
  //DiagramGoingDown = EliminateDiagramGoingDown(DiagramGoingDown)
  let LeftDiagramData = DiagramGoingDown.map((Lvl) => {
    return Lvl.reduce((acc, Obj) => {
      return acc.concat(Obj);
    });
  });
  LeftDiagramData = LeftDiagramData.reduce((acc, Obj) => {
    return acc.concat(Obj);
  });
  LeftDiagramData = FindChildIds(DiagramGoingDown, LeftDiagramData);
  console.log(DendogramObj);
  DendogramObj = addEntClusterToChildren(DiagramGoingDown, DendogramObj);

  return [DiagramGoingDown, DendogramObj];
};

const FindChildIds = (DiagramGoingDown, LeftDiagramData) => {
  const newDiagramGoingDown = DiagramGoingDown.map((Lvl) => {
    return Lvl.map((Clter) => {
      return Clter.map((Obj) => {
        const ChildObjects = getChildId(Obj, LeftDiagramData);
        Obj.ChildIds = ChildObjects.map((obj) => obj.ChildId);
        Obj.ChildObject = ChildObjects;
        return Obj;
      });
    });
  });
  return newDiagramGoingDown;
};

const FindParentIds = (DiagramGoingDown, LeftDiagramData) => {
  const newDiagramGoingDown = DiagramGoingDown.map((Lvl) => {
    return Lvl.map((Clter) => {
      return Clter.map((Obj) => {
        const ParentObjects = getParentId(Obj, LeftDiagramData);
        Obj.ParentIds = ParentObjects.map((obj) => obj.ParentId);
        Obj.ParentObject = ParentObjects;
        return Obj;
      });
    });
  });
  return newDiagramGoingDown;
};

function getParentId(Obj, LeftDiagramData) {
  const RemEnts = LeftDiagramData.filter((Ent) => {
    return Obj.EntityId === Ent.ChildId;
  });
  const newRemEnts = RemEnts.map((Ent) => {
    const newEnt = {
      DiagramEntity: Ent.DiagramEntity,
      ParentId: Ent.EntityId,
      LastParent: Ent.LastParent,
      ButtonPressed: Ent.ButtonPressed,
    };
    return newEnt;
  });
  return newRemEnts;
}

function getChildId(Obj, LeftDiagramData) {
  const RemEnts = LeftDiagramData.filter((Ent) => {
    return Obj.EntityId === Ent.ParentId;
  });
  const newRemEnts = RemEnts.map((Ent) => {
    const newEnt = {
      DiagramEntity: Ent.DiagramEntity,
      ChildId: Ent.EntityId,
      LastChild: Ent.LastChild,
      ButtonPressed: Ent.ButtonPressed,
    };
    return newEnt;
  });
  return newRemEnts;
}

const buildChartGoingUp = (startingPgm, entrels) => {
  // get parent relationships going down
  let InitialObjInfo = createGoingUpObj(startingPgm, entrels, "", 0, 0, true);
  let InitialObj = InitialObjInfo[0];
  let entityId = InitialObjInfo[1];
  let childId = 0;
  // place in double nested array
  let DiagramGoingUp = [[[InitialObj]]];
  let EntLvl = [[InitialObj]];
  let EntCluster = [];
  let EntObj = {};
  let newEntLvl = [];
  let EntObjInfo = [];
  let nextLevelParents = [];
  let nextParents = [];
  let DendogramObj = {};

  nextLevelParents = EntLvl.reduce((acc, Obj) => {
    return acc.concat(Obj);
  });
  nextLevelParents = nextLevelParents.map((Obj) => {
    return Obj.DiagramParents;
  });
  nextLevelParents = nextLevelParents.reduce((acc, Obj) => {
    return acc.concat(Obj);
  });
  let level = 0;
  while (nextLevelParents.length > 0 && level < 10) {
    newEntLvl = [];
    EntLvl = EntLvl.reduce((acc, Obj) => {
      return acc.concat(Obj);
    });
    for (let cluster of EntLvl) {
      childId++;
      const parent = cluster.DiagramEntity;
      nextParents = cluster.DiagramParents;
      EntCluster = [];
      if (nextParents.length > 0) {
        for (let child of nextParents) {
          EntObjInfo = createGoingUpObj(
            child,
            entrels,
            parent,
            entityId,
            childId,
            false
          );
          EntObj = EntObjInfo[0];
          entityId = EntObjInfo[1];
          EntCluster.push(EntObj);
        }
      }
      if (EntCluster.length > 0) {
        newEntLvl.push(EntCluster);
      }
    }
    if (newEntLvl.length > 0) {
      nextLevelParents = newEntLvl.reduce((acc, Obj) => {
        return acc.concat(Obj);
      });
      nextLevelParents = nextLevelParents.map((Obj) => {
        return Obj.DiagramParents;
      });
      nextLevelParents = nextLevelParents.reduce((acc, Obj) => {
        return acc.concat(Obj);
      });
      DiagramGoingUp.push(newEntLvl);
      EntLvl = newEntLvl;
    } else {
      EntLvl = [];
      nextLevelParents = [];
    }
    level++;
  }
  //DiagramGoingUp = EliminateDiagramGoingUp(DiagramGoingUp)
  let LeftDiagramData = DiagramGoingUp.map((Lvl) => {
    return Lvl.reduce((acc, Obj) => {
      return acc.concat(Obj);
    });
  });
  LeftDiagramData = LeftDiagramData.reduce((acc, Obj) => {
    return acc.concat(Obj);
  });
  LeftDiagramData = FindParentIds(DiagramGoingUp, LeftDiagramData);
  DendogramObj = addEntClusterToParents(DiagramGoingUp, DendogramObj);
  return [DiagramGoingUp, DendogramObj];
};

// Get next level entities

const createGoingUpObj = (
  startingPgm,
  entrels,
  DiagramChild,
  entityId,
  ChildId,
  InitialObj
) => {
  let StartingPgmParentRels = entrels.filter((rel) => {
    return rel.CHLD.trim() === startingPgm;
  });

  let DiagramParents = StartingPgmParentRels.map((rel) => {
    return rel.PAR;
  });

  // check to see if last parent
  const CurrentRel = entrels.filter((rel) => {
    return rel.PAR === startingPgm;
  })[0];
  //last parent
  entityId++;
  if (CurrentRel) {
    return [
      {
        ParentIds: [],
        EntityId: entityId,
        ChildId: ChildId,
        DiagramParents: DiagramParents,
        DiagramEntity: startingPgm,
        DiagramChild: DiagramChild,
        LastParent: CurrentRel.lastParent,
        ButtonPressed: CurrentRel.ButtonPressed,
      },
      entityId,
    ];
  } else {
    return [
      {
        ParentIds: [],
        EntityId: entityId,
        ChildId: ChildId,
        DiagramParents: DiagramParents,
        DiagramEntity: startingPgm,
        DiagramChild: DiagramChild,
        LastParent: false,
        ButtonPressed: false,
      },
      entityId,
    ];
  }
};

const addEntClusterToChildren = (DiagramGoingDown, DendogramObj) => {
  DiagramGoingDown = DiagramGoingDown.map((Lvl) => {
    return Lvl.reduce((acc, Clter) => {
      return acc.concat(Clter);
    });
  });
  DiagramGoingDown = DiagramGoingDown.reduce((acc, Obj) => {
    return acc.concat(Obj);
  });
  const FirstParentObj = DiagramGoingDown.filter((Obj) => {
    return Obj.EntityId === 1;
  })[0];
  DendogramObj.children = FirstParentObj.ChildObject.map((Obj) => {
    return (Obj = getNestedChildrenGoingDown(Obj, DiagramGoingDown));
  });
  DendogramObj.name = FirstParentObj.DiagramEntity;
  return DendogramObj;
};

const addEntClusterToParents = (DiagramGoingUp, DendogramObj) => {
  DiagramGoingUp = DiagramGoingUp.map((Lvl) => {
    return Lvl.reduce((acc, Clter) => {
      return acc.concat(Clter);
    });
  });
  DiagramGoingUp = DiagramGoingUp.reduce((acc, Obj) => {
    return acc.concat(Obj);
  });
  const FirstParentObj = DiagramGoingUp.filter((Obj) => {
    return Obj.EntityId === 1;
  })[0];
  DendogramObj.children = FirstParentObj.ParentObject.map((Obj) => {
    return (Obj = getNestedParentsGoingUp(Obj, DiagramGoingUp));
  });
  DendogramObj.name = FirstParentObj.DiagramEntity;
  return DendogramObj;
};

const getNestedChildrenGoingDown = (Obj, DiagramGoingDown) => {
  let newObj = {};
  newObj.name = Obj.DiagramEntity;
  newObj.LastChild = Obj.LastChild;
  newObj.ButtonPressed = Obj.ButtonPressed;
  let nextChildren = DiagramGoingDown.filter((child) => {
    return child.EntityId === Obj.ChildId;
  });
  nextChildren = nextChildren
    .map((Obj) => {
      return Obj.ChildObject;
    })
    .reduce((acc, Obj) => acc.concat(Obj));
  if (nextChildren.length > 0) {
    newObj.children = nextChildren.map((Obj) => {
      return (Obj = getNestedChildrenGoingDown(Obj, DiagramGoingDown));
    });
  } else {
    newObj.children = [];
  }
  return newObj;
};

const getNestedParentsGoingUp = (Obj, DiagramGoingUp) => {
  // set names
  let newObj = {};
  newObj.name = Obj.DiagramEntity;
  newObj.LastParent = Obj.LastParent;
  newObj.ButtonPressed = Obj.ButtonPressed;
  let nextParents = DiagramGoingUp.filter((child) => {
    return child.EntityId === Obj.ParentId;
  });
  nextParents = nextParents
    .map((Obj) => {
      return Obj.ParentObject;
    })
    .reduce((acc, Obj) => acc.concat(Obj));
  if (nextParents.length > 0) {
    newObj.children = nextParents.map((Obj) => {
      return (Obj = getNestedParentsGoingUp(Obj, DiagramGoingUp));
    });
  } else {
    newObj.children = [];
  }
  return newObj;
};

const createGoingDownObj = (
  Entity,
  entrels,
  DiagramParent,
  entityId,
  parentId,
  InitialObj
) => {
  //console.log(entrels);
  const CurrentRel = entrels.filter((rel) => {
    return rel.CHLD === Entity;
  })[0];

  const StartingPgmChildRels = entrels.filter((rel) => {
    return rel.PAR === Entity;
  });

  const DiagramChildren = StartingPgmChildRels.map((rel) => {
    return rel.CHLD;
  });

  entityId++;
  if (CurrentRel) {
    return [
      {
        ParentId: parentId,
        EntityId: entityId,
        ChildIds: [],
        DiagramParent: DiagramParent,
        DiagramEntity: Entity,
        DiagramChildren: DiagramChildren,
        LastChild: CurrentRel.lastChild,
        ButtonPressed: CurrentRel.ButtonPressed,
      },
      entityId,
    ];
  } else {
    return [
      {
        ParentId: parentId,
        EntityId: entityId,
        ChildIds: [],
        DiagramParent: DiagramParent,
        DiagramEntity: Entity,
        DiagramChildren: DiagramChildren,
        LastChild: false,
        ButtonPressed: false,
      },
      entityId,
    ];
  }
};

export const buildChart = (entrels, startingPgm) => {
  const DiagramGoingDown = buildChartGoingDown(startingPgm, entrels);
  const DiagramGoingUp = buildChartGoingUp(startingPgm, entrels);
  return [DiagramGoingDown, DiagramGoingUp];
};
