

import API_ADDRESS from "../../../server/apiaddress";
import {setSourceBrowser} from "../../actions/DataUsageDiagram/SourceBrowserAction";

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
  let bruledata = [];
  let bruleend = [];
  let DFData = { ID: program.value, TEXT: program.text, BRULE:''};
 
 
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
  qurl = `${SERVERADDR}/DataUsageDiagram/Program/${DBNAME}/${program.value}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then(async (json) => {
      console.log("show entities files===", json);
      entities = json.response.entities;
      entschema = json.response.entschema;
      pgmcode = json.response.pgmcode;
      bruledata = json.response.bruledata;
      bruleend = json.response.bruleend;
      bruledata.map((brdata) => {
        brdata.ID = brdata.ID.replace(/^0+/, '');  //remove leading 0's
        brdata.ID = brdata.ID.replace(/0+$/,'') //remove trailing 0's
        brdata.ID = removeConsecutiveDuplicates(brdata.ID)
        brdata.ID = brdata.ID.replace(/0/g,'.')
         
      })
      bruleend.map((brdata) => {
        brdata.ID = brdata.ID.replace(/^0+/, '');  //remove leading 0's
        brdata.ID = brdata.ID.replace(/0+$/,'') //remove trailing 0's
      brdata.ID = removeConsecutiveDuplicates(brdata.ID)
      brdata.ID = brdata.ID.replace(/0/g,'.')
         
      })
      DFData['BRULE'] = bruleend

      if(json.error == true){
        alert("No files associated with this program")
        return;
      }

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
            BRULEDATA: bruledata.filter(
              (bdata) => bdata.FILENM.trim() === entity.ENTID
            ),
            CODEDATA: pgmcode.filter((pcode) => pcode.FILENM.trim() === entity.ENTID),
            children: [
              {
                HEADID: "id",
                HEADTEXT: "text",
                ID: "CODE",
                TEXT: "CODE",
                DATA: pgmcode.filter((pcode) => pcode.FILENM.trim() === entity.ENTID),
                children: [
                  {
                    HEADID: "id1",
                    HEADTEXT: "text1",
                    ID: "SRCB",
                    TEXT: "SRCB",
                    DATA: [],
                  },
                ],
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
 
  //setSBData(program)

  //sample code 
  
  /*qurl = `${SERVERADDR}/SBData/${DBNAME}/${program.value}`;
  let prcdata = [];
  await fetch(qurl)
    .then((res) => res.json())
    .then(async (json) => {
      console.log("show entities files===", json);
      prcdata = json.response.prcdata;
      dispatch({
        type: "FETCH_SBDATA",
        payload: prcdata,
      });
    })  */ 
}
};

function removeConsecutiveDuplicates(input)
{
    if(input.length<=1)
            return input;
        if(input[0]==input[1])
            return removeConsecutiveDuplicates(input.substring(1));
        else
            return input[0] +
            removeConsecutiveDuplicates(input.substring(1));
}
 