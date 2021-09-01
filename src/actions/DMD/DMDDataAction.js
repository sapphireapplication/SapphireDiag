
//import {getPgmStructureChartData} from "./Diagrams/Index";
import {buildEntData} from "./EntRelDiagrams/index.js";
import API_ADDRESS from "../../../server/apiaddress";
import { buildChart } from "./EntRelDiagrams/EntRelDiag.js";

export const setDMDChart = (param) => async (dispatch, getState) => {
  //console.log("dmd param in Data Model==", param);
  //let entity = param.find((o) => o.field === "ENTID");
 // console.log('dmd action entity',entity)
 console.log('check_param',param);
  var state = getState();
  var entid = param.value.trim()
  let payload 
  let drawPlistTable = true
  payload = await buildChart(entid);
  
  if(!payload.nodes) {
    console.log("above compare",entid, state.fetchentitiesReducer.entRelsDMD);
    payload = buildEntData(entid,state.fetchentitiesReducer.entRelsDMD);
    drawPlistTable = false
  }
  console.log('compare1','FETCH_ENTITIES',payload)
  console.log('compare2',payload)

  const entids = payload.nodes.map(node => node.name)
  // const entids2 = payload2.nodes.map(node => node.name)
  const diagID = payload.relation.mainEntity;  
  //const entIdsQuery = `"${entids.join('","')}"`;
  const entIdsQuery = JSON.stringify(entids);
  const qurl = `${SERVERADDR}/entsch/${entIdsQuery}/${DBNAME}`;
  
  const query = `${SERVERADDR}/Entjrules/${DBNAME}`;
  const posQuery = `${SERVERADDR}/EntPos/${DBNAME}/${diagID}`

    
  const fetchEntities =  fetch(qurl).then(res => res.json()).then(json => json.response.entities)
  const fetchEntjrules = fetch(query).then(res => res.json()).then(json => json.response.entjrules)
  const fetchPos = fetch(posQuery).then(res => res.json()).then(json => json.response.result)

  const entities = await fetchEntities
  const entjrules = await fetchEntjrules
  const nodePosition = await fetchPos

  // var nodePosition = []


  
      dispatch({
    type: "SET_DMD_DIAGRAM",
    graph: payload,
    ent:   entid,
    entity: param,
    DMDEntities: entities,
    DMDEntjrules: entjrules,
    nodePosition,
    drawPlistTable
  });

  /*dispatch({
    type: "SET_DMD_DIAGRAM",
    graph: payload,
    ent:   entid,
    entity: param,
    DMDEntities: entities,
  });*/
  
}