

import API_ADDRESS from "../../../server/apiaddress";
import { setForEntity } from "../setForEntity";

export const setDataUsageFile = (entity,props) => async (dispatch, res) => {
 
  console.log("what is in entity==", entity,props)
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
  qurl = `${API_ADDRESS}/DataUsageDiagram/File/${entity.value}`;

  await fetch(qurl) 
    .then((res) => res.json())
    .then(async (json) => {
      console.log("show program files in datausage action===", json);
      programs = json.response.programs;
      pgmschema = json.response.pgmschema;
      pgmcode = json.response.pgmcode;
      entschema = json.response.entschema;

      /////// modify list of programs to accomodate entity at 3rd position
      let entobj = {
        PGMID: entity.value,
        PGMTX: entity.text
      }
      let numRed=0;
      let numPgm = programs.length;
      let index;
      console.log('numPgm',numPgm)
      
      /* calculating index at which entschema of selected entity is to be added in list of programs */
      /////////////////////////  start ///////////////////////////////////////////////////////////////
      programs.map((pgm,idx)=>{
        if(pgm.WHFUSG >=4){
          numRed++;
        }
      })
      console.log('shilpi numRed',numRed)
      if(numRed <=7){
        index = numRed
        //programs.splice(numRed, 0, entobj)
      }
      if(numRed > 7){
        /* add entity at 8th position */
        console.log('numred > 7')
        index = 7
        //programs.splice(7, 0, entobj)
      }
      if(numRed == 0){
        if(numPgm <=14){
          index = parseInt(numPgm / 2);
        }
        else{
          index = 7;
        }
      }
      console.log('check file list', props)
      console.log('check name',entity.value.trim())
      let fileIndex = props.dataUsageFileList.findIndex(filenm => filenm.ENTID.trim() === entity.value.trim());
      console.log('shilpi fileIndex', fileIndex)
      console.log('shilpi index',index)
      if(fileIndex != -1 && fileIndex < index){
        index = fileIndex
      }
    
      // hack to put entity at top pos
     // index = 0;
      programs.splice(index, 0, entobj)
      
      /*if(programs.length == 1){
        index = 1;
      }
      
      else{
        index = 2;
      }
      programs.splice(index, 0, entobj);*/

      ////////////make DFD data now/////////
      var child = [];
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
          let pgmitem = {
            HEADID: program.PGMID.trim(),
            HEADTEXT: program.PGMTX.trim(),
            ID: "Program",
            TEXT: "Program",
            WHFUSG: program.WHFUSG,
            children:[
          
           {
            HEADID: program.PGMID.trim(),
            HEADTEXT: program.PGMTX.trim(),
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
}; 


