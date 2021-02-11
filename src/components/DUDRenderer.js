import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import DataUsageDiagram from "./DataUsageDiagram/DataUsageDiagram";
import DataUsageDiagramFile from "./DataUsageDiagram/DataUsageDiagramFile";
import CodeEditor from "./DataUsageDiagram/CodeEditor";
//import DataFlowDiagram from "./DataUsageDiagram/DataFlowDiagram";
import PgmStruChart from "./PgmStruChart/PgmStruChart";
import DMDChart from "./DMDChart";

//import { setNavListData } from "../actions/setNavListDataActions";
import {setSourceBrowser} from "../actions/DataUsageDiagram/SourceBrowserAction";
//import { setForProgram } from "../actions/setForProgram";
//import { fetchBaseTemplate } from "../actions/setscreenPositionAction";
import { setDataUsageProgramList} from "../actions/setDataUsageProgramActions";
import { setDataUsageProgram } from "../actions/DataUsageDiagram/DataUsageProgramAction";
import { setDataUsageFileList} from "../actions/setDataUsageFileActions";
import { setDataUsageFile } from "../actions/DataUsageDiagram/DataUsageFileAction";
import { setDiagramType } from "../actions/setDiagramType";




const mapStateToProps = (state) => {
    return {
      sourceBrowserData : state.fetchSourceBrowserReducer,
      DUDProgramData: state.fetchDUDProgramReducer,
      dataUsageProgramList: state.fetchDataUsageProgramsReducer.dataUsageProgramList,
      dataUsageFileList: state.fetchDataUsageFilesReducer.dataUsageFileList,
      DUDFileData: state.fetchDUDFileReducer,
      diagramType: state.fetchDiagramTypeReducer.diagType,
    
    };
  };


function DUDRenderer(props) {
  
  const [LoadDUDScreen, setLoadDUDScreen] = useState("pgmdataUsage");
  
  
  console.log("inside DUDrenderer ===", props, LoadDUDScreen, props.screenId);
  function DUDCloseHandler() {
    console.log("whats in LoadScreen", LoadScreen);
    
     document.getElementById("2").style.display="none";
     document.getElementById("1").style.display="block";
    
  }
  function SBCloseHandler() {
    
     document.getElementById("3").style.display="none";
     document.getElementById("2").style.display="block";
    
    
  }
  function screenvisibility(scrn1,scrn2, scrn3)
  {
    
        document.getElementById("1").style.display=scrn1;
        document.getElementById("2").style.display=scrn2;
        document.getElementById("3").style.display=scrn3;
    
  }
  function dudLinksHandler(id, param2){
      switch(id){
                   
        case "pgmdataUsage" :
            console.log('shilpi_du props',props)
            props.setDiagramType("DATA_USAGE_PGM")
             .then((json) =>
        
              props
              .setDataUsageProgram(param2)
              .then((json) =>{ setLoadDUDScreen(id);
                      //screenvisibility("none","block", "none")
                       } ))

        
            break;   
      case "dataDataUsage" :
        console.log("show value===", id, param2)
        props.setDiagramType("DATA_USAGE_FILE")
             .then((json) =>
        props.setDataUsageFileList()
        .then((json)=>
        props
        .setDataUsageFile(param2) 
        .then((json) =>
        props.setSourceBrowser({field: "PGMID",
        text: "",
        value: "",
        shortnm:""}) 
        .then((json) =>
           setLoadDUDScreen(id)
        ))))
        break;

      // case "pgmSourceBrowser":
      //   console.log("inside source browser case")
      //     props
      //       .setSourceBrowser(param2)
      //       .then((json) =>
      //                     screenvisibility("none", "none","block")
      //                   )
                    
      //       break;

      default :  
                 //setLoadScreen("0");   
  }
  }
  return   (
        <div style={{position:"relative", height:"100vw", width:"100vw", overflow:"auto"}}>
       
        <div id="1" style={{position:"absolute"}}>
       { LoadDUDScreen === "pgmdataUsage" ? 
        <DataUsageDiagram 
         dudLinksHandler={dudLinksHandler}
         DUDCloseHandler={DUDCloseHandler}
         {...props} /> : LoadDUDScreen === "dataDataUsage" ? 
         <DataUsageDiagramFile 
         dudLinksHandler={dudLinksHandler}
         DUDCloseHandler={DUDCloseHandler}
         {...props} /> : null }
        </div>
        

        
        </div>
  ) 
  
}

export default connect(mapStateToProps, 
    {
      //setNavListData,
    
    //fetchBaseTemplate,
    //setForProgram,
    setDataUsageProgramList,
    setDataUsageProgram,setSourceBrowser,
    setDataUsageFileList,
    setDataUsageFile,
    setDiagramType,
    setSourceBrowser
  }
    )(DUDRenderer);

    // return  (
    //     <div style={{position:"relative", height:"100vw", width:"100vw", overflow:"auto"}}>
    //     <div id="1" style={{position:"absolute"}}><PgmStruChart 
    //     pgmLinksHandler={pgmLinksHandler} screen2={LoadScreen} {...props}/></div>
    //     <div id="2" style={{position:"absolute"}}>
    //     <DataUsageDiagram 
    //      pgmLinksHandler={pgmLinksHandler}
    //      DUDCloseHandler={DUDCloseHandler}
    //      screen2={LoadScreen}
    //      {...props} />
    //     </div>
    //     <div id="3" style={{position:"absolute", display:"block" }}>
    //     <CodeEditor 
    //           pgmLinksHandler={pgmLinksHandler}
    //           SBCloseHandler={SBCloseHandler}
    //           screen2={LoadScreen} {...props}/>
    //     </div>
    //     </div>
    //   )