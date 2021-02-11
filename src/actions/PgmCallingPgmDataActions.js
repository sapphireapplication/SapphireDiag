import API_ADDRESS from "../../server/apiaddress";
export const setPgmCallingPgmData = (param) => async (dispatch) => {
  let program = param.find((o) => o.field === "PGMID");
  console.log("inside action pgmcalling=", param, program);

  let response = [];

  let qurl = `${API_ADDRESS}/PgmCalling/${program.value}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_PGMCALLING",
        payload: response.response,
      });
    });
};
