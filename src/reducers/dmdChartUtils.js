export const setDMDDiagramData = (
    diagData,
    data,
    type,
    zoomLevel,
    ent,
    DMDEntities
  ) => {
    const diag = {
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
      DMDEntities
    };
  
    /*if (diagData.length > 0) {
      const diagCheck = diagData.filter((diag) => diag.diagId === diagId);
      if (diagCheck.length > 0) {
        return diagData;
      }
  
      const newDiag = [...diagData, diag];
      console.log(newDiag);
      return newDiag;
    }*/
    //console.log('shilpi_dmd diag im dmdchartutils',diag)
    diagData[0] = diag;
    return diagData;
    //return [...diagData, diag];
  };