import API_ADDRESS from "../../server/apiaddress";
export const setDataUsageProgramList = () => async (dispatch) => {
  console.log("inside data usage PGMLIST data action");
  
  let qurl = `${API_ADDRESS}/PgmDefsDU`;
  let response = [];

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show pgmfiledata===", json);
      response = json;
      dispatch({
        type: "FETCH_DATA_USAGE_PROGRAMS",
        payload: response.response,      
      });
    });
};
