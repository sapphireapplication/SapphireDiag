export const reformatData = (Diagram) => {
  //
  let DendogramObj = {};
  DendogramObj = addEntClusterToChildren(Diagram, DendogramObj);
  return DendogramObj;
};

function addEntClusterToChildren(Diagram, DendogramObj) {
  let newDiagram = Diagram.reduce((acc, Obj) => {
    return acc.concat(Obj);
  });

  const FirstParentObj = newDiagram.filter((Obj) => {
    return Obj.entityId === 1;
  })[0];
  DendogramObj.children = FirstParentObj.childIds.map((Id) => {
    return getNestedChildrenGoingDown(Id, newDiagram);
  });
  DendogramObj.name = FirstParentObj.program;
  DendogramObj.entityId = 1;
  DendogramObj.expanded = false;
  return DendogramObj;
}

function getNestedChildrenGoingDown(Id, newDiagram) {
  // set names
  let newObj = {};
  let nextChild = newDiagram.filter((child) => {
    return child.entityId === Id;
  })[0];
  newObj.name = nextChild.program;
  newObj.entityId = nextChild.entityId;
  newObj.expanded = false;
  let nextChildren = nextChild.childIds;
  if (nextChildren.length > 0) {
    newObj.children = nextChildren.map((Id) => {
      return getNestedChildrenGoingDown(Id, newDiagram);
    });
  } else {
    newObj.children = [];
  }
  return newObj;
}
