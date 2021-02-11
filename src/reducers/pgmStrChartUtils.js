const getInitAnnotations = (data) => {
  const pgms = data[2];
  const flattenedPgms = pgms.reduce((obj, red) => red.concat(obj));
  const initAnnots = flattenedPgms.map((pgm) => ({
    name: pgm.program,
    annotated: false,
    url: null,
  }));
  return initAnnots;
};

export const setAnnotation = (diagData, diagId, pgm, link) => {
  const diag = findDiagram(diagData, diagId);
  const annotations = diag.annotations;
  const newAnnotations = annotations.map((annot) => {
    if (annot.name === pgm) {
      annot.annotated = true;
      annot.url = link;
    }
    return annot;
  });
  const otherDiags = diagData.filter((diag) => diag.diagId !== diagId);
  diag.annotations = newAnnotations;
  return [diag, ...otherDiags];
};

const findDiagram = (diagrams, diagId) => {
  return diagrams.filter((diag) => diag.diagId === diagId)[0];
};

export const highlightNodeDiagramData = (diagData, diagId, highlightnode) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    const remDiags = diagData.filter((diag) => diag.diagId !== diagId);
    if (diagCheck.length > 0) {
      const newDMDDiag = diagCheck[0];
      const newDMDDiagData = newDMDDiag.data;
      const newDMDLinks = newDMDDiagData.links.map((link) => {
        if (link.source.name === highlightnode.name) link.highlighted = true;
        else if (link.target.name === highlightnode.name)
          link.highlighted = true;
        else link.highlighted = false;
        return link;
      });
      const newDMDNodes = newDMDDiagData.nodes.map((node) => {
        if (node.name === highlightnode.name) node.highlighted = true;
        else node.highlighted = false;
        return node;
      });

      newDMDDiagData.links = newDMDLinks;
      newDMDDiagData.nodes = newDMDNodes;
      newDMDDiag.data = newDMDDiagData;

      const newDiag = [...remDiags, newDMDDiag];
      return newDiag;
    }

    return diagData;
  } else return diagData;
};

export const RemoveHighlightedNodeAndLinks = (diagData, diagId) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    const remDiags = diagData.filter((diag) => diag.diagId !== diagId);
    if (diagCheck.length > 0) {
      const newDMDDiag = diagCheck[0];
      const newDMDDiagData = newDMDDiag.data;
      const newDMDLinks = newDMDDiagData.links.filter((link) => {
        return !link.highlighted;
      });
      const newDMDNodes = newDMDDiagData.nodes.filter((node) => {
        return !node.highlighted;
      });
      newDMDDiagData.links = newDMDLinks;
      newDMDDiagData.nodes = newDMDNodes;
      newDMDDiag.data = newDMDDiagData;

      const newDiag = [...remDiags, newDMDDiag];
      return newDiag;
    }

    return diagData;
  } else return diagData;
};

export const highlightLinkDiagramData = (diagData, diagId, highlightLink) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    const remDiags = diagData.filter((diag) => diag.diagId !== diagId);
    if (diagCheck.length > 0) {
      const newDMDDiag = diagCheck[0];
      const newDMDDiagData = newDMDDiag.data;
      const newDMDLinks = newDMDDiagData.links.map((link) => {
        if (
          link.source.name === highlightLink.source.name &&
          link.target.name === highlightLink.target.name
        )
          link.highlighted = true;
        else link.highlighted = false;
        return link;
      });
      const newDMDNodes = newDMDDiagData.nodes.map((node) => {
        node.highlighted = false;
        return node;
      });

      newDMDDiagData.links = newDMDLinks;
      newDMDDiagData.nodes = newDMDNodes;
      newDMDDiag.data = newDMDDiagData;

      const newDiag = [...remDiags, newDMDDiag];
      return newDiag;
    }

    return diagData;
  } else return diagData;
};

