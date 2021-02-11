export const FindEndpoints = (Diagram) => {
  let DiagramEnts = Diagram.reduce((acc, ents) => {
    return acc.concat(ents);
  });
  Diagram = Diagram.map((lvl) => {
    return lvl.map((Obj) => {
      Obj.EndPointPgms = [];
      if (!Obj.Moved_Object) {
        Obj.EndPointPgms = checkObjBelow(
          Obj.calledPrograms,
          DiagramEnts,
          Obj.Level,
          Obj.entityId,
          Obj.program
        );
      }
      return Obj;
    });
  });
  return Diagram;
};

function checkObjBelow(calledPgms, DiagramEnts, Level, parentId, parentPgm) {
  let newdiagEnts = [];
  let Levels = [];
  let MaxLevel = 0;
  let newCalledPgms = [];

  if (calledPgms.length > 0) {
    for (let pgm of calledPgms) {
      newdiagEnts = DiagramEnts.filter((ent) => {
        return ent.program === pgm;
      });
      Levels = newdiagEnts.map((ent) => {
        return ent.Level;
      });
      MaxLevel = Math.max(...Levels);
      let endPointPgm = "";
      if (MaxLevel > Level) {
        endPointPgm = "false";
      } else {
        endPointPgm = "true";
      }
      newCalledPgms.push({
        calledPgm: pgm,
        endPointPgm: endPointPgm,
        parentProgram: parentPgm,
        parentId: parentId,
      });
    }
  }
  return newCalledPgms;
}
