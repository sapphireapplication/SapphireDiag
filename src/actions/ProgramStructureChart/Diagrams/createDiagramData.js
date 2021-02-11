import { getProgramHierarchy } from "./First_Iteration.js";
import { expandPgmHierarchy } from "./Further_Iterations.js";
import { fullyEliminateDiagram } from "./Elimination.js";
import { FindEndpoints } from "./CreateEndPoint.js";

//gets program hierarchy but accounts for "spanning" - can easily change this so there is no spanning/ or elimination
// move to another module
export const createDiagData = (EntryPoint, programs) => {
  let firstIteration;
  let Diagram = [];
  let furtherIteration = [];
  let Lvl = 0;
  let lastEntityId = 0;
  let prevLvl = 0;
  // parameterfor setting the level depth of the diagram
  let maxLvl = 5;
  // parameterfor setting the maximum number of chidren that a single entity in the diagram can have
  let maxEntityChildren = 10;

  firstIteration = getProgramHierarchy(
    EntryPoint,
    programs,
    maxLvl,
    maxEntityChildren
  );
  lastEntityId = firstIteration.entityId;
  Diagram = firstIteration.AlllevelPgmsDataArray;
  Lvl = firstIteration.Level;
  let Iterations = 0;

  // // Iterations control for elimination loops
  // // this is where two branches are competing to eliminate each other
  while (Iterations < 10) {
    // expand diagram from bottom until you hit a previously placed program
    furtherIteration = expandPgmHierarchy(
      Diagram,
      lastEntityId,
      maxLvl,
      maxEntityChildren,
      programs
    );
    Diagram = furtherIteration[0];
    lastEntityId = furtherIteration[1].entityId;
    // eliminate duplicates from diagram after each iteration
    Diagram = fullyEliminateDiagram(Diagram);
    Lvl = Diagram.length;
    // do 10 iteration or so we don't endup with a weird iteration with few levels due to elimination sequence
    if (Lvl >= prevLvl) {
      Iterations++;
    }
  }
  //addchildids to diagram after further iterations to create child ids for further iterations
  Diagram = addChildIds(Diagram);
  Diagram = Diagram.map((lvl) => {
    return lvl.reduce((acc, obj) => {
      return acc.concat(obj);
    });
  });
  //add Endpoint Pgms to the bottom of diagram and place under deepest calling pgm
  Diagram = FindEndpoints(Diagram);
  return Diagram;
};

function addChildIds(Diagram) {
  //addchildids to diagram after further iterations
  let RevDiagramCopy = Diagram.slice(0);
  let RevDiagramCopy2 = Diagram.slice(0);
  RevDiagramCopy = RevDiagramCopy.map((Lvl) => {
    return (Lvl = Lvl.map((clter) => {
      return (clter = clter.map((Obj) => {
        Obj.childIds = findEntIdAsParentId(Obj.entityId, RevDiagramCopy2);
        return Obj;
      }));
    }));
  });
  return RevDiagramCopy;
}

function findEntIdAsParentId(EntId, RevDiagramCopy2) {
  // find parentid based on entid to work out children diagram
  RevDiagramCopy2 = RevDiagramCopy2.map((Lvl) => {
    return Lvl.reduce((acc, clter) => {
      return acc.concat(clter);
    });
  });
  RevDiagramCopy2 = RevDiagramCopy2.reduce((acc, Lvl) => {
    return acc.concat(Lvl);
  });
  let Ents = RevDiagramCopy2.filter((ent) => {
    return ent.parentId === EntId;
  });
  let childIds = Ents.map((Obj) => {
    return Obj.entityId;
  });
  return childIds;
}