export const setDMDDiagramData = (
  diagData,
  diagId,
  data,
  type,
  seqId,
  zoomLevel,
  ent
) => {
  const diag = {
    diagId,
    seqId,
    data: {
      links: data.links,
      nodes: data.nodes,
    },
    type,
    name: ent,
    state: {
      centre: { centerX: 0, centerY: 0 },
      zoomLevel: zoomLevel,
      highlightedPgm: "",
      loaded: true,
      maxLevel: 1,
    },
  };

  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length > 0) {
      return diagData;
    }

    const newDiag = [...diagData, diag];
    console.log(newDiag);
    return newDiag;
  }
  return [...diagData, diag];
};

// get StrDiagramData
// expand tree
// check if further children
// if yes add a flag if no dont

export const setDiagramData = (
  diagData,
  diagId,
  data,
  type,
  pgm
) => {
  // check if diagram already exists
console.log("ab bolo==", diagData,
  diagId,
  data,
  type,
  pgm)
  let annotations = [];
  if (type === "PGM_STR_CHART") annotations = getInitAnnotations(data);

  const diag = {
    diagId,
    //seqId,
    data,
    annotations,
    type,
    name: pgm,
    state: {
      //centre: { centerX: 0, centerY: 0 },
      //zoomLevel: zoomLevel,
      highlightedPgm: "",
      loaded: true,
      maxLevel: 1,
    },
  };
  //console.log('shilpi_pgm diagData', diagData)
  //console.log('shilpi_pgm diag obj',diag)
  /*if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length > 0) {
      return diagData;
    }

    const newDiag = [...diagData, diag];
    console.log('shilpi_pgm newDiag',newDiag)
    return newDiag;
  }*/
  diagData[0] = diag;
  //return [...diagData, diag];
  return diagData;
};

export const setNextZoomLevel = (diagData, zoomLevel, diagId) => {
  // check if diagram already exists
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length === 0) {
      return diagData;
    }

    return diagData.map((diag) => {
      if (diag.diagId === diagId) {
        diag.state.zoomLevel = zoomLevel;
      }
      return diag;
    });
  }
};

export const setNextCentre = (diagData, centre, diagId) => {
  // check if diagram already exists
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length === 0) {
      return diagData;
    }

    return diagData.map((diag) => {
      if (diag.diagId === diagId) {
        diag.state.centre = centre;
      }
      return diag;
    });
  }
};

export const setNextLoadedStatus = (diagData, loaded, diagId) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length === 0) {
      return diagData;
    }

    return diagData.map((diag) => {
      if (diag.diagId === diagId) {
        diag.state.loaded = loaded;
      }
      return diag;
    });
  }
};

export const setHighlightPgms = (diagData, HighlightedPgms, diagId) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length === 0) {
      return diagData;
    }

    return diagData.map((diag) => {
      if (diag.diagId === diagId) {
        diag.state.HighlightedPgms = diag.state.HighlightedPgms.push(
          HighlightedPgms
        );
      }
      return diag;
    });
  }
};

export const setNextStrChartMode = (diagData, mode, diagId) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length === 0) {
      return diagData;
    }

    return diagData.map((diag) => {
      if (diag.diagId === diagId) {
        diag.state.mode = mode;
      }
      return diag;
    });
  }
};

export const saveRemovedNodes = (diagData, name, diagId) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length > 0) {
      const newDiagCheck = { ...diagCheck[0] };
      const currentData = newDiagCheck.data;
      const currentLinks = currentData.links;
      const oldParentLinks = currentLinks.filter(
        (link) => link.source.name === name
      );
      const oldChildLinks = currentLinks.filter(
        (link) => link.target.name === name
      );
      const oldLinks = [...oldParentLinks, ...oldChildLinks];
      const oldData = { name, links: oldLinks };
      return oldData;
    }
  }
};

