import React from "react";
import PageController from "./PageController";
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import { theme } from "../theme/theme";
import styles from "../styles/site.js";
import { withCookies } from "react-cookie";

function App(props) {
  const { cookies } = props;

  //Temporary setting of cookie
  var tokenVal = btoa("mdadmin" + ":" + "mdadmin");
  cookies.set("Token", tokenVal, { path: "/" });

  /* To remove cookie */
  // cookies.remove('Token');

  // import('../baseTemplates/page-schema-LOGOFF.json')
  // .then(object => {
  //     console.log(object.default)
  // })

  return (
    <MuiThemeProvider theme={theme}>
      <PageController {...props} />
    </MuiThemeProvider>
  );
}

export default withCookies(withStyles(styles, { withTheme: true })(App));
