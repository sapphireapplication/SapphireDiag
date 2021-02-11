import API_ADDRESS from "../../server/apiaddress";
export const setSchemaData = (param) => async (dispatch) => {
  console.log("inside action schema");
  let response = [];
  let entid = param[0].value;
  let qurl = `${API_ADDRESS}/EntSchema/${entid}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_SCHEMA",
        payload: response.response,
      });
    });
};
