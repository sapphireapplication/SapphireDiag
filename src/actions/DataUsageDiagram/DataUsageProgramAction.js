

import API_ADDRESS from "../../../server/apiaddress";

export const setDataUsageProgram = (program) => async (dispatch, res) => {
  console.log("param in DFD==", program);
  
  if (program.value==""){
    dispatch({
      type: "FETCH_DUDPROGRAMDATA",
      payload: "",
      program:""
    });
  }
  
else {


  let qurl = "";
  //let files = {};
  let entities = [];
  let entschema = [];
  let pgmcode = [];
  let DFData = { ID: program.value, TEXT: program.text};
 
  if (program.value=="default")
  {
    var child = [];
    DFData["children"] = child;
      console.log("DFData=====", DFData);
      dispatch({
        type: "FETCH_DUDPROGRAMDATA",
        payload: DFData,
        program:program
      });

  }
  else
{
  qurl = `${API_ADDRESS}/DataUsageDiagram/Program/${program.value}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then(async (json) => {
      console.log("show entities files===", json);
      entities = json.response.entities;
      entschema = json.response.entschema;
      pgmcode = json.response.pgmcode;

      ////////////make DFD data now/////////
      var child = [];

      entities.map((entity) => {
        if (entity.ENTID !== null) {
          let entitem = {
            HEADID: entity.ENTID,
            HEADTEXT: entity.ENTTX,
            ID: "Entity",
            TEXT:"Entity",
            WHFUSG: entity.WHFUSG,
            children:[
          
           {
            HEADID: entity.ENTID,
            HEADTEXT: entity.ENTTX,
            ID: "Schema",
            TEXT: "Schema",
            SCHMADATA: entschema.filter(
              (eschema) => eschema.ENTID === entity.ENTID
            ),
            CODEDATA: pgmcode.filter((pcode) => pcode.FILENM === entity.ENTID),
            children: [
              {
                HEADID: "id",
                HEADTEXT: "text",
                ID: "CODE",
                TEXT: "CODE",
                DATA: pgmcode.filter((pcode) => pcode.FILENM === entity.ENTID),
              },
            ],
          },
        ],}
          child.push(entitem);
        }
      });
      DFData["children"] = child;
      console.log("DFData=====", DFData);
      dispatch({
        type: "FETCH_DUDPROGRAMDATA",
        payload: DFData,
        program:program
      });
    });
  }///else
}




};
 