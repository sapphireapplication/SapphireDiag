export const checkIfBlueOrRed = (name, DiagramData) => {
  let DiagEnt = DiagramData.filter((ent) => {
    return ent.program === name;
  })[0];

  if (DiagEnt) {
    let DiagEntMoved_Object = DiagEnt.Moved_Object;
    if (DiagEntMoved_Object) {
      return "red";
    } else {
      return "blue";
    }
  }
  return "blue";
};

export const converttocoords = (rel) => {
  return {
    relID: rel.parent.name + ":" + rel.child.name,
    coords: [
      {
        x: rel.parent.x,
        y: rel.parent.y+300,
      },

      {
        x: rel.child.x,
        y: rel.child.y-300,
      },
    ],
  };
};

export const findEndPointRelCoords = (
  EndPointRels,
  newEndPointCoords,
  descendants
) => {
  let newRels = EndPointRels.map((rel) => {
    let newID = rel.relID.split(":");
    let newObj = {};
    newObj.parent = findparentCoords(newID[0], descendants);
    newObj.child = findendPointCoords(newID[1], newEndPointCoords);
    return newObj;
  });
  return newRels;
};

export const findparentCoords = (ID, descendants) => {
  let newdescendants = descendants.map((ent) => {
    let newObj = {};
    newObj.x = ent.x;
    newObj.y = ent.y;
    newObj.name = ent.data.name;
    return newObj;
  });
  newdescendants = newdescendants.filter((desc) => {
    return desc.name === ID;
  })[0];

  return newdescendants;
};
export const findchildCoords= (ID, descendants)=> {
  let newdescendants = descendants.map((ent) => {
    let newObj = {}
    newObj.x = ent.x;
    newObj.y = ent.y;
    newObj.name = ent.data.name;
    newObj.depth = ent.depth;
    return newObj
  });

  newdescendants = newdescendants.filter((desc) => { return desc.name === ID })[0]

  return newdescendants

}

/*function findparentCoords(ID, descendants) {
  let newdescendants = descendants.map((ent) => {
    let newObj = {}
    newObj.x = ent.x;
    newObj.y = ent.y;
    newObj.name = ent.data.name;
    return newObj
  });

  newdescendants = newdescendants.filter((desc) => { return desc.name === ID })[0]

  return newdescendants

}*/

// check end points

export const findendPointCoords = (ID, newEndPointCoords) => {
  let endPointCoords = newEndPointCoords.map((endpoint) => {
    let newObj = {};
    newObj.x = endpoint.xcoord;
    newObj.y = endpoint.ycoord;
    newObj.name = endpoint.program;
    return newObj;
  });

  endPointCoords = endPointCoords.filter((endPoint) => {
    return endPoint.name === ID;
  })[0];

  return endPointCoords;
};

export const findRemRelCoords = (RemRels, descendants) => {
  let newRels = RemRels.map((rel) => {
    let newID = rel.relID.split(":");
    rel.parent = findparentCoords(newID[0], descendants);
    rel.child = findparentCoords(newID[1], descendants);
    return rel;
  });

  //check if APSO50 is a parent

  return newRels;
};

export const diagonal = (s, d) => {
  const diff = (d.y - s.y - 150) / 2;
  const p = s.x + 75;
  const q = s.y + 150;
  const r = q + diff;
  s = d.x + 75;
  const t = d.y;
  const path = `M ${p} ${q}
            L ${p} ${r}
            L ${s} ${r}
            L ${s} ${t}`;
  return path;
};

export const getPgmCoords = (DiagramData, searchValue) => {
  console.log(DiagramData);
  console.log(searchValue);

  if (DiagramData.name === searchValue)
    return { centerX: DiagramData.x, centerY: DiagramData.y };

  const findPgmOnChildren = (childrenArray, searchValue) => {
    if (childrenArray.length === 0) return;
    console.log(childrenArray);
    childrenArray.forEach((child) => {
      if (child.data.name === searchValue)
        return { centerX: child.x, centerY: child.y };
      else {
        if (child.data.children.length > 0)
          findPgmOnChildren(child.children, searchValue);
      }
    });
  };
  let childValue = { centerX: "", centerY: "" };

  findPgmOnChildren(DiagramData.children, searchValue);
  return childValue;
};

export const createIndLinks = (coords) => {
  const parentAdjustment = {};
  return coords.map((coord) => {
    // for each parent
    if (parentAdjustment[coord.parent.name])
      parentAdjustment[coord.parent.name] += 1;
    else parentAdjustment[coord.parent.name] = 1;
    coord.parent.x = coord.parent.x + parentAdjustment[coord.parent.name] * 5;
    coord.parent.y = coord.parent.y - parentAdjustment[coord.parent.name] * 5;
    return coord;
  });
};

export const createChildLinks = (coords) => {
  const childAdjustment = {};
  return coords.map((coord) => {
    // for each parent
    if (childAdjustment[coord.child.name])
      childAdjustment[coord.child.name] += 1;
    else childAdjustment[coord.child.name] = 1;
    coord.child.x = coord.child.x + childAdjustment[coord.child.name] * 5;
    coord.child.y = coord.child.y - childAdjustment[coord.child.name] * 5;
    return coord;
  });
};

export const getAnnotatedPgm = (pgmName, data) => {
  console.log(pgmName);
  console.log(data);
};
