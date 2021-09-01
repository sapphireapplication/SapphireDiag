import API_ADDRESS from "../../server/apiaddress";

export const setEntityData = () => async (dispatch) => {
  console.log("inside action fetch", API_ADDRESS);
  let entities = []
  let entrels = []

  let qurl = `${SERVERADDR}/Entities/${DBNAME}`;
  console.log("QURL===", qurl);
  await fetch(qurl)
    .then((res) => res.json())
    .then((json) => {
      console.log("show data===", json);
      //response = json;
      entities = json.response.entities
      entrels = json.response.entrels

      dispatch({
        type: "FETCH_ENTITIES",
        payload: entities,
        entRelsDMD: entrels,
      });
    });
};
