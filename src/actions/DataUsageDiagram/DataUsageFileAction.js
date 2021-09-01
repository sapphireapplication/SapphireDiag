

import API_ADDRESS from "../../../server/apiaddress";
import { setForEntity } from "../setForEntity";

/*export const setDataUsageFile = (entity) => async (dispatch, res) => {
 
  console.log("what is in entity==", entity)
  if (entity.value==""){
    dispatch({
      type: "FETCH_DUDFILEDATA",
      payload: "",
      entity:"",
      pgmcodeentity:""
    });
  }
  else {

 let qurl = "";
  let programs = [];
  let pgmschema = [];
  let pgmcode = [];
  let entschema = [];
  let DFData = { ID: entity.value, TEXT: entity.text};
  if (entity.value=="default")
  {
    var child = [];
    DFData["children"] = child;
      console.log("DFData=====", DFData);
      dispatch({
        type: "FETCH_DUDFILEDATA",
        payload: DFData,
        entity:entity,
        pgmcodeentity:""
      });

  }
else{
   
  qurl = `${SERVERADDR}/DataUsageDiagram/File/${DBNAME}/${entity.value}`;

  await fetch(qurl) 
    .then((res) => res.json())
    .then(async (json) => {
      console.log("show program files in datausage action===", json);
      programs = json.response.programs;
      pgmschema = json.response.pgmschema;
      pgmcode = json.response.pgmcode;
      entschema = json.response.entschema;

      let entobj = {
        PGMID: entity.value,
        PGMTX: entity.text
      }
      let numRed=0;
      let numPgm = programs.length;
      let index;
      console.log('numPgm',numPgm)

      //even numPgm case
      if(numPgm % 2 == 0){
        index = parseInt((numPgm + 1)/2)
        programs.splice(index, 0, entobj)
      }
      //odd case
      if(numPgm % 2 != 0){
        index = parseInt((numPgm + 1)/2) -1
        programs.splice(index, 0, entobj)
      }
      
     

      ////////////make DFD data now/////////
      var child = [];
      var pgmtx;
      programs.map((program) => {
        if (program.PGMID.trim() !== null) {
          let schmaData;
          if(program.PGMID.trim() == entity.value){
            schmaData = entschema
          }
          else{
            
            schmaData = pgmschema.filter(
              (pschema) => pschema.PGMID === program.PGMID.trim())
          }
          console.log('program now',program)
          if(program.PGMTX != null)
          pgmtx = program.PGMTX.trim()
          else
          pgmtx = program.PGMTX;
          let pgmitem = {
            HEADID: program.PGMID.trim(),
            HEADTEXT: pgmtx, //program.PGMTX.trim(),
            ID: "Program",
            TEXT: "Program",
            WHFUSG: program.WHFUSG,
            children:[
          
           {
            HEADID: program.PGMID.trim(),
            HEADTEXT: pgmtx, //program.PGMTX.trim(),
            ID: "Schema",
            TEXT: "Schema",
            SCHMADATA: schmaData,
            CODEDATA: pgmcode.filter((pcode) => pcode.PGMID === program.PGMID.trim()),
            children: [
              {
                HEADID: "id",
                HEADTEXT: "text",
                ID: "CODE",
                TEXT: "CODE",
                DATA: pgmcode.filter((pcode) => pcode.PGMID === program.PGMID.trim()),
              },
            ],
          },
        ],}
          child.push(pgmitem);
        }
      });
      DFData["children"] = child;
      console.log("DFData=====", DFData);
      dispatch({
        type: "FETCH_DUDFILEDATA",
        payload: DFData,
        entity:entity,
        pgmcodeentity:pgmcode
      });
    });
  }/////end of else
}
}; */

export const setDataUsageFile = (entity) => async (dispatch, res) => {
 
  console.log("what is in entity==", entity)
  if (entity.value==""){
    dispatch({
      type: "FETCH_DUDFILEDATA",
      payload: "",
      entity:"",
      pgmcodeentity:""
    });
  }
  else {

 let qurl = "";
  let programs = [];
  let pgmschema = [];
  let pgmcode = [];
  let bruledata = [];
  let bruleend = [];
  let entschema = [];
  let DFData = { ID: entity.value, TEXT: entity.text,BRULE:''};
  if (entity.value=="default")
  {
    var child = [];
    DFData["children"] = child;
      console.log("DFData=====", DFData);
      dispatch({
        type: "FETCH_DUDFILEDATA",
        payload: DFData,
        entity:entity,
        pgmcodeentity:""
      });

  }
else{
   
      qurl = `${SERVERADDR}/DataUsageDiagram/File/${DBNAME}/${encodeURIComponent(
        entity.value
      )}`;
  await fetch(qurl) 
    .then((res) => res.json())
    .then(async (json) => {
      console.log("show program files in datausage action===", json);
      programs = json.response.programs;
      pgmschema = json.response.pgmschema;
      pgmcode = json.response.pgmcode;
      entschema = json.response.entschema;
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

      let entobj = {
        PGMID: entity.value,
        PGMTX: entity.text
      }
      let numRed=0;
      let numPgm = programs.length;
      let index;
      console.log('numPgm',numPgm)

      //even numPgm case
      if(numPgm % 2 == 0){
        index = parseInt((numPgm + 1)/2)
        programs.splice(index, 0, entobj)
      }
      //odd case
      if(numPgm % 2 != 0){
        index = parseInt((numPgm + 1)/2) -1
        programs.splice(index, 0, entobj)
      }
      
     

      ////////////make DFD data now/////////
      var child = [];
      var pgmtx;
      programs.map((program) => {
        if (program.PGMID.trim() !== null) {
          let schmaData;
          if(program.PGMID.trim() == entity.value){
            schmaData = entschema
          }
          else{
            
            schmaData = pgmschema.filter(
              (pschema) => pschema.PGMID === program.PGMID.trim())
          }
          //console.log('program now',program)
          if(program.PGMTX != null)
          pgmtx = program.PGMTX.trim()
          else
          pgmtx = program.PGMTX;
          let pgmitem = {
            HEADID: program.PGMID.trim(),
            HEADTEXT: pgmtx, //program.PGMTX.trim(),
            ID: "Program",
            TEXT: "Program",
            WHFUSG: program.WHFUSG,
            children:[
          
           {
            HEADID: program.PGMID.trim(),
            HEADTEXT: pgmtx, //program.PGMTX.trim(),
            ID: "Schema",
            TEXT: "Schema",
            SCHMADATA: schmaData,
            BRULEDATA: bruledata.filter(
              (bdata) => bdata.PGMID.trim() === program.PGMID.trim()
            ),
            
            //CODEDATA: pgmcode.filter((pcode) => pcode.PGMID === program.PGMID.trim()),
            CODEDATA: pgmcode,
             
            children: [
              {
                HEADID: "id",
                HEADTEXT: "text",
                ID: "CODE",
                TEXT: "CODE",
                //DATA: pgmcode.filter((pcode) => pcode.PGMID === schmaData.PGMNM.trim()),
                DATA: pgmcode,
                 
                /*SA_CH start */
                children: [
                  {
                    HEADID: "id1",
                    HEADTEXT: "text1",
                    ID: "SRCB",
                    TEXT: "SRCB",
                    DATA: [],
                    /*SA_CH start */
                  },
                ],
              },
            ],
          },
        ],}
          child.push(pgmitem);
        }
      });
      DFData["children"] = child;
      console.log("DFData=====", DFData);
      dispatch({
        type: "FETCH_DUDFILEDATA",
        payload: DFData,
        entity:entity,
        pgmcodeentity:pgmcode
      });
    });
  }/////end of else
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
