const INITIAL_STATE = {
  pgmCallingParamDetails: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PGMCALLINGPARAMS":
      return {
        ...state,
        pgmCallingParamDetails: action.payload,
      };
    default:
      return state;
  }
};
