const INITIAL_STATE = {
  pgmCodeDetails: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PGMCODE":
      return {
        ...state,
        pgmCodeDetails: action.payload,
      };
    default:
      return state;
  }
};
