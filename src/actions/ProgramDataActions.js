import API_ADDRESS from "../../server/apiaddress";
export const setProgramData = () => async (dispatch) => {
//  console.log("inside pragram data action", param);
  let programs = []
  let pgmrels = [] 
  let pgmrightrels = [];
  
  //let entid = param === "" ? "0" : param[0].value;
  //let qurl = `${API_ADDRESS}/Pgmfiles/${entid}`;
  let qurl = `${SERVERADDR}/PgmDefs/${DBNAME}`;
console.log('shi_db',`${DBNAME}`)
  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      //response = json;
      programs = json.response.programs
      pgmrels = json.response.chartArray
      pgmrightrels = json.response.chartArrayWithoutD;

      dispatch({
        type: "FETCH_PROGRAMS",
        payload: programs,
        chartArray: pgmrels,
        chartArray2: pgmrightrels,
      });
    });
};
