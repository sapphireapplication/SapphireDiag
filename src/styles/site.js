import { drawerWidth, theme } from "../theme/theme";

const styles = (theme) => ({
  root: {
    display: "flex",
    margin: theme.spacing(1),
  },
  drawerContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(1),
    overflow: "auto",
    direction: "rtl",
  },
  sidebarHeader: {
    flexGrow: 1,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#072f67",
  },
  mainContent: {
   // width: "100vw",
   width:"max-content",
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  caption: {
    // fontSize: "1.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    lineHeight: "2.5",
    backgroundColor: "#def3ff",
    
  },
  hiddenField: {
    display: "none",
  },
  labelCell: {
    width: "25%",
    borderBottom: "none",
    textAlign: "left",
    padding: "0px 0px 0px 0px",
  },
  textCell: {
    width: "40%",
    borderBottom: "none",
    textAlign: "left",
    padding: "0px 0px 0px 0px",
  },
  buttonCell: {
    width: "35%",
    borderBottom: "none",
    float: "left",
    padding: "0px 0px 0px 0px",
  },
  boxStyle: {
    margin: theme.spacing(1),
    minWidth: "100%",
  },
  cardHeader: {
    flexGrow: 1,
    textAlign: "left",
    paddingLeft: "15px",
    color: "#fff",
    backgroundColor: "#072f67",
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[0],
  },
  toolbar: {
    alignItems: "flex-start",
    paddingTop: theme.spacing(0),  /*1-->0*/
    paddingBottom: theme.spacing(0), /*2-->0 */
    ...theme.mixins.toolbar,
  },
  title: {
    flexGrow: 1,
    alignSelf: "flex-start",
  },
  subtitle: {
    flexGrow: 1,
    alignSelf: "flex-end",
    paddingLeft: "45px",
  },
  logoBox: {
    display: "flex",
    flexWrap: "wrap",
    // paddingRight: '10px',
    alignSelf: "center",
  },
  titleBox: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
  },
  profileBox: {
    display: "flex",
    // direction: 'rtl',
    alignItems: "center",
    alignSelf: "center",
  },
  topbarBoxCenter: {
    flexGrow: "1",
    position:"inherit",
    left:"10%",
    padding:"10px"
  },
  sidebarBox: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  sidebarMenu: {
    paddingLeft: "5px",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "flex-end",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  buttonGroupDiv: {
    direction: "rtl",
  },
  buttonGroupBtn: {
    margin: "5px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    margin: "0px",
  },
  sidebarFlexBox: {
    flexGrow: "1",
  },
  mainContentPaper: {
    padding: "0px",
    // padding: "10px",
  },
  cardContent: {
    paddingRight: "12px",
  },
  contactCardHeader: {
    padding: "10px",
  },
  contactCardContent: {
    padding: "10px",
    whiteSpace: "pre-wrap",
  },
  contactCard: {
    // boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
    whiteSpace: "pre-wrap",
  },
  emptyTable: {
    textAlign: "center",
  },
  linkAlign: {
    justifyContent: "left",
  },
  contactBtn: {
    color: "#fff",
  },
  span: {
    padding: "10px 20px 20px 17px",
  },
  cursorContext: {
    cursor: "context-menu",
  },
  fontSizeSmall: {
    fontSize: "small",
  },
  flexEnd: {
    justifyContent: "flex-end",
  },
  fotable: {
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(0, 0, 77, 0.08)",
//AN_CH rgba(0,0,0,0.08)
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.15) !important",
    },

    cursor: 'pointer',
    width: '100%',
    tableLayout: 'fixed',
  },
  fotablenew: {
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(0, 0, 77, 0.08)",
//AN_CH rgba(0,0,0,0.08)
    },
    

    cursor: 'pointer',
    width: '100%',
    tableLayout: 'fixed',
  },
  fotablesch: {
   
    cursor: 'pointer',
    width: '100%',
    tableLayout: 'fixed',
    backgroundColor: 'whitesmoke',
    border: '1px solid black',

  },

  fotable2: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    
    width: '100%',
    tableLayout: 'fixed',
  },
  focell: {
    overflow: 'hidden',
    height: '44px',
  },
   tdPandSbutton: {
    padding: '10px 10px 10px 10px',
    border: 'outset 3px #A3B8CF',
    cursor: 'pointer',
    transition: 'all 0.3s ease 0s',
    boxShadow: '0px 15px 20px #A3B8CF',
    textAlign: 'center',
    borderRight: '3px #A3B8CF',
    '&:hover': {
      backgroundColor: '#082c64',
      boxShadow: '0px 15px 20px rgba(46, 229, 157, 0.4)',
      color: '#fff',
    },
  },
  tdPandSbutton2: {
    padding: '10px 10px 10px 10px',
    backgroundColor: '#082c64',
    boxShadow: '0px 15px 20px rgba(46, 229, 157, 0.4)',
    color: '#fff',
    transition: 'all 0.3s ease 0s',
    boxShadow: '0px 15px 20px #A3B8CF',
    cursor: 'pointer',
    textAlign: 'center',
    // '&:hover': {
    //   backgroundColor: 'red',
    // },
  },
  highlightIcon: {
    backgroundColor: '#082c64 !important',
    color: 'white',
  },
  dfdfocell: {
    '&:hover': {
      backgroundColor: '#082c64 !important',
      boxShadow: '0px 15px 20px rgba(46, 229, 157, 0.4)',
      color: '#fff',
    },
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s ease 0s',
  },
  testingClass:{
    backgroundColor: '#262626',
    color:'lightgray',
    borderBottom:'0px solid white',
    fontSize:'12px',
    cursor:'pointer',
    '&:hover': {
      backgroundColor: 'black',
      
  },
    fontFamily: 'monospace',
  },
  /*testingClassHead:{
    backgroundColor: '#262626',
    color:'lightgray',
    borderBottom:'1px solid white',
    fontSize:'12px',
    cursor:'pointer',
    '&:hover': {
      backgroundColor: 'black',
      
  },
    fontFamily: 'monospace',
    fontWeight: 'bold',
    borderTop:'1px solid white',
  },*/
  testingClassHead:{
   
      "&:nth-of-type(odd)": {
        backgroundColor: "rgba(0, 0, 77, 0.08)",
           
  },
  borderBottom:'1px solid black', 
  fontWeight: 'bold',
  borderTop:'1px solid black',
},

  treeViewClass: {
    fontFamily: 'monospace',
  },
  
   /////////source browser
  
   ceDiv :  {
    // backgroundColor: "#262626",
    // padding: "5px", 
    // borderLeft: "solid 3px #262626",
    border:"2px solid black",
    
    position: "absolute",
    // left: "35%",
    
    //width:"700px",
    top: "45px",
    ////height:"90%",
    
    
},
ceDiv1 :  {
  // backgroundColor: "#262626",
  // padding: "5px", 
  // borderLeft: "solid 3px #262626",
  borderRadius : "4px", 
  width:"700px",
  position: "absolute",
  left: "500px",
  top: "45px",
  ////height:"90%",
  
  
},
ceTab : {
  backgroundColor: "#f5f5f5",
   //color:"#71a9ee",
   color:"#010203",
   borderBottom:"0px solid",
   fontSize:"12px",
   padding:"0px 4px 0px 4px",
  //color:"#FFFFFF",
},

  Rmenu :{
    position: "absolute",
    
    top: "45px",
    // border: "1px solid",
    //height:"70%",
    
    width:"400px",
    backgroundColor: "#262626",
  },
  /*Rmenu1 :{
    position: "absolute",
    left: "1200px",
    top: "45px",
    width: "500px",
    // border: "1px solid",
    height:"700px",
    backgroundColor: "#262626",
  },*/
  DSEdiv :{
    position: "absolute",
    left: "0.5%",
    top: "45px",
    // width: "400px",
    // width: "30%",
    width:"395px",
    height:"600px",
    border:"2px solid black",
    
    // width: "400px",
    backgroundColor: "#f5f5f5",
    //border: "1px solid",
    
  },
  DSEdiv3 :{
    position: "absolute",
    left: "0.5%",
    top: "45px",
    border:"2px solid black",
    // width: "400px",
    // width: "30%",
    width:"700px",
    height:"700px",
    backgroundColor: "#f5f5f5",
    //border: "1px solid",
    
  },
  SBcontainer : {
    
    height:"800px",
  },
  ButDSE : {
    fontSize: "12px",
    width: "145px",
    color:"black",
    backgroundColor:"#a0a0a0"
  },
  ButDSE1 : {
    fontSize: "12px",
    width: "110px",
    backgroundColor:"#a0a0a0",
    color:"black"
  },
  tabhead:{
backgroundColor:"lightgray",
color :"black",
 padding:"5px",
// height:"10px",
//position:"sticky",
  },
  tabhead1:{
    backgroundColor:"lightgray",
    color :"black",
     padding:"2px",
  },
  tabSB :{
  tableLayout: "fixed",
  width: "100%",
  // overflowY:"auto",
  // overflowX:"hidden",
  //height:"100%",
  },
  tabExp :{
    tableLayout: "fixed",
    width: "100%",
    // overflowY:"auto",
     overflowX:"hidden",
    //height:"100%",
    backgroundColor:"#262626",
    
    },
    trExp:{
      "&:hover":{
        color: "cyan !important",
      },
    },
    trExp1:{
      "&:hover":{
        color: "cyan !important",
        
      },
    },
    trExp3:{
      color:"#010203",
      "&:hover":{
        color: "cyan !important",
      },
    },
    trExp2:{
      color:"#FF4500",
    },
  trExp4Trial: {
    color: '#010203',
  },
    highExp:{
      backgroundColor: "lightblue !important",
      color:"black !important",
      fontWeight:'bold !important'
    },
  preBodyWU :{
  display: "inline",
    fontSize: "11px",
    border: "none",
    
    backgroundColor: "#262626",
    color: "lightgrey",
   
    padding: "0em",
    borderRadius: "0em"},
    preBody :{
      display: "inline",
      fontSize: "11px",
      border: "none",
      backgroundcolor: "#262626", 
      color: "lightgrey",
      padding: "0em",
      borderRadius: "0em",
     
  },
  closeButton1:{
  
    color: "#9e9e9e",
   
    position: "absolute",
    paddingBottom: "20px",
  },



