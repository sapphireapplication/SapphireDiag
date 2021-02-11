const INITIAL_STATE = {
  DUDFileData: "",
  entity:"",
  pgmcodeentity:""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_DUDFILEDATA":
      return {
        ...state,
        DUDFileData: action.payload,
        entity:action.entity,
        pgmcodeentity:action.pgmcodeentity
      };
    default:
      return state;
  }
};
