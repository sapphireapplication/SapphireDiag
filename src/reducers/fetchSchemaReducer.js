const INITIAL_STATE = {
  schemaDetails: [],
  //ForEntityS: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_SCHEMA":
      return {
        ...state,
        schemaDetails: action.payload,
        //ForEntityS: action.ForEntityS,
      };
    default:
      return state;
  }
};
