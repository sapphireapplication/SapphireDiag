import API_ADDRESS from "../../server/apiaddress";
export const setEntRelData = (param) => async (dispatch) => {
  console.log("inside action entrel", param);
  let response = [];
  let entid = param[0].value;
  let qurl = `${API_ADDRESS}/EntRels/${entid}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_ENTREL",
        payload: response.response,
      });
    });
};
