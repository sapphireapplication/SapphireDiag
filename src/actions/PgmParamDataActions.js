import API_ADDRESS from "../../server/apiaddress";
export const setPgmParamData = (param) => async (dispatch) => {
  //let entity = param.find((o) => o.field === "ENTID");
  let program = param.find((o) => o.field === "PGMID");
  console.log("inside action pgmparam==", param, program);

  let qurl = "";
  let response = [];

  qurl = `${API_ADDRESS}/PgmParam/${program.value}`;

  console.log("qurl==", qurl);
  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data param===", json);
      response = json;

      dispatch({
        type: "FETCH_PGMPARAM",
        payload: response.response,
      });
    });
};
