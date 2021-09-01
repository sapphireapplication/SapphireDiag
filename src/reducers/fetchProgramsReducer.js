const INITIAL_STATE = {
  programList: [],
  chartArray:[],
  pgmrightrels: [],
};

export default (state = INITIAL_STATE, action) => {
  console.log('shilpi action',action)
  switch (action.type) {
    
    case "FETCH_PROGRAMS":
      return {
        ...state,
        programList: action.payload,
        chartArray: action.chartArray,
        pgmrightrels: action.chartArray2,
      };
    default:
      return state;
  }
};
