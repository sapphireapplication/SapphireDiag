import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import DataUsageDiagramOverlay from "./DataUsageDiagram/DataUsageDiagramOverlay";
import DataUsageDiagram from "./DataUsageDiagram/DataUsageDiagram";
import DataUsageDiagramFile from "./DataUsageDiagram/DataUsageDiagramFile";
import CodeEditor from "./DataUsageDiagram/CodeEditor";
//import DataFlowDiagram from "./DataUsageDiagram/DataFlowDiagram";
import PgmStruChart from "./PgmStruChart/PgmStruChart";
import DMDChart from "./DMDChart";
import PgmStructureRenderer from "./PgmStructureRenderer";
import DUDRenderer from "./DUDRenderer";


function DFDRenderer(props) {
  console.log("inside frame ===", props);
  // return props.screenId === "PGMSCHART" ? (
  //   <PgmStruChart {...props} />
  // ) : props.screenId === "dataModelDiag" ? (
  //   <DMDChart {...props} />
  // ) : props.mainWindowState === "DATAUSAGE"?<DUDRenderer {...props} /> : props.screenId === "PGMSC_DU" ?
  // <div><PgmStruChart {...props} /><DataUsageDiagram {...props}/></div> :null 

  return props.mainWindowState === "PGMSCHART" || props.mainWindowState === "PGMSC_DU"  ? (
    <PgmStruChart {...props} />
  ) : props.mainWindowState === "DMD" ? (
    <DMDChart {...props} />
  ) : props.mainWindowState === "DATAUSAGEFILE" ? (
    <DataUsageDiagramFile {...props} />
  ) :props.mainWindowState === "DATAUSAGE"?<DUDRenderer {...props} /> : props.mainWindowState === "PGMSC_DU" ?
  <div style={{ width:"100vw", position:"relative"}}>
  <div id="panel1" 
  style={{height:"1000px", position: "absolute"}}
  ><PgmStruChart {...props} /></div>
  </div> :null 
  
}

export default connect(null, null)(DFDRenderer);
//<DataUsageDiagramOverlay {...props}/>