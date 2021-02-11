const INITIAL_STATE = {
  pgmPgmFileDetails: [],
  // ForProgram: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PGMPGMFILES":
      return {
        ...state,
        pgmPgmFileDetails: action.payload,
        //ForProgram: action.ForProgram,
      };
    default:
      return state;
  }
};
