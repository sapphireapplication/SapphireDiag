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
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";





function DFDRenderer(props) {
  console.log('isme aaya dfd')
  return(
<Router>
      <Switch>
          <Route path="/dudfile"
        exact 
        component={()=>(
       
      <DataUsageDiagramFile  {...props}  />
   
        )}>
              
        </Route>
    
        <Route path="/" 
        exact 
        component={()=>(
        null
        )}>
              
        </Route>
        </Switch>

       
    </Router>
  )
  

}

export default connect(null, null)(DFDRenderer);



/*return(
 
    
   props.mainWindowState === 'PGMSCHART' ||
    props.mainWindowState === 'PGMSC_DU' ||
    props.mainWindowState === 'PGMSC_DU_FILE' ? (
    <PgmStruChart {...props} />
  ) : props.mainWindowState === "DMD" ? (
    <DMDChart {...props} />
  ) : props.mainWindowState === "DATAUSAGEFILE" ? (
    <DataUsageDiagramFile {...props}  />

   
  ) :props.mainWindowState === "DATAUSAGE"?<DUDRenderer {...props} /> : props.mainWindowState === "PGMSC_DU" ?
  <div style={{ width:"100vw", position:"relative"}}>
  <div id="panel1" 
  style={{height:"1000px", position: "absolute"}}
  ><PgmStruChart {...props} /></div>
  </div> :null 
  
  
  )*/