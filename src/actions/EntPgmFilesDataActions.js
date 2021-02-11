import API_ADDRESS from "../../server/apiaddress";

export const setEntPgmFilesData = (param) => async (dispatch) => {
  console.log("inside action FETCH_ENTPGMFILE", param);
  let pgmid = param[0].value;
  let response = [];

  let qurl = `${API_ADDRESS}/Pgmfiles/Entities/${pgmid}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_ENTPGMFILE",
        payload: response.response,
      });
    });
};
