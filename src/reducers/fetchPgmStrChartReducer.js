import {
  setDiagramData,
  
} from "./pgmStrChartUtils";

const INITIAL_STATE = {
  diagData: [],
  annotated: false,
  schemaBoxes: [],
  program:""
  
};

export default (state = INITIAL_STATE, action) => {
  if(action.type =="SET_STR_DIAGRAM_DATA" ){
    console.log('shilpi_pgm SET_STR_DIAGRAM_DATA',action)
  }
  switch (action.type) {
    case "SET_STR_DIAGRAM_DATA":
      
      return {
        ...state,
          diagData: setDiagramData(
          state.diagData,
          action.diagId,
          action.payload,
          "PGM_STR_CHART",
          //action.seqId,
          //0.25,
          action.pgm
        ),
        schemaBoxes: [...state.schemaBoxes, ...action.schemaBoxes],
        annotated: true,
        program:action.program
        
      };
    default:
      return state;
  }
};
