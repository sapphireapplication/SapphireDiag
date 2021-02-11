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




const mapStateToProps = (state) => {
    return {
      sourceBrowserData : state.fetchSourceBrowserReducer,
      DUDProgramData: state.fetchDUDProgramReducer,
      dataUsageProgramList: state.fetchDataUsageProgramsReducer.dataUsageProgramList,

    };
  };


function PgmStructureRenderer(props) {
  
  const [LoadScreen, setLoadScreen] = useState("pgmStrChart");

  useEffect(() => {
    console.log("props dikhao===", props.screenId, props.screen2)
  });

  
  console.log("inside pgmstructurerenderer ===", props, LoadScreen, props.screenId);
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
  function pgmLinksHandler(id, param2){
      switch(id){
         case "pgmStrChart" :
        // case "pgmSChart" : 
        console.log("hello...", param2)
          
          props.setProgramData()
          .then((json) => {
            
              props
                .setProgramStructureChart(param2)
                //.then((dispatch, res) => console.log(res, dispatch))
                .then((json) => { 
                  props.setDataUsageProgram({field:"", value:"", text:""})
                   //.then((dispatch, res) => console.log(res, dispatch))
                   .then((json) => { 
                    screenvisibility("block","none", "none")
                    setLoadScreen(id); 

                   });
                  } ) 
          });
          break;                  
         case "pgmDataUsage" :
          //  case "dataUsage" :
            console.log('shilpi_du props',props)
                   
            props.setDataUsageProgramList()
            .then((json)=>
              props
              .setDataUsageProgram(param2)
              .then((json) =>{ console.log("second");
                      screenvisibility("none","block", "none")
                       } )
  
              );
        
            break;    
      case "pgmSourceBrowser":
        console.log("inside source browser case")
          props
            .setSourceBrowser(param2)
            .then((json) =>
                          screenvisibility("none", "none","block")
                        )
                    
            break;

      default :  
                 setLoadScreen("0");   
  }
  }
  return  (
    <div style={{position:"relative", height:"100vw", width:"100vw", overflow:"auto"}}>
    <div id="1" style={{position:"absolute", display:"block"}}><PgmStruChart 
    pgmLinksHandler={pgmLinksHandler} screen2={LoadScreen} {...props}/></div>
    <div id="2" style={{position:"absolute", display:"block"}}>
    <DataUsageDiagram 
     pgmLinksHandler={pgmLinksHandler}
     DUDCloseHandler={DUDCloseHandler}
     screen2={LoadScreen}
     {...props} />
    </div>
    <div id="3" style={{position:"absolute"}}>
    <CodeEditor 
    pgmLinksHandler={pgmLinksHandler}
    SBCloseHandler={SBCloseHandler}
    screen2={LoadScreen} {...props}/>
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
  }
    )(PgmStructureRenderer);

    