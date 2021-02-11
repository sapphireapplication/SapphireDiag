import API_ADDRESS from "../../server/apiaddress";
export const setPgmCodeData = (param) => async (dispatch) => {
  let entity = param.find((o) => o.field === "ENTID");
  let program = param.find((o) => o.field === "PGMID");
  let shortnm = param.find((o) => o.field === "SHORTNM");
  console.log("inside action pgmcode==", shortnm, entity, program);

  let qurl = "";
  let response = [];

  qurl = `${API_ADDRESS}/PgmCode/${entity.value}/${program.value}/${shortnm.value}`;

  console.log("qurl==", qurl);
  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show pgmcode===", json);
      response = json;

      dispatch({
        type: "FETCH_PGMCODE",
        payload: response.response,
      });
    });
};
