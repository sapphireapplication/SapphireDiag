const INITIAL_STATE = {
  DUDProgramData: "",
  program:"",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_DUDPROGRAMDATA":
      return {
        ...state,
        DUDProgramData: action.payload,
        program:action.program,
      };
    default:
      return state;
  }
};
