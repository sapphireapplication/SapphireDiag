const INITIAL_STATE = {
    RESELLERID: '',
    PASSWORD: ''
};
  
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_RESELLERID': {
            return {
                ...state,
               RESELLERID : action.payload
            }
        }
        case 'SET_PASSWORD': {
            return {
                ...state,
               PASSWORD : action.payload
            }
        }
        default:
            return state;
    }
}