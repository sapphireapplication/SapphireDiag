function getDirectlyEliminatedEntityIds(RevDiagramCopy) {
  let prevPgms = [];
  let EntityIds = [];
  EntityIds = RevDiagramCopy.map((Lvl) => {
    Lvl = Lvl.map((Cltr) => {
      Cltr = Cltr.map((Obj) => {
        if (prevPgms.includes(Obj.program)) {
          return Obj.entityId;
        }
        prevPgms.push(Obj.program);
        return "NOT_ELIMINATED";
      }).filter((Obj) => {
        return Obj !== "NOT_ELIMINATED";
      });
      if (Cltr.length > 0) {
        return Cltr;
      } else {
        return "NOT_ELIMINATED";
      }
    }).filter((Cltr) => {
      return Cltr !== "NOT_ELIMINATED";
    });
    if (Lvl.length > 0) {
      return Lvl;
    } else {
      return "NOT_ELIMINATED";
    }
  }).filter((Lvl) => {
    return Lvl !== "NOT_ELIMINATED";
  });
  if (EntityIds.length > 0) {
    EntityIds = EntityIds.map((lvl) => {
      return lvl.reduce((acc, Id) => {
        return acc.concat(Id);
      });
    });
    EntityIds = EntityIds.reduce((acc, lvl) => {
      return acc.concat(lvl);
    });
  }
  return EntityIds;
}

function getAdditionalImpactedEntityIds(RevDiagramCopy, EliminatedEntityIds) {
  let AdditionalImpactedEliminatedEntityIds = [];
  AdditionalImpactedEliminatedEntityIds = RevDiagramCopy.map((Lvl) => {
    Lvl = Lvl.map((Cltr) => {
      Cltr = Cltr.map((Obj) => {
        if (EliminatedEntityIds.includes(Obj.parentId)) {
          return Obj.entityId;
        }
        return "NOT_ELIMINATED";
      }).filter((Obj) => {
        return Obj !== "NOT_ELIMINATED";
      });
      if (Cltr.length > 0) {
        return Cltr;
      } else {
        return "NOT_ELIMINATED";
      }
    }).filter((Cltr) => {
      return Cltr !== "NOT_ELIMINATED";
    });
    if (Lvl.length > 0) {
      return Lvl;
    } else {
      return "NOT_ELIMINATED";
    }
  }).filter((Lvl) => {
    return Lvl !== "NOT_ELIMINATED";
  });
  if (AdditionalImpactedEliminatedEntityIds.length > 0) {
    AdditionalImpactedEliminatedEntityIds = AdditionalImpactedEliminatedEntityIds.map(
      (lvl) => {
        return lvl.reduce((acc, Id) => {
          return acc.concat(Id);
        });
      }
    );
    AdditionalImpactedEliminatedEntityIds = AdditionalImpactedEliminatedEntityIds.reduce(
      (acc, lvl) => {
        return acc.concat(lvl);
      }
    );
  }
  return AdditionalImpactedEliminatedEntityIds;
}

function getIdsOfEntitiesToEliminate(RevDiagramCopy) {
  let EliminatedIds = getDirectlyEliminatedEntityIds(RevDiagramCopy);
  if (EliminatedIds.length > 0) {
    let IndirectlyImpactedIds = getAdditionalImpactedEntityIds(
      RevDiagramCopy,
      EliminatedIds
    );
    IndirectlyImpactedIds = IndirectlyImpactedIds.filter((Id) => {
      return !EliminatedIds.includes(Id);
    });
    while (IndirectlyImpactedIds.length > 0) {
      EliminatedIds = EliminatedIds.concat(IndirectlyImpactedIds);
      IndirectlyImpactedIds = getAdditionalImpactedEntityIds(
        RevDiagramCopy,
        IndirectlyImpactedIds
      );
      IndirectlyImpactedIds = IndirectlyImpactedIds.filter((Id) => {
        return !EliminatedIds.includes(Id);
      });
    }
  }
  return EliminatedIds;
}

// eliminate diagram by turning called programs to blank ="" but not removing them as need parent id for

export const fullyEliminateDiagram = (Diagram) => {
  let prevPgms = [];
  let DiagramCopy = Diagram.slice(0);
  let RevDiagramCopy = DiagramCopy.reverse();
  let EntitiesToEliminate = [];
  EntitiesToEliminate = getIdsOfEntitiesToEliminate(RevDiagramCopy);

  if (EntitiesToEliminate.length > 0) {
    RevDiagramCopy = RevDiagramCopy.map((Lvl) => {
      Lvl = Lvl.map((Cltr) => {
        Cltr = Cltr.map((Obj) => {
          if (EntitiesToEliminate.includes(Obj.entityId)) {
            return "ELIMINATED";
          }
          return Obj;
        }).filter((Obj) => {
          return Obj !== "ELIMINATED";
        });
        if (Cltr.length > 0) {
          return Cltr;
        } else {
          return "ELIMINATED";
        }
      }).filter((Cltr) => {
        return Cltr !== "ELIMINATED";
      });
      if (Lvl.length > 0) {
        return Lvl;
      } else {
        return "ELIMINATED";
      }
    }).filter((Lvl) => {
      return Lvl !== "ELIMINATED";
    });
  }

  const FinalDiagram = RevDiagramCopy.reverse();
  return FinalDiagram;
};
