import API_ADDRESS from "../../server/apiaddress";
export const setPgmSchemaData = (param) => async (dispatch) => {
  let entity = param.find((o) => o.field === "ENTID");
  let program = param.find((o) => o.field === "PGMID");
  console.log("inside action pgmschema==", param, entity, program);

  let qurl = "";
  let response = [];

  if (entity === undefined) qurl = `${API_ADDRESS}/PgmSchema/${DBNAME}/${program.value}`;
  else qurl = `${API_ADDRESS}/PgmSchema/2/${program.value}/${entity.value}`;

  console.log("qurl==", qurl);
  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      response = json;

      dispatch({
        type: "FETCH_PGMSCHEMA",
        payload: response.response,
        // ForProgramS: pgmid,
      });
    });
};
