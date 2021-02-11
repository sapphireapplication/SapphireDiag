const INITIAL_STATE = {
  dataUsageFileList: [],
};

export default (state = INITIAL_STATE, action) => {
 // console.log('shilpi action',action)
  switch (action.type) {
    
    case "FETCH_DATA_USAGE_FILES":
      return {
        ...state,
        dataUsageFileList: action.payload,
      };
    default:
      return state;
  }
};