////////////sourcebrowser related ends here
  RectContent: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "600px",
    height: "600px",
    backgroundColor: "#ffffff",
    textAlign: "left",
    border: "solid",
  },
  fullPgmName: {
    borderBottom: "5px solid black",
    fontSize: "40px",
    height: "100px",
  },
  Program: {
    padding:"5px 0px 5px 0px",
    width:"50%",
    float:"left",
    backgroundColor: "#e6e6e6",
    //borderBottom: "5px solid black",
    fontSize: "50px",
  },

  largeFont: {
    fontSize: "40px",
  },/*
  linkline: {
    strokeWidth: "3px",
    cursor: "pointer",
    //zIndex: "-1",
    opacity: "0.2",
  },*/
  arrow: {
    strokeWidth: "1.5px",
  },
  DMDSchemaBox: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "130px",
    height: "130px",
    backgroundColor: "#ffffff",
    textAlign: "center",
    borderStyle: "solid",
    borderRadius: "25px",//started-here
    overflowX: 'hidden',
    overflowY: 'hidden',//scroll
    '&::-webkit-scrollbar' : {
      width: '0 !important', // size of scrollbar
    }
  },
  EntityShortName: {
    borderBottom: "solid",
    fontSize : '16px'
  },
  EntityFullName: {
    borderBottom: "solid",
    fontSize: '13px'
  },
  EntitySchemaGroup :  {
    fontSize: '11px',
    textAlign: 'left',
    overflowY: 'scroll',
    overflowX: 'overlay',
    '&::-webkit-scrollbar' : {
      width: '0 !important', // size of scrollbar
    }
  },
  EntitySchema: {
    paddingLeft: '1%',
    margin: '0'
  },
  EntitySchemaElementColumn :{
    float: 'left',
    width: '55%',
  },
  EntitySchemaElementData : {
    float: 'right',
    width: '45%',
    whiteSpace: 'nowrap'
  },
  DmdOverlayBox: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "196px",
    height: "196px",
    backgroundColor: "#ffffff",
    textAlign: "left",
    border: "2px solid black",
    borderRadius: '25px'
  },
  DmdOverlayBoxClose: {    
    paddingRight: "0.5em",    
    borderBottom: "2px solid black"
  },
  DmdOverlayCloseBtn : {
      float: "right",
      cursor: "pointer",
      fontWeight: "bold",
      padding: "3px 3px 0 0",
    },
  DmdOverlayData : {
    marginBottom: "5px",
    overflow: "scroll",
    textAlign: 'center',
    "&::-webkit-scrollbar" : {
      width: "0 !important",
      display: "none" 
  }
  },
  OverlayEntityShortName :{
    fontSize: '18px',
    borderBottom: '2px solid'
  },
  OverlayEntityFullName:{
    fontSize: '14px',
    borderBottom: '2px solid'
  },
  OverlayEntitySchemaGroup: {
    fontSize: '12px',
    textAlign: 'left'
  },
  DmdOverlayCircleClose : {
    borderBottom: '2px solid',
    paddingRight: '8px'
  },
  DmdOverlayCircleCloseBtn: {
    float: 'right',
    cursor: 'pointer',
    padding: '0px',
    fontWeight: 'bold',
    fontSize: '10px'
  },
  DmdOverlayCircleData:{
    overflow: 'scroll',
    textAlign: 'center',
    marginBottom: '5px',
    "&::-webkit-scrollbar" : {
      width: "0 !important",
      display: "none" 
    }
  },
  OverlayCircleRlnid :{
    fontSize: '12px',
    borderBottom: '1px solid',
    fontWeight: '600',
    textAlign: 'center'
  },
  OverlayCircleColumn:{
    fontSize: '11px',
    float: 'left',
    width: '50%',
    textAlign: 'left',
  },
  OverlayCircleData: {
    fontSize: '11px',
    float:'right',
    width:'50%'
  },
  focellData: {
  },
  focellDataLeft: {
    float: 'left',
    width: '30%'
  },
  focellDataRight: {
    float: 'left',
    width: '70%',
    whiteSpace: 'nowrap'
  },
  nodetext: {
    //fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    
    fontSize: "2em",
    textAnchor: "middle",
    alignmentBaseline: "middle",
    pointerEvents: "none",
    /* Disable text selection
             from http://stackoverflow.com/questions/826782/css-rule-to-disable-text-selection-highlighting */
    //-webkit-touch-callout: none; /* iOS Safari */
    //-webkit-user-select: none; /* Chrome/Safari/Opera */
    //-khtml-user-select: none; /* Konqueror */
    //-moz-user-select: none; /* Firefox */
    //-ms-user-select: none; /* Internet Explorer/Edge */
    userSelect: "none",
  },
  linkline: {
    // strokeWidth: "2px",
    // cursor: "pointer",
    // stroke: 'black',
    // zIndex: -1,
    opacity: 0.3,
  },
  d3contextMenu: {
    position: "absolute",
    justifyContent: "flex-start",
    justifyItems: "flex-end",
    alignItems: "flex-end",
    height: "0px",
    width: "0px",
    visibility: "hidden",
    opacity: 1,
    textAlign: "center",
    boxShadow: "0 4px 5px 3px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#c7c7c7",
    //zIndex:-1,
  },
  d3contextItem :{
    display: "inline-block",
    position: "relative",
    width: "150px",
    height: "25px",
    borderColor: "#c7c7c7",
    borderTop: "0.5px solid #c7c7c7",
    borderBottom : "1px solid black",
    color: "#3b3b3b",
    fontSize: "12px",
    textAlign: "center",
    justifyContent: "center",
    //backgroundColor: "#c7c7c7",
    "&:hover": {
      //backgroundColor: "rgba(0, 0, 0, 0.15) !important",
      backgroundColor: "#f7c7c7",
      zIndex: 300,
      justifyContent: "center",
    },
  },
  d3menuItem:{
    paddingBottom: "5px solid",
  },
  ProgramTwo: { 
    backgroundColor: 'deepskyblue',
    fontSize: '80px',
    textAlign: 'center',
    marginBottom: '10px'
  },
  OverlayBox: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "820px",
    height: "800px",
    backgroundColor: "#ffffff",
    textAlign: "left",
    border: "5px solid black",
    boxShadow: "40px 40px 40px 0px rgba(50, 50, 50, 0.3)"
  },
  OverlayBoxClose: {    
    paddingRight: "2em",    
    borderBottom: "5px solid black"
  },
  OverlayCloseBtn : {
      float: "right",
      cursor: "pointer",
      fontSize: "4em",
      fontWeight: "bold",
      padding: "5px",
    },
  OverlayData : {
    padding: "10px",
    overflow: "scroll",
    "&::-webkit-scrollbar" : {
      width: "0 !important",
      display: "none" 
    }
  },
  EntityID : {
    fontSize: "60px",
    border: "1px solid black",
    borderLeft: "none",
    borderRight: "none",
    margin: "15px 0 5px 0",
    marginBottom: '5px',
    backgroundColor: 'darkgrey'
  },
  Short: {
    width: "28%",
    float: "left",
    marginRight: "1%",
    fontSize: "1em"
  },
  Ftxt: {
    width: "50%",
    float: "left",
    fontSize: "1em",
    height: "1.1em",
    overflowY: "hidden",
  },
  LenTypeCep: {
    width: "13%", 
    float: "right", 
    fontSize: "0.9em", 
    textAlign: "left"
  },
  EntityRow: {
    marginBottom: '5px',
    fontSize: '45px'
  },
  RowClear: {
    clear: 'both'
  },
  PropsContainer: {
    position: 'relative'
  },
  PropsNotFound: {
    backgroundColor: 'maroon',
    fontSize: '70px',
    color: 'white',
  },
  DataUsageRow : {
    fontSize: '12px'
  },
  DataId: {
    width: '50%',
    float: 'left'
  },
  DataText: {
    width: '50%',
    float: 'right'
  },
  plusbut:{
    fontSize:"45px",
    //border: "3px solid black",
    float:"right",
    width: "80px"
  },

  ///////////////////DMD///////////////////////////////////

  tableDMD:{
   width: "100%",
   tableLayout: "fixed",  
  },

  fotableDMD: {
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.15) !important",
    },

    //cursor: "pointer",
    //width:"100%",
    //tableLayout: "fixed",
    
  },
  focellDMD: {
    overflow: "hidden",
    height: "44px",
    width:"90%",
  },

  plusDMDbut:{
    display:"block",
    backgroundColor:"#072f67",
    text: "white",
    //fontSize:"45px",
    //border: "3px solid black",
    float:"right",
    cursor:"pointer",
    color:"white",
    //width: "80px"
  },
  
  highlight:{
    backgroundColor: 'lightblue !important',
  },
  highlightwu:{
    backgroundColor: 'lightblue !important',
    color:'black',
    fontWeight:'bold',
  },
  highlightsch:{
    backgroundColor: 'lightblue !important',
    fontWeight:'bold',
    //color:'black'
  },
  nohighlight:{
    backgroundColor:"white",
  },
  topB: {
    fontSize: 13,
    fontWeight: "bold",
    backgroundColor: "#072F67",
    '&:hover': {
      backgroundColor: "#3f51b5",
      
    },
    
  },
  topC: {
    fontSize: 13,
    fontWeight: "bold",
    backgroundColor: "#3f51b5",
    '&:hover': {
      backgroundColor: "#3f51b5",
      
    },
    
  },
  saveButton: {
    fontSize: 13,
    fontWeight: "bold",
    color:"white",
    backgroundColor: "#072F67",
    '&:hover': {
      backgroundColor: "#3f51b5",
    }
  }
  
});


export default styles;
