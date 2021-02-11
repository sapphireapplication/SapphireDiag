const INITIAL_STATE = {
  diagType: "",
};

export default (state = INITIAL_STATE, action) => {
  console.log("reducer diagram type==", action.payload);
  switch (action.type) {
    case "SET_DIAGRAM_TYPE":
      return {
        ...state,
        diagType: action.payload,
      };

    default:
      return state;
  }
};
