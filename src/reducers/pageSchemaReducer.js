const INITIAL_STATE = {
    selectedSchema: null,
    jsonRespData: null,
    selectedPageResp: null,
    dummyState: false
};
  
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'CREATE_FRAME_SCHEMA':
            return {
                ...state,
                selectedSchema: action.payload
            }
        case 'CREATE_PAGE_SCHEMA':
            return {
                ...state,
                selectedSchema: action.payload
            }
        default:
            return state;
    }
}