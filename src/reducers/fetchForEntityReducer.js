const INITIAL_STATE = {
  forEntity: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_FORENTITY":
      console.log("kya yahan aaya", action.payload);
      return {
        ...state,
        forEntity: action.payload,
      };
    default:
      return state;
  }
};
