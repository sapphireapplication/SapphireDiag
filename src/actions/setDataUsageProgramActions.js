import API_ADDRESS from "../../server/apiaddress";
export const setDataUsageProgramList = () => async (dispatch) => {
  console.log("inside data usage PGMLIST data action");
  
  let qurl = `${SERVERADDR}/PgmDefsDU/${DBNAME}`;
 

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show pgmfiledata===", json);
      
      dispatch({
        type: "FETCH_DATA_USAGE_PROGRAMS",
        payload: json.response.programs,
        pgmrels: json.response.pgmrels,  
        japtxt: json.response.japtxt     
      });
    });
};
