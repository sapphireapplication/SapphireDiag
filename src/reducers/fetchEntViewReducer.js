const INITIAL_STATE = {
  entviewDetails: [],
  //ForEntity: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_ENTVIEW":
      return {
        ...state,
        entviewDetails: action.payload,
        //ForEntity: action.ForEntity,
      };
    default:
      return state;
  }
};
