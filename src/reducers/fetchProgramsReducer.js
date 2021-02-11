const INITIAL_STATE = {
  programList: [],
  chartArray:[],
};

export default (state = INITIAL_STATE, action) => {
  console.log('shilpi action',action)
  switch (action.type) {
    
    case "FETCH_PROGRAMS":
      return {
        ...state,
        programList: action.payload,
        chartArray: action.chartArray,
      };
    default:
      return state;
  }
};
