const INITIAL_STATE = {
  forProgram: "",
};

export default (state = INITIAL_STATE, action) => {
  console.log("reducer for program==", action.payload);
  switch (action.type) {
    case "FETCH_FORPROGRAM":
      return {
        ...state,
        forProgram: action.payload,
      };
    default:
      return state;
  }
};
