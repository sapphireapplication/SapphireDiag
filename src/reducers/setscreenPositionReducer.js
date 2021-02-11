const INITIAL_STATE = {
  screenDetails: [],
  leftpaneDetails: [],
  //ForEntityS: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_BASE_TEMPLATE":
      return {
        ...state,
        screenDetails: action.payload,
      };
    case "SET_LEFT_PANE":
      return {
        ...state,
        leftpaneDetails: action.payload,
      };
    default:
      return state;
  }
};
