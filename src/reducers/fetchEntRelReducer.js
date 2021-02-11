const INITIAL_STATE = {
  entrelDetails: [],
  //ForEntity: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_ENTREL":
      return {
        ...state,
        entrelDetails: action.payload,
      };
    default:
      return state;
  }
};