export const resetNode = (diagData, removeDMDNodes, name, diagId) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);

    if (removeDMDNodes.length > 0) {
      const RemovedNode = removeDMDNodes.filter(
        (node) => node.name === name
      )[0];
      const RemovedLinks = RemovedNode.links;
      console.log(RemovedLinks);
      const RemovedNodeNames = removeDMDNodes.map((node) => node.name);
      console.log(RemovedNodeNames);

      const otherRemoveNodeNames = RemovedNodeNames.filter(
        (node) => node !== name
      );
      console.log(otherRemoveNodeNames);
      const filteredRemovedLinks = RemovedLinks.filter(
        (link) => !otherRemoveNodeNames.includes(link.source.name)
      );
      console.log(filteredRemovedLinks);

      const finalFilteredRemovedLinks = filteredRemovedLinks.filter(
        (link) => !otherRemoveNodeNames.includes(link.target.name)
      );
      const newDiagCheck = { ...diagCheck[0] };
      const currentData = newDiagCheck.data;
      const newLinks = [...finalFilteredRemovedLinks, ...currentData.links];
      const newNodes = [...currentData.nodes, { name: name }];
      const newData = { nodes: newNodes, links: newLinks };
      newDiagCheck.data = newData;
      const diagNotCheck = diagData.filter((diag) => diag.diagId !== diagId);
      return [...diagNotCheck, newDiagCheck];
    }
  }
  return diagData;
  // add relevant node to diagram
  // find node links
  // check for other removed nodes in links
  // add node and links
};

// need to make this work
export const addNode = (diagData, name, diagId, entrels) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    const newRelations = entrels.filter((ent) => ent.PAR === name);
    console.log(newRelations);
    const newRelationNames = newRelations.map((rel) => rel.CHLD);
    const names = [...new Set(newRelationNames)];

    if (diagCheck.length > 0) {
      const newDiagCheck = { ...diagCheck[0] };
      const currentData = newDiagCheck.data;
      const currentNodes = currentData.nodes;
      const currentNames = currentNodes.map((node) => node.name);
      const newNodes = names.filter((ent) => !currentNames.includes(ent));

      //console.log(nameObjs);
      const currentLinks = currentData.links;
      const newLinks = getNewLinks(entrels, name, currentLinks);
      const newSource = newLinks.map((link) => link.source.name);
      const newTarget = newLinks.map((link) => link.target.name);
      const filteredSource = newSource.filter(
        (source) => !currentNames.includes(source)
      );
      const filteredTarget = newTarget.filter(
        (target) => !currentNames.includes(target)
      );
      const finalfiltered = filteredTarget.concat(filteredSource);
      const nameObjs = finalfiltered.map((node) => ({ name: node }));
      // check if link exists
      const newNames = [...currentNodes, ...nameObjs];
      const finalLinks = [...newLinks, ...currentLinks];
      const newData = { nodes: newNames, links: finalLinks };
      newDiagCheck.data = newData;
      const diagNotCheck = diagData.filter((diag) => diag.diagId !== diagId);
      //return diagData;
      return [...diagNotCheck, newDiagCheck];
    }
    return diagData;
  } else return diagData;
};

const getNewLinks = (entrels, name, currentLinks) => {
  const parents = entrels.filter((ent) => ent.PAR === name);
  const currentLinkNames = currentLinks.map(
    (link) => link.source.name + ":" + link.target.name
  );
  const filteredParents = parents.filter((ent) => {
    const name1 = ent.PAR + ":" + ent.CHLD;
    const name2 = ent.CHLD + ":" + ent.PAR;
    if (currentLinkNames.includes(name1) || currentLinkNames.includes(name2))
      return false;
    else return true;
  });
  const newLinks = filteredParents.map((link) => ({
    source: { name: link.PAR },
    target: { name: link.CHLD },
  }));
  console.log(newLinks);
  return newLinks;
};

export const removeNode = (diagData, name, diagId) => {
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length > 0) {
      const newDiagCheck = { ...diagCheck[0] };
      const currentData = newDiagCheck.data;
      const currentNodes = currentData.nodes;
      const newNodes = currentNodes.filter((node) => node.name !== name);
      const currentLinks = currentData.links;
      const newParentLinks = currentLinks.filter(
        (link) => link.source.name !== name
      );
      const newLinks = newParentLinks.filter(
        (link) => link.target.name !== name
      );
      const newData = { nodes: newNodes, links: newLinks };
      newDiagCheck.data = newData;
      const diagNotCheck = diagData.filter((diag) => diag.diagId !== diagId);
      return [...diagNotCheck, newDiagCheck];
    }
    return diagData;
  } else return diagData;
};

