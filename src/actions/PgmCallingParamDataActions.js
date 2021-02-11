import API_ADDRESS from "../../server/apiaddress";
export const setPgmCallingParamData = (param) => async (dispatch) => {
  let program = param.find((o) => o.field === "PGMID");
  let cldprogram = param.find((o) => o.field === "CLDPGM");
  console.log("inside action pgmcallingparams==", param, cldprogram, program);

  let qurl = "";
  let response = [];

  qurl = `${API_ADDRESS}/PgmCallingParams/${program.value}/${cldprogram.value}`;

  console.log("qurl==", qurl);
  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_PGMCALLINGPARAMS",
        payload: response.response,
      });
    });
};
