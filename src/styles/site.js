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
    // padding: theme.spacing(1),
    // flexGrow: 1,
    // textAlign: "left",
    // color: '#fff',
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
    color: theme.palette.grey[500],
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
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.15) !important",
    },

    cursor: "pointer",
    width:"100%",
    tableLayout: "fixed",
    
  },
  focell: {
    overflow: "hidden",
    height: "44px",
    
  },
  
   /////////source browser
   ceDiv :  {
    // backgroundColor: "#262626",
    // padding: "5px", 
    // borderLeft: "solid 3px #262626",
    borderRadius : "4px", 
    width:"35%",
    position: "absolute",
    left: "35%",
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
  backgroundColor: "#262626",
   //color:"#71a9ee",
   color:"lightgray",
   borderBottom:"0px solid",
   fontSize:"12px",
   padding:"0px 4px 0px 4px",
  //color:"#FFFFFF",
},

  Rmenu :{
    position: "absolute",
    right: "1%",
    top: "45px",
    width: "25%",
    // border: "1px solid",
    //height:"70%",
    backgroundColor: "#262626",
  },
  Rmenu1 :{
    position: "absolute",
    left: "1200px",
    top: "45px",
    width: "500px",
    // border: "1px solid",
    height:"700px",
    backgroundColor: "#262626",
  },
  DSEdiv :{
    position: "absolute",
    left: "1%",
    top: "45px",
    // width: "400px",
    width: "30%",
    height:"70%",
    backgroundColor: "#262626",
    //border: "1px solid",
    
  },
  DSEdiv1 :{
  position: "absolute",
    left: "40px",
    top: "45px",
    // width: "400px",
    width: "450px",
    height:"700px",
    backgroundColor: "#262626",
    //border: "1px solid",
    
  },
  SBcontainer : {
    position: "relative",
    height:"800px",
  },
  ButDSE : {
    fontSize: "8px",
    width: "110px",
  },
  tabhead:{
backgroundColor:"lightgray",
color :"black",
// padding:"10px",
// height:"10px",
//position:"sticky",
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
        fontSize:"14px",
        
      },
    },
    highExp:{
      backgroundColor: "cyan !important",
      color:"black !important",
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
    overflowY: 'scroll',
    '&::-webkit-scrollbar' : {
      width: '5px !important',
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
    'p &': {
      // margin: 0
    }
  },
  EntitySchema: {
    paddingLeft: '1%',
    margin: '0'
  }
  ,
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
    strokeWidth: "3px",
    cursor: "pointer",
    zIndex: -1,
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
  }
  
  
});

export default styles;
