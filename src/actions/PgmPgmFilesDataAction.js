import API_ADDRESS from "../../server/apiaddress";
export const setPgmPgmFilesData = (param) => async (dispatch) => {
  console.log("inside pragram program files data action", param);
  let response = [];
  let entid = param[0].value;
  let qurl = `${API_ADDRESS}/Pgmfiles/${entid}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_PGMPGMFILES",
        payload: response.response,
      });
    });
};
