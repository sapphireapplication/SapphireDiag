const INITIAL_STATE = {
  pgmCallingDetails: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PGMCALLING":
      return {
        ...state,
        pgmCallingDetails: action.payload,
      };
    default:
      return state;
  }
};