export const addEntAndRelsToSandbox = (sandBox, ent, relation) => {
  const newDMDSandbox = { ...sandBox };
  newDMDSandbox.relations = [...newDMDSandbox.relations, ...relation];
  const newParentEntities = relation.map((rel) => rel.split(":")[0]);
  const newChildEntities = relation.map((rel) => rel.split(":")[1].trim());
  const finalParentEntities = newParentEntities.filter(
    (parEnt) => parEnt !== ent
  );
  const finalChildEntities = newChildEntities.filter(
    (childEnt) => childEnt !== ent
  );
  const finalEntites = [...finalParentEntities, ...finalChildEntities, ent];
  newDMDSandbox.entity = [...newDMDSandbox.entity, ...finalEntites];
  return newDMDSandbox;
};

export const addEntToSandbox = (sandBox, ent) => {
  const newDMDSandbox = { ...sandBox };
  newDMDSandbox.entity = [...newDMDSandbox.entity, ent];
  return newDMDSandbox;
};

export const addAppToSandbox = (sandBox, app) => {
  const newDMDSandbox = { ...sandBox };
  newDMDSandbox.applicationAreas = [...newDMDSandbox.applicationAreas, app];
  return newDMDSandbox;
};

export const addRelsToSandbox = (sandBox, relation) => {
  const newDMDSandbox = { ...sandBox };
  const newEnt1 = relation.split(":")[0];
  const newEnt2 = relation.split(":")[1].trim();
  newDMDSandbox.entity = [...newDMDSandbox.entity, newEnt1, newEnt2];
  newDMDSandbox.relations = [...newDMDSandbox.relations, relation];
  return newDMDSandbox;
};

export const AddToDMDDiagram = (sandBox, diagData, diagId) => {
  // sandbox into diagData
  if (diagData.length > 0) {
    const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
    if (diagCheck.length > 0) {
      const newDiagCheck = { ...diagCheck[0] };
      const currentData = newDiagCheck.data;
      const currentNodes = currentData.nodes;
      const currentLinks = currentData.links;
      // add application areas
      // add application area relations
      const sandBoxNodes = sandBox.entity;
      const sandBoxLinks = sandBox.relations;
      const finalsandBoxNodes = sandBoxNodes.map((node) => {
        return { name: node };
      });
      const finalsandBoxLinks = sandBoxLinks.map((rln) => {
        const sourceName = rln.split(":")[0];
        const targetName = rln.split(":")[1].trim();
        return { source: { name: sourceName }, target: { name: targetName } };
      });
      const newNodes = [...currentNodes, ...finalsandBoxNodes];
      const newLinks = [...currentLinks, ...finalsandBoxLinks];
      const [finalNodes, finalLinks] = removeDuplicateNodesLinks(
        newNodes,
        newLinks
      );
      const newData = { nodes: finalNodes, links: finalLinks };
      newDiagCheck.data = newData;
      const diagNotCheck = diagData.filter((diag) => diag.diagId !== diagId);
      return [...diagNotCheck, newDiagCheck];
    }
    return diagData;
  } else return diagData;
};

const removeDuplicateNodesLinks = (newNodes, newLinks) => {
  const newNodeNames = [];
  const filteredNodes = newNodes.filter((node) => {
    if (newNodeNames.includes(node.name)) return false;
    newNodeNames.push(node.name);
    return true;
  });
  const newLinkNames = [];
  const filteredLinks = newLinks.filter((link) => {
    const linkname = link.source.name + ":" + link.target.name;
    if (newLinkNames.includes(linkname)) return false;
    newLinkNames.push(linkname);
    return true;
  });
  return [filteredNodes, filteredLinks];
};

export const RemoveEntFromSandbox = (sandBox, ent) => {
  const newDMDSandbox = { ...sandBox };
  const newEntities = sandBox.entity.filter((entity) => ent !== entity);
  newDMDSandbox.entity = [...newEntities];
  return newDMDSandbox;
};

export const RemoveRelFromSandbox = (sandBox, rel) => {
  const newDMDSandbox = { ...sandBox };
  const newRelations = sandBox.relations.filter((rln) => {
    if (rln.trim() === rel.trim()) return false;
    return true;
  });
  newDMDSandbox.relations = newRelations;
  return newDMDSandbox;
};

