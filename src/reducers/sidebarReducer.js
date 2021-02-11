const INITIAL_STATE = {
  header: null,
  links: null,
  // dfdlinks: null,
  fixedlinks: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_SIDEBAR_HEADER":
      return {
        ...state,
        header: action.payload,
      };
    case "SET_SIDEBAR_LINKS":
      return {
        ...state,
        links: action.payload,
      };
    // case "SET_SIDEBAR_DFDLINK":
    //   return {
    //     ...state,
    //     dfdlinks: action.payload,
    //   };
    case "SET_SIDEBAR_FIXEDLINK":
      return {
        ...state,
        fixedlinks: action.payload,
      };
    default:
      return state;
  }
};
