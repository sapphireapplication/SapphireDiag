import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import PageController from "./PageController";
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import { theme } from "../theme/theme";
import styles from "../styles/site.js";
import { withCookies } from "react-cookie";
import TopBar from "./TopBar";

import DataUsageDiagramFile from "./DataUsageDiagram/DataUsageDiagramFile";
import PageRenderer from "./PageRenderer";


function App(props) {
  const { cookies } = props;

  //Temporary setting of cookie
  var tokenVal = btoa("mdadmin" + ":" + "mdadmin");
  cookies.set("Token", tokenVal, { path: "/SapphireNew" });

  /* To remove cookie */
  // cookies.remove('Token');

  // import('../baseTemplates/page-schema-LOGOFF.json')
  // .then(object => {
  //     console.log(object.default)
  // })

  return (
    
      
      
          <MuiThemeProvider theme={theme}>        
      <PageRenderer  {...props} />
      </MuiThemeProvider>

  );
 

}

export default withCookies(withStyles(styles, { withTheme: true })(App));
