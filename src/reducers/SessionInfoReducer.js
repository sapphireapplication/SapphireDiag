const INITIAL_STATE = {
    sessionInfo: {
        jobNumber: null,
        middlewareRequestTime: null,
        middlewareResponseTime: null,
        timeStored: null,
        totalTime: null
    }
};
  
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_SESSION_INFO': 
            return {
                ...state,
                sessionInfo: action.payload
            }
        default:
            return state;
    }
}