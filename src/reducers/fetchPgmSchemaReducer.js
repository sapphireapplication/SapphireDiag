const INITIAL_STATE = {
  pgmSchemaDetails: [],
  //ForProgramS: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PGMSCHEMA":
      return {
        ...state,
        pgmSchemaDetails: action.payload,
        //ForProgramS: action.ForProgramS,
      };
    default:
      return state;
  }
};
