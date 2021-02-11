const INITIAL_STATE = {
  pgmCalledDetails: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PGMCALLED":
      return {
        ...state,
        pgmCalledDetails: action.payload,
      };
    default:
      return state;
  }
};
