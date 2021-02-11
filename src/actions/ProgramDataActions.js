import API_ADDRESS from "../../server/apiaddress";
export const setProgramData = () => async (dispatch) => {
//  console.log("inside pragram data action", param);
  let programs = []
  let pgmrels = [] 
  
  //let entid = param === "" ? "0" : param[0].value;
  //let qurl = `${API_ADDRESS}/Pgmfiles/${entid}`;
  let qurl = `${API_ADDRESS}/PgmDefs`;

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      //response = json;
      programs = json.response.programs
      pgmrels = json.response.chartArray

      dispatch({
        type: "FETCH_PROGRAMS",
        payload: programs,
        chartArray: pgmrels,
      });
    });
};