export const RemoveEntAndDependentsFromSandbox = (sandBox, ent) => {
  const newDMDSandbox = { ...sandBox };
  const newEntities = sandBox.entity.filter((entity) => ent !== entity);
  const newRelations = sandBox.relations.filter((rln) => {
    const sourceName = rln.split(":")[0];
    const targetName = rln.split(":")[1].trim();
    if (sourceName === ent) return false;
    if (targetName === ent) return false;
    return true;
  });
  newDMDSandbox.entity = newEntities;
  newDMDSandbox.relations = newRelations;
  return newDMDSandbox;
};

export const addToApplicationArea = (appArea, appAreaName, entity, entrels) => {
  // filters application area Data by app Area Name
  const currentAppArea = appArea.filter((app) => app.name === appAreaName)[0];
  const otherAppArea = appArea.filter((app) => app.name !== appAreaName);
  const entityPARRels = entrels.filter((ent) => ent.PAR === entity);
  const entityCHLDRels = entrels.filter((ent) => ent.CHLD === entity);
  const appAreaPARRels = [...entityPARRels].map((rel) => {
    return {
      PAR: appAreaName,
      CHLD: rel.CHLD,
      RLNID: appAreaName + ":" + rel.CHLD,
    };
  });
  const appAreaCHLDRels = [...entityCHLDRels].map((rel) => {
    return {
      PAR: rel.PAR,
      CHLD: appAreaName,
      RLNID: rel.PAR + ":" + appAreaName,
    };
  });

  if (currentAppArea.entities)
    currentAppArea.entities = [...currentAppArea.entities, entity];
  else currentAppArea.entities = [entity];

  if (currentAppArea.entityRelations)
    currentAppArea.entityRelations = [
      ...currentAppArea.entityRelations,
      ...entityPARRels,
      ...entityCHLDRels,
    ];
  else currentAppArea.entityRelations = [...entityPARRels, ...entityCHLDRels];

  if (currentAppArea.applicationAreaRelations)
    currentAppArea.applicationAreaRelations = [
      ...currentAppArea.applicationAreaRelations,
      ...appAreaPARRels,
      ...appAreaCHLDRels,
    ];
  else
    currentAppArea.applicationAreaRelations = [
      ...appAreaPARRels,
      ...appAreaCHLDRels,
    ];

  return [...otherAppArea, currentAppArea];
};

export const filterRemoveDMDNodes = (removeDMDNodes, name) => {
  if (removeDMDNodes.length > 0) {
    const RemovedNode = removeDMDNodes.filter((node) => node.name === name)[0];
    const RemovedNodeNames = removeDMDNodes.map((node) => node.name);
    const otherRemoveNodeNames = RemovedNodeNames.filter(
      (node) => node.name !== name
    );
    const RemovedLinks = RemovedNode.links;
    const SourceLinks = RemovedLinks.filter((link) =>
      otherRemoveNodeNames.includes(link.source.name)
    );
    const TargetLinks = RemovedLinks.filter((link) =>
      otherRemoveNodeNames.includes(link.target.name)
    );
    const SourceNames = SourceLinks.map((link) => link.source.name);
    const TargetNames = TargetLinks.map((link) => link.target.name);
    const SourceNodes = removeDMDNodes.map((node) => {
      if (SourceNames.includes(node.name)) {
        const sourceLink = SourceLinks.filter(
          (link) => link.source.name === node.name
        )[0];
        // check if link is already in node links
        node.links = checkNodeLinks(sourceLink, node.links);
      } else if (TargetNames.includes(node.name)) {
        const targetLink = TargetLinks.filter(
          (link) => link.target.name === node.name
        )[0];
        node.links = checkNodeLinks(targetLink, node.links);
      }
      return node;
    });

    // check for Links
    return SourceNodes.filter((node) => node.name !== name);
  }
};

const checkNodeLinks = (selectedlink, links) => {
  // check if selected link is in links already
  // if not add
  const existingLinks = links.filter(
    (link) =>
      link.source.name === selectedlink.source.name &&
      link.target.name === selectedlink.target.name
  );
  if (existingLinks.length > 0) return links;
  else return [...links, selectedlink];
};

