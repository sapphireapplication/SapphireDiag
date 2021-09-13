import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AnchorMenu from './AnchorMenu';
import { setTopbarData } from '../actions/TopbarActions';
import { setSessionInfo } from '../actions/SessionInfoActions';
import { Toolbar, Typography, AppBar, Box } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import DialogRenderer from './DialogRenderer';
import logo from '../images/logo.png';
import sapphirelogo from '../images/pngegg.png';
import Button from '@material-ui/core/Button';
import LoginScreen from './LoginScreen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from "@material-ui/core/Tooltip";
import { green } from '@material-ui/core/colors';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
//import DFDDiagram from "./DFDDiagram";


const mapStateToProps = (state) => {
  console.log('shilpi topbar mapStateToProps');
  return {
    titleInfo: state.topbarReducer.titleInfo,
    subTitleInfo: state.topbarReducer.subTitleInfo,
    notificationInfo: state.topbarReducer.notificationInfo,
    accountInfo: state.topbarReducer.accountInfo,
    sessionInfo: state.sessionInfoReducer.sessionInfo,
    contactInfo: state.topbarReducer.contactInfo,
    authDetails:state.topbarReducer.authDetails 
    // DFDinfo: state.topbarReducer.DFDinfo,
    //DFDdata: state.serverReducer.dfdData,
  };
};

const setUseStateValue = (st) => {
  if (sessionStorage.getItem('topBarButtonHighlightDetails') === null) {
    return true;
  } else {
    var tempObj = JSON.parse(
      sessionStorage.getItem('topBarButtonHighlightDetails')
    );
    if (st == 'scd') return tempObj.scdFlag;
    if (st == 'file') return tempObj.fileFlag;
    if (st == 'pgm') return tempObj.pgmFlag;
    if (st == 'dmd') return tempObj.dmdFlag;
  }
};
function Topbar(props) {
  const { classes } = props;
  console.log('shilpi props in topbar', props);
  const removeall = () =>{
    localStorage.clear();
    window.location.assign(`${window.location.origin}`);
  };
  const [open, setOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogContent, setDialogContent] = React.useState('');
  const [flagPgm, setFlagPgm] = React.useState(setUseStateValue('pgm'));
  const [flagFile, setFlagFile] = React.useState(setUseStateValue('file'));
  const [flagScd, setFlagScd] = React.useState(setUseStateValue('scd'));
  const [flagDmd, setFlagDmd] = React.useState(setUseStateValue('dmd'));
  const initialRender = useRef(true);
  const handleDialogOpen = (e) => {
    setDialogTitle(props.contactInfo.header);
    setDialogContent(props.contactInfo.content);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };
  const handleSCDClick = () => {
    setFlagScd(false);
    setFlagDmd(true);
    setFlagFile(true);
    setFlagPgm(true);
   /* props.linkClickHandler('PGMSCHART', {
      field: 'PGMID',
      value: '',
      text: '',
    });*/
  };
  const handleProgramClick = () => {
    setFlagScd(true);
    setFlagDmd(true);
    setFlagFile(true);
    setFlagPgm(false);
    //props.linkClickHandler('DATAUSAGE', { field: '', value: '', text: '' });
  };
  const handleFileClick = () => {
    setFlagScd(true);
    setFlagDmd(true);
    setFlagFile(false);
    setFlagPgm(true);

   // props.linkClickHandler('DATAUSAGEFILE', { field: '', value: '', text: '' });
  };
  const handleDMDClick = () => {
    setFlagScd(true);
    setFlagDmd(false);
    setFlagFile(true);
    setFlagPgm(true);
   // props.linkClickHandler('DMD', { field: '', value: '', text: '' });
  };

  useEffect(() => {
    /* Fetching session info data received from server on startup */
    console.log('shilpi topbar useeffect', props);
    props.setSessionInfo();
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = true;
    } else {
      var object = {
        scdFlag: flagScd,
        pgmFlag: flagPgm,
        dmdFlag: flagDmd,
        fileFlag: flagFile,
      };
      sessionStorage.setItem(
        'topBarButtonHighlightDetails',
        JSON.stringify(object)
      );
    }
  }, [flagScd, flagPgm, flagDmd, flagFile]);
  /* Rendering Topbar */
  // props.authDetails.dbName != "mvxd008"?null:
  //return !props.hasOwnProperty('authDetails') ||
   // props.authDetails.dbName == '' ? null : (
     return(
       
        <div id='topbar'>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          {/* Container for logo */}
          <Box className={classes.logoBox}>
            <img src={sapphirelogo} alt='logo' />
          </Box>

          {/* Container for title and subtitle */}
          <Box className={classes.titleBox}>
            {props.titleInfo ? (
              <Box>
                <Typography variant='h5' noWrap>
                  {/*props.titleInfo.value*/}
                </Typography>
              </Box>
            ) : (
              ''
            )}

            {props.subTitleInfo ? (
              <Box>
                <Typography variant='caption' noWrap>
                  {/*props.subTitleInfo.value*/}
                </Typography>
              </Box>
            ) : (
              ''
            )}
          </Box>
          {/* Flex Container in between to align the right side contents */}
          <Box className={classes.topbarBoxCenter}>
            <Button 
            className={flagPgm? classes.topB : classes.topC}  
              variant='contained'
              size='small'
              id='DataUsage'
              onClick={handleProgramClick}
              
            
            >
           <Link style={{color :"white", textDecoration:"none"}} to={{pathname:`/SapphireNew/${props.authDetails.dbName}/dusgp`}}>PROGRAMS</Link> 
        </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
       
            <Button 
            className={flagFile ? classes.topB : classes.topC} 
              variant='contained'
              size='small'
              id='DataUsageFile'
              onClick={handleFileClick}
              
            >
              <Link style={{color :"white", textDecoration:"none"}} to={{pathname:`/SapphireNew/${props.authDetails.dbName}/dusgf`}}>FILES</Link>
             
            {/*<Link style={{color :"white", textDecoration:"none"}} to="/`:${props.authDetails.dbName}`/dusgf">FILES</Link>*/}
            
          </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           
           
           
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           
          </Box>
          <Box className={classes.topbarBoxCenter}>
          <Tooltip 
        title={<h2 >LogOut</h2>}
        placement="bottom"
      >
            <IconButton
              aria-label='LogOut'
              size='small'
              id='logout'
              onClick={removeall}
              style={{ color: 'white' }}
            >
              <ExitToAppIcon fontSize='large'></ExitToAppIcon>
            </IconButton>
            </Tooltip>
          </Box>
          <Box className={classes.topbarBoxCenter} style={{ left: "20%" }}>
            <Button
              className={classes.saveButton}
              variant="contained"
              color="primary"
              id="DMDSaveButton"
            >Save</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  
     
      
     );
}

export default connect(mapStateToProps, { setTopbarData, setSessionInfo })(
  Topbar
);
