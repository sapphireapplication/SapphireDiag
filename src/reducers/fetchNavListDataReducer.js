const INITIAL_STATE = {
  NavListData: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_NAVLIST":
      return {
        ...state,
        navListData: action.payload,
      };
    default:
      return state;
  }
};
