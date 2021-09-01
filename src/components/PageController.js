import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import PageRenderer from "./PageRenderer";

import { setProgramData } from "../actions/ProgramDataActions";
import { setDataUsageProgram } from "../actions/DataUsageDiagram/DataUsageProgramAction";
import {setDataUsageFile} from "../actions/DataUsageDiagram/DataUsageFileAction";
import { setProgramStructureChart } from "../actions/ProgramStructureChart/ProgramStrucDataAction.js";
import { setDiagramType } from "../actions/setDiagramType";
import { setDataUsageProgramList} from "../actions/setDataUsageProgramActions";
import { setDataUsageFileList} from "../actions/setDataUsageFileActions";
import {setSourceBrowser} from "../actions/DataUsageDiagram/SourceBrowserAction";
import {setMainWindowState} from "../actions/setMainWindowAction";
import { setDMDChart} from "../actions/DMD/DMDDataAction.js";
import { setEntityData } from "../actions/EntityDataActions";

//import { setForProgram } from "../actions/setForProgram";
const mapStateToProps = (state) => {
  return {
    //Programstructiure chart
    //pgmrightrels: state.fetchProgramsReducer.pgmrightrels,
    //PgmStrData: state.fetchPgmStrChartReducer,
    //programList: state.fetchProgramsReducer.programList,
    //Data usage Program
    //dataUsageProgramList: state.fetchDataUsageProgramsReducer.dataUsageProgramList,
   
    diagramType: state.fetchDiagramTypeReducer.diagType,
    
    //DUDProgramData: state.fetchDUDProgramReducer,
    
    //DMD
    //entityList: state.fetchentitiesReducer.entityList,
    //entRelsDMD: state.fetchentitiesReducer.entRelsDMD,
    //DMDModelData: state.fetchDMDModelReducer,
    //sourceBrowserData : state.fetchSourceBrowserReducer,
    mainWindowState : state.fetchMainWindowStateReducer.mainWindowState,

  };
};

function PageController(props) {
  /* To fill in the params to form req/resp accordingly */
    console.log('in pagecontroller')
  const [load, setLoad] = useState("0");
  //const [sideTab, setsideTab] = React.useState("Entities");
   
  /* Invoke startup action to read initial page response from server */
  
  /*useEffect(() => {
    console.log('useeffect click')
    if(window.location.href == 'http://localhost:8080/dudfile')

  linkClickHandler('DATAUSAGEFILE',{field:"",
   value:"",
   text:"",
   });
  });*/

  /* Link click event handler to simulate page navigation */

  function linkClickHandler(id, param2) {
    console.log("in link event handler", id, param2);
    /* on click programs-  id-PgmList  param2 BC-Program Details lable- LeftBar*/
    switch (id) {

        case "PGMSCHART":  //PGM STRUCTURE CHART
        console.log("yahan aaya");
        
        props.setProgramData()
          .then((json) => 
            props.setSourceBrowser({field:"", value:"", text:"", shortnm:""})
            .then((json)=>
            props.setDataUsageProgram({field:"", value:"", text:""})
            .then((json)=>
            props.setMainWindowState(id)
                  .then (json=>
            {
              if (param2.value != '') {
                props
                  .setProgramStructureChart(param2)
                  .then((json)=>
                  
                  setLoad(id))
              }
              else setLoad(id)
           }
             ) )));
          
          break;
        case "DMD" : 
      console.log("in dmd");
     
        
         props.setEntityData()
          .then((json) => 
            props.setSourceBrowser({field:"", value:"", text:"", shortnm:""})
            .then((json)=>
            props.setDataUsageProgram({field:"", value:"", text:""})
            .then((json)=>
            props.setMainWindowState(id)
                  .then (json=>
            {
              if (param2.value != '') {
                props
                  .setDMDChart(param2)
                  .then((json)=>
                  
                  setLoad(id))
              }
              else setLoad(id)
           }
             ) )));
           
           
           
      break;
      
      case "DATAUSAGE":  //Data Usage Program
     
      setLoad(id)
      
          break;

      case "DATAUSAGEFILE":   //Data Usage File
      props.setDiagramType("DATA_USAGE_FILE")
        
      .then((json) =>
      
       /* props.setDataUsageFileList()
        .then((json)=>
            props.setDataUsageFile({value:"default", text:""},props)
               .then((json) =>
               props.setSourceBrowser({field: "PGMID",
               text: "",
               value: "",
               shortnm:""})
               .then((json) => 
               props.setMainWindowState("DATAUSAGEFILE")
                 .then (json=>
                   setLoad(id)
      )) )));*/

      props.setMainWindowState("DATAUSAGEFILE")
                 .then (json=>
                   setLoad(id)))
        
            break;

      case "PGMSC_DU":  //Data Usage
      console.log("inside PGMSCDU");

           props.setSourceBrowser({field:"", value:"", text:"", shortnm:""})
           .then(()=>
            props.setDiagramType("DATA_USAGE_PGM")
          
              .then((json) =>
              props.setMainWindowState(id)
                
                .then((json)=>
                    props.setDataUsageProgram(param2)
                        .then((json) =>
                        props.setDataUsageProgramList()
             .then (json=>{console.log("hello")
                        setLoad("PGMSC_DU")}
              )
              )
               ) )
              );
          break;
       case "PGMSC_DU_FILE":
        console.log('param2',param2)
        props.setDiagramType("DATA_USAGE_FILE")
        
        
        .then((json) =>
        
          props.setDataUsageFileList()
          .then((json)=>
              props.setDataUsageFile(param2,props)
                 .then((json) =>
                 props.setSourceBrowser({field: "PGMID",
                 text: "",
                 value: "",
                 shortnm:""})
                 .then((json) => 
                 props.setMainWindowState(id)
                   .then (json=>
                     setLoad(id)
        )) )));

      default:
        //console.log("hit default link");
        setLoad("0");
        break;
    }
  }
  return (
    <PageRenderer
      //buttonClickHandler={buttonClickHandler}
      linkClickHandler={linkClickHandler}
      screenId={load}
      {...props}
    />
  );
}

//export default connect(mapStateToProps, mapDispatchToProps)(PageController);
export default connect(mapStateToProps, {
  // setProgramData,
  //setProgramStructureChart,
  //setDataUsageProgramList,
  //setDataUsageProgram,
  //setDataUsageFileList,
  //setDataUsageFile,
  setDiagramType,
 // setSourceBrowser,
  setMainWindowState,
  setEntityData,
  setDMDChart,
  
})(PageController);