export const addToSaveList = (diagData, diagId, payload) => {
  return diagData;
};

export const convertDMDData = (data, diagData, type, zoomLevel) => {
  let dataNames = data;
  if (diagData.length > 0) {
    console.log(diagData);
    const DiagramNames = diagData.map((diag) => diag.name);
    dataNames = data.filter((dat) => !DiagramNames.includes(dat.name));
    console.log(dataNames);
  }

  if (dataNames.length > 0) {
    const finalData = data.map((item) => {
      const newLinks = item.links.map((link) => {
        return {
          source: {
            name: link.SOURCENAME,
            fx: undefined,
            fy: undefined,
            x: parseFloat(link.SOURCEXCOORD),
            y: parseFloat(link.SOURCEYCOORD),
            index: parseInt(link.SOURCEINDEX),
            isCircle: Boolean(parseInt(link.SOURCEISCIRCLE)),
            leftX: parseFloat(link.SOURCELEFTX),
            rectWidth: parseFloat(link.SOURCERECTWIDTH),
            rectX: parseFloat(link.SOURCERECTX),
            rightX: parseFloat(link.SOURCERIGHTX),
            textLength: parseFloat(link.SOURCETEXTLENGTH),
            vx: parseFloat(link.SOURCEVX),
            vy: parseFloat(link.SOURCEVY),
          },
          sourceX: parseFloat(link.SOURCEX),
          sourceY: parseFloat(link.SOURCEY),
          target: {
            name: link.TARGETNAME,
            fx: parseFloat(link.TARGETXCOORD),
            fy: parseFloat(link.TARGETYCOORD),
            x: parseFloat(link.TARGETXCOORD),
            y: parseFloat(link.TARGETYCOORD),
            index: parseInt(link.TARGETINDEX),
            isCircle: Boolean(parseInt(link.TARGETISCIRCLE)),
            leftX: parseFloat(link.TARGETLEFTX),
            rectWidth: parseFloat(link.TARGETRECTWIDTH),
            rectX: parseFloat(link.TARGETRECTX),
            rightX: parseFloat(link.TARGETRIGHTX),
            textLength: parseFloat(link.TARGETTEXTLENGTH),
            vx: parseFloat(link.TARGETVX),
            vy: parseFloat(link.TARGETVY),
          },
          targetX: parseFloat(link.TARGETX),
          targetY: parseFloat(link.TARGETY),
          straight: Boolean(parseInt(link.STRAIGHT)),
        };
      });

      const newNodes = item.nodes.map((node) => {
        return {
          name: node.NAME,
          fx: parseFloat(node.X),
          fy: parseFloat(node.Y),
          x: parseFloat(node.X),
          y: parseFloat(node.Y),
          isCircle: Boolean(parseInt(node.ISCIRCLE)),
          leftX: parseFloat(node.LEFTX),
          rectWidth: parseFloat(node.RECTWIDTH),
          rectX: parseFloat(node.RECTX),
          rightX: parseFloat(node.RIGHTX),
          textLength: parseFloat(node.TEXTLENGTH),
          vx: parseFloat(node.VX),
          vy: parseFloat(node.VY),
        };
      });
      item.links = newLinks;
      item.nodes = newNodes;
      return item;
    });

    let maxDiagId = getMaxDiagId(diagData);

    let newData = diagData;
    console.log(finalData);
    finalData.map((data) => {
      newData = setDMDDiagramData(
        newData,
        maxDiagId,
        { links: data.links, nodes: data.nodes },
        "DMD_CHART",
        0,
        1,
        data.name
      );
      maxDiagId = maxDiagId + 1;
      return data;
    });
    return newData;
  }
  return diagData;
};

const getMaxDiagId = (diagData) => {
  if (diagData.length > 0) {
    let maxDiagId = 0;
    const finalData = diagData.map((data) => {
      if (data.diagId > maxDiagId) maxDiagId = data.diagId;
      return data;
    });
    return maxDiagId;
  } else {
    return 1;
  }
};
