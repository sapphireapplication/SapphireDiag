import { buildChart } from "./EntRelationshipDiagram";

export const buildEntData = (startingPgm, entrels) => {
  // otherRels
  console.log(startingPgm);

  entrels = entrels.map((rel) => {
    rel.PAR = rel.PAR.trim();
    rel.CHLD = rel.CHLD.trim();
    return rel;
  });

  let Diagrams = buildChart(entrels, startingPgm);
  let ParentTree = Diagrams[0];
  ParentTree = ParentTree[1];
  let ChildTree = Diagrams[1];
  ChildTree = ChildTree[1];

  // get list of nodes
  const ParentNodes = ParentTree.children.map((node) => ({ name: node.name }));
  const ChildNodes = ChildTree.children.map((node) => ({ name: node.name }));

  const ParentNames = ParentNodes.map((node) => node.name);
  const ChildNames = ChildNodes.map((node) => node.name);

  const AllNodes = ParentNodes.concat(ChildNodes);
  const AllNames = AllNodes.map((node) => node.name);

  // check Entrels for relations
  const parent = entrels.filter((rel) => AllNames.includes(rel.PAR));
  const other = parent.filter((rel) => AllNames.includes(rel.CHLD));

  const ParentLinks = ParentNames.map((name) => ({
    source: { name: name },
    target: { name: startingPgm },
  }));
  const ChildLinks = ChildNames.map((name) => ({
    source: { name: startingPgm },
    target: { name: name },
  }));
  const otherLinks = other.map((rel) => ({
    source: { name: rel.PAR },
    target: { name: rel.CHLD },
  }));
  let AllLinks = ParentLinks.concat(otherLinks);
  AllLinks = ChildLinks.concat(AllLinks);
  const FinalNodes = [...AllNodes, { name: startingPgm }];
  const graph = { nodes: FinalNodes, links: AllLinks };

  //const graph = creategraph
  // get other Rels
  return graph;
};
