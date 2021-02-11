const INITIAL_STATE = {
  entPgmFileDetails: [],
  // ForProgram: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_ENTPGMFILE":
      return {
        ...state,
        entPgmFileDetails: action.payload,
        //ForProgram: action.ForProgram,
      };
    default:
      return state;
  }
};
