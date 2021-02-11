import { createDiagData } from "./createDiagramData";
import { reformatData } from "./ReformatData";
import { getCorePgmrelations } from "./PgmRelations";
import { getEndPointCoordsandRemainingRelations } from "./EndPointAndRemainingRels";
import { removeManyChildrenEntities } from "./RemoveManyChildrenEntities";
import { getLevelsCount } from "./LevelsCount";

export const getPgmStructureChartData = async (pgm, programs) => {
  const Diagram = createDiagData(pgm, programs);
  const levelsCount = getLevelsCount(Diagram);
  let Dendogramtree = reformatData(Diagram);
  const CoreDiagramrels = getCorePgmrelations(flattenDiagram(Diagram));

  let Remainingrels = getEndPointCoordsandRemainingRelations(
    flattenDiagram(Diagram),
    CoreDiagramrels,
    programs
  );

  [Dendogramtree, Remainingrels] = await removeManyChildrenEntities(
    Dendogramtree,
    Remainingrels
  );

  const expandedList = getExpandedList(Remainingrels, Diagram);

  return {
    name: pgm,
    data: [Dendogramtree, Remainingrels, Diagram, levelsCount, expandedList],
  };
};

const getExpandedList = (Remainingrels, Diagram) => {
  const parentRemRels = Remainingrels.map((rel) => rel.relID.split(":")[0]);

  // getMaxEntityId
  let maxEntityId = 0;
  Diagram.map((diagArr) => {
    diagArr.map((diag) => {
      if (diag.entityId > maxEntityId) {
        maxEntityId = diag.entityId;
      }
    });
  });
  const newDiagramArr = Diagram.reduce((acc, diag) => {
    return acc.concat(diag);
  }, []);

  const finalDiagramArr = newDiagramArr.map((diag) => {
    if (parentRemRels.includes(diag.program)) diag.Moved_Object = true;
    return diag;
  });

  return { finalDiagramArr, maxEntityId };
};

const flattenDiagram = (Diagram) => {
  return Diagram.reduce((acc, obj) => acc.concat(obj));
};

export const addPgmStructureChartData = async (pgm, programs) => {
  const potentialNewRels = programs.filter((program) => program.PGMID === pgm);
  const potentialNewChildren = potentialNewRels.map(
    (program) => program.CLDPGM
  );
  const furtherRels = potentialNewRels.map((pgm) => {
    pgm.toAdd = checkIfHasFurtherChildren(pgm.CLDPGM, programs);
    // check program in
    return pgm;
  });
  return { NewRels: furtherRels, NewChildren: potentialNewChildren };
};

const checkIfHasFurtherChildren = (calledPgm, programs) => {
  const furtherNewRels = programs.filter(
    (program) => program.PGMID === calledPgm
  );
  if (furtherNewRels.length > 0) return true;
  return false;
};

const searchTreeAndReplace = (dataTree, NewNode, entityId) => {
  if (dataTree.entityId === entityId) {
    const dataTreeName = dataTree.children.map((chld) => chld.name);
    const relToAdd = NewNode.filter(
      (rel) => !dataTreeName.includes(rel.CLDPGM)
    );

    dataTree.expanded = true;
    relToAdd.map((rel) => {
      dataTree.children = [
        ...dataTree.children,
        {
          name: rel.program,
          children: [],
          entityId: rel.entityId,
          expanded: false,
        },
      ];
    });
    return dataTree;
  }

  if (dataTree.children) {
    if (dataTree.children.length > 0) {
      dataTree.children.map((chld) =>
        searchTreeAndReplace(chld, NewNode, entityId)
      );
      return dataTree;
    }
  }

  return dataTree;
};

export const replacePgmStructureCharBranch = (
  diagData,
  diagId,
  NewRels,
  pgm,
  entityId
) => {
  if (diagData.length > 0) {
    console.log(NewRels);
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    const newDiagCheck = { ...diagCheck[0] };
    const currentData = { ...newDiagCheck.data[0] };
    let oldMaxEntityId = newDiagCheck.data[4].maxEntityId;
    const finalDiagramArr = newDiagCheck.data[4].finalDiagramArr;
    const finalNewRels = NewRels.map((rel) => {
      oldMaxEntityId++;
      return {
        program: rel.CLDPGM,
        Moved_Object: rel.toAdd,
        entityId: oldMaxEntityId,
      };
    });
    const newfinalDiagramArr = [...finalDiagramArr, ...finalNewRels];
    const dataTree = searchTreeAndReplace(currentData, finalNewRels, entityId);
    const remDiagCheck = diagData.filter((diag) => diag.diagId !== diagId);
    newDiagCheck.data[0] = dataTree;
    newDiagCheck.data[4].maxEntityId = oldMaxEntityId;
    newDiagCheck.data[4].finalDiagramArr = newfinalDiagramArr;
    return [...remDiagCheck, newDiagCheck];
  }

  return diagData;
  // search data and replace with new Branch.
};

export const collapsePgmStructureChartData = (
  diagData,
  diagId,
  pgm,
  entityId
) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    const newDiagCheck = { ...diagCheck[0] };
    const currentData = { ...newDiagCheck.data[0] };
    const dataTree = collapseTree(currentData, entityId);
    const remDiagCheck = diagData.filter((diag) => diag.diagId !== diagId);
    const finalDiagramArr = newDiagCheck.data[4].finalDiagramArr;
    //filter out ids
    //add ids
    newDiagCheck.data[0] = dataTree;
    return [...remDiagCheck, newDiagCheck];
  }
};

const collapseTree = (dataTree, entityId) => {
  if (dataTree.entityId === entityId) {
    dataTree.children = [];
    dataTree.expanded = false;
    return dataTree;
  }

  if (dataTree.children) {
    if (dataTree.children.length > 0) {
      dataTree.children.map((chld) => collapseTree(chld, entityId));
      return dataTree;
    }
  }

  return dataTree;
};
