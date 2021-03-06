const INITIAL_STATE = {
   pgmCodeData : "",
   PrcCallsExplosionData:"",
   rBrowser:"",
  pgmID:"",
  program:"",
  shortNm:"",
}
                   
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "FETCH_SOURCEBROWSER":
        console.log("action in SB reducer===", action);
        return {
          ...state,
          pgmCodeData: action.payload,
          PrcCallsExplosionData:action.PrcCallsExplosionData,
        rBrowser:action.rBrowser,
        pgmID:action.pgmID,
        program:action.program,
        shortNm:action.shortNm
        };
      default:
        return state;
    }
  };
  