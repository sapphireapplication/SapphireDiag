const INITIAL_STATE = {
  pgmParamDetails: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PGMPARAM":
      return {
        ...state,
        pgmParamDetails: action.payload,
      };
    default:
      return state;
  }
};
