
//import {getPgmStructureChartData} from "./Diagrams/Index";
import {buildEntData} from "./EntRelDiagrams/index.js";
import API_ADDRESS from "../../../server/apiaddress";

export const setDMDChart = (param) => async (dispatch, getState) => {
  //console.log("dmd param in Data Model==", param);
  //let entity = param.find((o) => o.field === "ENTID");
 // console.log('dmd action entity',entity)
 console.log('check_param',param);
  var state = getState();
  var entid = param.value.trim()
  const payload = buildEntData(entid,state.fetchentitiesReducer.entRelsDMD);
  console.log('dmd payload',payload)

  const entids = payload.nodes.map(node => node.name)
  const entIdsQuery = `"${entids.join('","')}"`;
  const qurl = `${API_ADDRESS}/entsch/${entIdsQuery}`;
  let entities = []
  
  await fetch(qurl)
    .then(res => res.json())
    .then(json => {
      entities = json.response.entities;
      dispatch({
    type: "SET_DMD_DIAGRAM",
    graph: payload,
    ent:   entid,
    entity: param,
    DMDEntities: entities,
  });
    })

  /*dispatch({
    type: "SET_DMD_DIAGRAM",
    graph: payload,
    ent:   entid,
    entity: param,
    DMDEntities: entities,
  });*/
  
}