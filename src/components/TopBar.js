import React, { useEffect } from "react";
import { connect } from "react-redux";
import AnchorMenu from "./AnchorMenu";
import { setTopbarData } from "../actions/TopbarActions";
import { setSessionInfo } from "../actions/SessionInfoActions";
import { Toolbar, Typography, AppBar, Box } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import DialogRenderer from "./DialogRenderer";
import logo from "../images/logo.png";
import sapphirelogo from "../images/pngegg.png";
import Button from "@material-ui/core/Button";
//import DFDDiagram from "./DFDDiagram";

const mapStateToProps = (state) => {
  return {
    titleInfo: state.topbarReducer.titleInfo,
    subTitleInfo: state.topbarReducer.subTitleInfo,
    notificationInfo: state.topbarReducer.notificationInfo,
    accountInfo: state.topbarReducer.accountInfo,
    sessionInfo: state.sessionInfoReducer.sessionInfo,
    contactInfo: state.topbarReducer.contactInfo,
    // DFDinfo: state.topbarReducer.DFDinfo,
    //DFDdata: state.serverReducer.dfdData,
  };
};

function Topbar(props) {
  const { classes } = props;

  const [open, setOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("");
  const [dialogContent, setDialogContent] = React.useState("");
  const [flagPgm, setFlagPgm] = React.useState(true);
  const [flagFile, setFlagFile] = React.useState(true);
  const [flagScd, setFlagScd] = React.useState(true);
  const [flagDmd, setFlagDmd] = React.useState(true);
  const handleDialogOpen = (e) => {
    setDialogTitle(props.contactInfo.header);
    setDialogContent(props.contactInfo.content);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };
  const handleProgramClick = ()  =>{
     console.log('Handle Program Click')
     setFlagScd(!flagScd)
     if(!flagFile)
     setFlagFile(!flagFile)
     if(!flagPgm)
     setFlagPgm(!flagPgm)
     if(!flagDmd)
     setFlagDmd(!flagDmd)
      props.linkClickHandler('PGMSCHART',{field:"PGMID",
      value:"",
      text:"",
      });
  }
  const handleDUDClick = ()  =>{
    console.log('Handle DUD Click')
    setFlagPgm(!flagPgm);
    if(!flagFile)
     setFlagFile(!flagFile)
     if(!flagScd)
     setFlagScd(!flagScd)
     if(!flagDmd)
     setFlagDmd(!flagDmd)
     props.linkClickHandler('DATAUSAGE',{field:"",
     value:"",
     text:"",
     });
 }
 const handleDUDFileClick = ()  =>{
  console.log('Handle DUD Click')
  setFlagFile(!flagFile);
  if(!flagPgm)
   setFlagPgm(!flagPgm)
   if(!flagScd)
     setFlagScd(!flagScd)
     if(!flagDmd)
     setFlagDmd(!flagDmd)
 
   props.linkClickHandler('DATAUSAGEFILE',{field:"",
   value:"",
   text:"",
   });
}
  const handleDMDClick = ()  =>{
    console.log('Handle DMD click')
    setFlagDmd(!flagDmd)
     if(!flagFile)
     setFlagFile(!flagFile)
     if(!flagPgm)
     setFlagPgm(!flagPgm)
     if(!flagScd)
     setFlagDmd(!flagScd)
    props.linkClickHandler('DMD',{field:"",
     value:"",
     text:"",
     });
  }

  useEffect(() => {
    /* Fetching session info data received from server on startup */
    props.setSessionInfo();
    
   
  }, []);

  /* Rendering Topbar */
  return (
    <div id="topbar">
      <AppBar>
        <Toolbar className={classes.toolbar}>
          {/* Container for logo */}
          <Box className={classes.logoBox}>
            <img src={sapphirelogo} alt="logo" />
          </Box>

          {/* Container for title and subtitle */}
          <Box className={classes.titleBox}>
            {props.titleInfo ? (
              <Box>
                <Typography variant="h5" noWrap>
                  {/*props.titleInfo.value*/}
                </Typography>
              </Box>
            ) : (
              ""
            )}

            {props.subTitleInfo ? (
              <Box>
                <Typography variant="caption" noWrap>
                  {/*props.subTitleInfo.value*/}
                </Typography>
              </Box>
            ) : (
              ""
            )}
          </Box>
          {/* Flex Container in between to align the right side contents */}
          <Box className={classes.topbarBoxCenter}>
            <Button
            variant="contained"
            size="small"
            id="DataUsage"
            onClick = {handleDUDClick}
           
            //color = {flagPgm ? "primary" : "secondary"}
            color = {flagPgm ? "primary":"#efef0"}
          >
            PROGRAMS
        </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
            variant="contained"
            size="small"
            id="DataUsageFile"
            onClick={handleDUDFileClick}
          
           
            color = {flagFile ? "primary":"#efef0"}
          >
            FILES
          </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            size="small"
            id="Program"
            onClick={handleProgramClick}
            color = {flagScd ? "primary":"#efef0"}
            //color="primary"
          >
            SCD
          </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            size="small"
            id="DMD"
            onClick={handleDMDClick}
            color = {flagDmd ? "primary":"#efef0"}
          >
            DMD
          </Button>
          </Box>
          

          
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connect(mapStateToProps, { setTopbarData, setSessionInfo })(
  Topbar
);
