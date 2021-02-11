import API_ADDRESS from "../../server/apiaddress";
export const setPgmCalledPgmData = (param) => async (dispatch) => {
  let program = param.find((o) => o.field === "PGMID");
  console.log("inside action pgmcalled=", param, program);

  let response = [];

  let qurl = `${API_ADDRESS}/PgmCalled/${program.value}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_PGMCALLED",
        payload: response.response,
      });
    });
};
