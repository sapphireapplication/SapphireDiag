import React, { useEffect } from "react";
//import TransitionAlert from "./TransitionAlert";
import { connect } from "react-redux";
import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
// import {
//   setMainContentData,
//   setMainContentNavList,
// } from "../actions/MainContentActions";
import BreadCrumb from "./BreadCrumb";
import clsx from "clsx";
import DFDRenderer from "./DFDRenderer";
const Maincontent = ({ handleDrawerOpen, open , classes, children }) => {
//function Maincontent(props,children) {
 // const { classes } = props;
  //console.log("in main content==", props);
  
  /* Rendering main component */
  return (
   <div id="mainContent" className={classes.mainContent}>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: true,
        })}
      >
        {/* To leave space on top to prevent overlapping with Topbar */}
        <div className={classes.toolbar} />

        {/*<Grid container spacing={3}>*/}
         

          {/* Main content header rendering i.e. breadcrumb, caption & alert messages */}
          {/*<Grid item xs={12} id="frame1">
              <Typography variant="h6">{props.screenDetail.caption}</Typography>
      </Grid>*/}
          {/* Main content elements rendering */}
          <Grid item xs={12}>
            <Paper elevation={5} className={classes.mainContentPaper}>
              <Grid container spacing={0}>
                {/*<FramesRenderer {...props} />*/}
                {/*<DFDRenderer {...props} />*/}
                {children}

              </Grid>
            </Paper>
          </Grid>
        {/*</Grid> */}
    
      </main>
    </div>
  );
}

//export default connect(mapStateToProps, { setDataToBeRender })(Maincontent);
export default connect(null, null)(Maincontent);
