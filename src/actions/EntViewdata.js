import API_ADDRESS from "../../server/apiaddress";
export const setEntViewData = (param) => async (dispatch) => {
  console.log("inside action fetch", param);
  let response = [];
  let entid = param[0].value;
  let qurl = `${API_ADDRESS}/Entview/${entid}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_ENTVIEW",
        payload: response.response,
      });
    });
};
