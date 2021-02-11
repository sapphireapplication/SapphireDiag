const INITIAL_STATE = {
  entityList: [],
  entRelsDMD: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_ENTITIES":
      return {
        ...state,
        entityList: action.payload,
        entRelsDMD: action.entRelsDMD,
      };
    default:
      return state;
  }
};
