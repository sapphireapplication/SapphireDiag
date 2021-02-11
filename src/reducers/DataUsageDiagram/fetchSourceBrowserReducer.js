const INITIAL_STATE = {
   pgmCodeData : "",
   PrcCallsExplosionData:"",
   rBrowser:"",
  pgmID:"",
  program:"",
}
                   
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "FETCH_SOURCEBROWSER":
        console.log("action in reducer===", action);
        return {
          ...state,
          pgmCodeData: action.payload,
          PrcCallsExplosionData:action.PrcCallsExplosionData,
        rBrowser:action.rBrowser,
        pgmID:action.pgmID,
        program:action.program
        };
      default:
        return state;
    }
  };
  