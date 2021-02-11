const INITIAL_STATE = {
  dataUsageProgramList: [],
};

export default (state = INITIAL_STATE, action) => {
  //console.log('shilpi action',action)
  switch (action.type) {
    
    case "FETCH_DATA_USAGE_PROGRAMS":
      return {
        ...state,
        dataUsageProgramList: action.payload,
      };
    default:
      return state;
  }
};
