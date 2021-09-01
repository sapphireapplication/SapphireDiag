const INITIAL_STATE = {
  dataUsageProgramList: [],
  pgmrels: [],
};

export default (state = INITIAL_STATE, action) => {
  //console.log('shilpi action',action)
  switch (action.type) {
    
    case "FETCH_DATA_USAGE_PROGRAMS":
      return {
        ...state,
        dataUsageProgramList: action.payload,
        pgmrels: action.pgmrels,
        japtxt: action.japtxt
      };
    default:
      return state;
  }
};
