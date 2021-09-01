const INITIAL_STATE = {
  dataUsageFileList: [],
  entrels:[],
};

export default (state = INITIAL_STATE, action) => {
 // console.log('shilpi action',action)
  switch (action.type) {
    
    case "FETCH_DATA_USAGE_FILES":
      return {
        ...state,
        dataUsageFileList: action.payload,
        entrels: action.entrels
      };
    default:
      return state;
  }
};
