import {
  setDMDDiagramData,
  
} from "./dmdChartUtils";

const INITIAL_STATE = {
  diagData: [],
  entity:"",
};

export default (state = INITIAL_STATE, action) => {
  if(action.type =="SET_DMD_DIAGRAM" ){
    console.log(' SET_DMD_DIAGRAM',action)
  }
  switch (action.type) {
    case "SET_DMD_DIAGRAM":
      return {
        ...state,
        diagData: setDMDDiagramData(
          state.diagData,
          action.graph,
          "DMD_CHART",
          1,  //zoomlevel
          action.ent,
          action.DMDEntities,
          action.DMDEntjrules,
          action.nodePosition,
          action.drawPlistTable,
        ),
        entity:action.entity
      };
    default:
      return state;
  }
};
