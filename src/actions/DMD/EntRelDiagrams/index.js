import { buildChart } from "./EntRelationshipDiagram";

export const buildEntData = (startingPgm, entrels) => {
  // otherRels
  console.log(startingPgm);

  entrels = entrels.map((rel) => {
    rel.PAR = rel.PAR.trim();
    rel.CHLD = rel.CHLD.trim();
    return rel;
  });
  console.log('check entrels',entrels)
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
  console.log(other);
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
  console.log(other)
  console.log(otherLinks); 
  let AllLinks = ParentLinks.concat(otherLinks);
  AllLinks = ChildLinks.concat(AllLinks);
  const FinalNodes = [...AllNodes, { name: startingPgm }];

  const otherRelations = new Set();
  otherLinks.forEach(element => {
    otherRelations.add(element.source.name)
    otherRelations.add(element.target.name)
  });  
  //const graph = creategraph
  // get other Rels
  // const relation = {'mainEntity': startingPgm,'parents': ParentTree.children, 'children': ChildTree.children}
  const relation = {'mainEntity': startingPgm,'parents': ChildTree.children, 'children': ParentTree.children, 'otherRels' : otherRelations}
  console.log("00000-relation",relation);
  const graph = { nodes: FinalNodes, links: AllLinks, relation };
  console.log(graph);
  return graph;
};
