import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
//import {setSourceBrowser} from "../../actions/DataUsageDiagram/SourceBrowserAction";
import $ from 'jquery';




const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

/*const mapStateToProps = (state) => {
  console.log('shilpi codeeditor  mapStateToProps',state.fetchSourceBrowserReducer)
  
  return {
    sourceBrowserData : state.fetchSourceBrowserReducer
  };
};

const mapDispatchToProps = (dispatch) => {
  console.log('shilpi codeditor mapdispatch mapStateToProps')
  
  return {

    setSourceBrowser: async(srcbpgm)=> {
          await dispatch(setSourceBrowser(srcbpgm))
          
      },      
  }
}*/


 function CodeEditor(props) {
  const { classes } = props;
  console.log('codeeditor props',props)
 

  useEffect(() => {
    scrollceDiv()  //to scroll sb window to particular line
   
  //},[props.sourceBrowserData.pgmCodeData,props.srcbpgm]);
   },[props.srcbpgm]);
  function scrollceDiv(){
    console.log('myfunc called',props)
    if(props.srcbpgm.linenum!=''){
    //var linenum = props.srcbpgm.linenum
    if(props.sourceBrowserData.pgmCodeData.length!=0){
       var arrind = props.sourceBrowserData.pgmCodeData.findIndex(elem=>props.srcbpgm.linenum ===elem.LineNum);
       console.log("arrind==", arrind);
       if(arrind !=-1){
         var subRtFocus = document.getElementById(`row`+arrind);
         console.log('frow', document.getElementById(`row0`));

         console.log('element show',subRtFocus)
         var firstrow = Math.abs($(`#row0`).offset().top );
         var otop = Math.abs($(`#row${arrind}`).offset().top );
         console.log('firstrow , otop',firstrow,otop)
         document.getElementById("ceDivC").scrollBy(0, Math.abs(otop-firstrow)); //changed 190 to 230 anushka
         setHighlightIndex(arrind);
       }
     }
   }

  }

  const Rmenuleftpos = {
   
    left: window.screen.width - 400 + "px", 
     // 400 is width of rmenu
     top: props.srcbpgm.offsetTop,
     display:'none'  //added by shilpi

  };
  
 
 /* const ceDivleftpos =  (selectedDSE == 0 && ExpData.slctd == 0) ? { left : window.screen.width - 1110 + "px", width:"700px", top:props.srcbpgm.offset}: 
  { left : window.screen.width +10 + "px",width:"700px", top:props.srcbpgm.offset};*/
    //changed from 1010 to 10 shilpi
   const ceDivleftpos =  (selectedDSE == 0 && ExpData.slctd == 0) ? { left : props.srcbpgm.offsetLeft + "px", width:"700px", top:props.srcbpgm.offsetTop}: 
  { left : props.srcbpgm.offsetLeft + "px",width:"700px", top:props.srcbpgm.offsetTop};

  
  console.log("inside codeEditor ===", props);
  const [selectedDSE, setselDSE] = React.useState(0);
  const [ExpData, setExpData] = React.useState({slctd:0, whereusedData:[]});
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  //var DSEstyle = selectedDSE === 0 ? {display:"none"}: {display:"block", top:props.srcbpgm.offset,left : window.screen.width - 450 + "px"}; //shilpi
  //left : window.screen.width - 10 + "px"
  var DSEstyle = selectedDSE === 0 ? {display:"none"}: {display:"block", top:props.srcbpgm.offsetTop,left : props.srcbpgm.offsetLeft +750 + "px"}; //shilpi
  var Expstyle = ExpData.slctd===0 ? {display:"none"}: {display:"block", top:props.srcbpgm.offsetTop,left : props.srcbpgm.offsetLeft +750 + "px",width:"600px", height:"600px"}; //shilpi
  function refreshSourceBrowser()  {
    var pgmid=props.sourceBrowserData.pgmID;
    var row = props.sourceBrowserData.rBrowser.find(x=>x.PGMID===pgmid);
    console.log("whats in rooow=",row);
     var arrind = props.sourceBrowserData.pgmCodeData.findIndex(elem=>row.LINENUM ===elem.LineNum);
    console.log("arrind==", arrind);
    var subRtFocus = document.getElementById(`row`+arrind);
    document.getElementById("ceDivC").scrollBy(0, subRtFocus.getBoundingClientRect()['top']-arrind+50); //changed 190 to 230 anushka
   setHighlightIndex(arrind);
  
  };
  
    function handlerBrowserClickHead(e, row){

      console.log(" handlerBrowserClickHead u clicked==", props.sourceBrowserData.pgmID, row.PGMID);
      if (row.PGMID.trim() !==props.sourceBrowserData.pgmID){
        var item = 
          {
            field: "PGMID",
            text: "",
            value: row.PGMID.trim(),
            //shortnm:props.sourceBrowserData.rBrowser[0].MVARDB==""?props.sourceBrowserData.rBrowser[0].MVAR:props.sourceBrowserData.rBrowser[0].MVARDB,
            /*SA_FIX */
            shortnm:props.sourceBrowserData.rBrowser[0].SVAR1DB==""?props.sourceBrowserData.rBrowser[0].MVARDB.trim():props.sourceBrowserData.rBrowser[0].SVAR1DB.trim(),
          };
          ////if Explorer window open, close it
          if (ExpData.slctd === 1)
                 handleExpClose(event);
                 setselDSE(0);//close DSE window if open

          // props.pgmLinksHandler("pgmSourceBrowser", item);
          console.log("whats in item===", item);
          //props.setSourceBrowser(item);
          
        
       console.log("open another source browser",item);
       }
      // else 
      // {
////////////////////////// 
          console.log("whats in row====", row);        
          var arrind = props.sourceBrowserData.pgmCodeData.findIndex(elem=>row.LINENUM ===elem.LineNum);
        console.log("arrind==", arrind);
        var subRtFocus = document.getElementById(`row`+arrind);
        document.getElementById("ceDivC").scrollBy(0, subRtFocus.getBoundingClientRect()['top']-arrind+50); //changed 190 to 230 anushka
       setHighlightIndex(arrind);
}


    
    function handlerBrowserClickLine(e, row){
      console.log("u clicked==", row);
    }
    function handleDSEClick(event) {
      event.preventDefault();
      ////if Explorer window open, close it
      if (ExpData.slctd === 1)
      handleExpClose(event);
      ////if Explorer window open, close it ends
      setselDSE(selectedDSE==0?1:0);
      console.log("key value===", event);
  
    };
   
    function handleExpClose(event) {
      event.preventDefault();
      
      setExpData({slctd:0, whereusedData:[]})
//////Resetting Scroll By to top///////
      document.getElementById("ceDivC").scrollBy(0, document.getElementById(`row1`).getBoundingClientRect()['top']-arrind+50); //changed 190 to 230 anushka
      setHighlightIndex(-1);
//////Resetting Scroll By to top ends///////
    };
    function goToLineClick(event, elem){
      event.preventDefault();
      console.log("u clicked ", elem);
      var arrind = props.sourceBrowserData.pgmCodeData.findIndex(row=>
        row.LineNum ===elem.LineNum  
       )

        var subRtFocus = document.getElementById(`row`+arrind);
        document.getElementById("ceDivC").scrollBy(0, subRtFocus.getBoundingClientRect()['top']-arrind+50); //changed 190 to 230 anushka
       setHighlightIndex(arrind);
       
       
    }
    
   


function handleVariableClick(e)
{
  console.log("u clicked==", e.target.innerHTML, props);
  var arr = props.sourceBrowserData.pgmCodeData.filter(row=>
   row.Stn.includes(e.target.innerHTML)  
  )
  if (selectedDSE===1)
   setselDSE(0);
   setExpData({slctd:1, whereusedData:arr});
//console.log("show whats in arr==", arr);
}   
function checkStringInList(opcodes, strng)
{
//console.log("opcodes=", strng)
    for(var i=0; i< opcodes.length ; i++)
    { 
        if(strng.includes(opcodes[i]))
        return {status: true, opcode:opcodes[i]};
        }
    
    return {status: false, opcode:""};
}

function highlightStn1(stn){
  var res = stn.split(" ");
 var arr=[];
  var s=[]
  var f=0
for(var i=0; i<res.length;i++){
  if(res[i].length==0)
  {arr.push(" ");continue;}
  if(res[i]===undefined)
  {arr.push(res[i])
    }
  else if(!res[i].includes("(")&& !res[i].includes(")") && !res[i].includes("'") && isNaN(res[i])&& !res[i].includes("Not") && !res[i].includes("AND") && !res[i].includes("And") && !res[i].includes("=") && !res[i].includes("<>") && !res[i].includes(">=") && !res[i].includes("<=") &&  !res[i].includes("+"))
{
  arr.push(<span onClick = {(e)=>  handleVariableClick(e)} className={classes.trExp1} style={{cursor:"pointer"}}>{res[i]}</span>)
  arr.push(" ")
}
else if (res[i].includes("(")&& res[i].includes(")"))
{
  arr.push(checkforF(res[i]))
  arr.push(" ")
}
else if (res[i]==="=" || res[i]==="<>" ||res[i]===">=" || res[i]==="<=" ||  res[i]==="+" )
{
  arr.push(<span style={{color:"#9400D3"}}>{res[i]}</span> )
  arr.push(" ")
}
else {
arr.push(<span>{res[i]}</span>)
arr.push(" ")
}
}
  return <span>{arr}</span>
}
function highlightStn6(stn){
  var res = stn.split(" ");
 var arr=[];
  var s=[]
  var f=0,c=0;
for(var i=0; i<res.length;i++){
  if(res[i].length==0)
  {arr.push(" ");continue;}
  if(res[i]===undefined)
  {arr.push(res[i])
    }
    else if(res[i].length!=0 && res[i]!=undefined && i!=19 && i!=15 && i!=13){
    if(f==0){
   arr.push( <span onClick = {(e)=>  handleVariableClick(e)} className={classes.trExp1} style={{cursor:"pointer"}}>{res[i]}</span>)
   arr.push(" ")
   f=1;
    }
    else if(f==1){
      arr.push(checkforV(res[i]))
  arr.push(" ")
    }
    }
else {

  arr.push(checkforV(res[i]))
  arr.push(" ")
}
}
  return <span>{arr}</span>
}
function checkforF(res){
  var arr;
  if(res.includes("(") || res.includes(")") ){
    var string = res; 
var i = string.indexOf("(");
var j = string.indexOf(")")+1;
var redText = string.substring(i+1, j-1);
arr = <span  className={classes.trExp2} ><span style={{cursor:"pointer"}} onClick = {(e)=>  handleVariableClick(e)}>{string.substring(0,i)}</span>(<span onClick = {(e)=>  handleVariableClick(e)} className={classes.trExp3} style={{cursor:"pointer"}}>{redText}</span>){string.substring(j)}</span>
  }
return arr;
}
function checkforV(res){
  var arr;
  if(res===undefined)
  {
    arr=res;
  }
  else if (res.includes("EndIf") || res.includes("If")|| res.includes("IFNE")|| res.includes("Else")|| res.includes("IFEQ")|| res.includes("ELSE") )
  {
  arr=<span style={{color:"#9400D3"}}>{res}</span>
  }
else {
  arr=<span style={{color:"#010203"}}>{res}</span>
}
return arr;
}
function highlightStn7(stn){ 
  var arr=[];
  if(stn.includes("//") || stn.includes("**")|| stn.substr(0,2).includes("*"))
  {
    arr.push(stn)
    return <span style={{color:"#26AC26"}}>{arr}</span>
  }
 
  else{
  var res = stn.split(" ");
  var s=[]
  var f=0
for(var i=0; i<res.length;i++){
  var opcodes=['/end-free','/END-FREE','/free','/End-Free', '/Free','dow','enddo','DoU', 'EndDo','Select','When','ExSr','Else','BegSr','Write','endif','if','EndIf','If','monitor', 'endmon','ENDMON','DoW','Clear'];
  var result = checkStringInList(opcodes,res[i]);
  if(res[i].length==0)
  {arr.push(" ");continue;}
  if(res[i]===undefined)
  {arr.push(res[i])
    }
    else if (result.status){
      arr.push(<span style={{color:"#9400D3"}}>{res[i]}</span>)
      arr.push(" ")
    }
  else if(!res[i].includes("(")&& !res[i].includes(")") && !res[i].includes("'") && !res[i].includes("CallP") && !res[i].includes("Close") && !res[i].includes("/copy") && !res[i].includes("SetLL") && isNaN(res[i])&& !res[i].includes("Not") && !res[i].includes("AND") && res[i].length>2 && !res[i].includes("and") && !res[i].includes("clear") && !res[i].includes("CLEAR") && !res[i].includes("And") && !res[i].includes("=") && !res[i].includes("<>") && !res[i].includes(">=") && !res[i].includes("<=") &&  !res[i].includes("+"))
{
  arr.push(<span onClick = {(e)=>  handleVariableClick(e)} className={classes.trExp1} style={{cursor:"pointer"}}>{res[i]}</span>)
  arr.push(" ")
}
else if (res[i].includes("(")&& res[i].includes(")"))
{
  arr.push(checkforF(res[i]))
  arr.push(" ")
}
else if (res[i]==="=" || res[i]==="<>" ||res[i]===">=" || res[i]==="<=" ||  res[i]==="+" )
{
  arr.push(<span style={{color:"#9400D3"}}>{res[i]}</span> )
  arr.push(" ")
}
else {
  arr.push(<span>{res[i]}</span> )
arr.push(" ")
}
}
} 
return <span>{arr}</span>
}
function highlightStn17(stn){ 
  var arr=[];
  if(stn.includes("//") || stn.includes("**")|| stn.substr(0,2).includes("*"))
  {
    arr.push(stn)
    return <span style={{color:"#26AC26"}}>{arr}</span>
  }
 
  else{
  var res = stn.split(" ");
  var s=[]
  var f=0
for(var i=0; i<res.length;i++){
  var opcodes=['/end-free','/END-FREE','/free','/End-Free', '/Free','dow','enddo','DoU', 'EndDo','Select','When','ExSr','Else','BegSr','Write','endif','if','EndIf','If','monitor', 'endmon','ENDMON','DoW','Clear'];
  var result = checkStringInList(opcodes,res[i]);
  if(res[i].length==0)
  {arr.push(" ");continue;}
  if(res[i]===undefined)
  {arr.push(res[i])
    }
    else if (result.status){
      arr.push(<span style={{color:"#9400D3"}}>{res[i]}</span>)
      arr.push(" ")
    }
  else if(!res[i].includes("(")&& !res[i].includes(")") && !res[i].includes("'") && !res[i].includes("CallP") && !res[i].includes("Close") && !res[i].includes("/copy") && !res[i].includes("SetLL") && isNaN(res[i])&& !res[i].includes("Not") && !res[i].includes("AND") && res[i].length>2 && !res[i].includes("and") && !res[i].includes("clear") && !res[i].includes("CLEAR") && !res[i].includes("And") && !res[i].includes("=") && !res[i].includes("<>") && !res[i].includes(">=") && !res[i].includes("<=") &&  !res[i].includes("+"))
{
  arr.push(<span  className={classes.trExp1} >{res[i]}</span>)
  arr.push(" ")
}
else if (res[i].includes("(")&& res[i].includes(")"))
{
  arr.push(checkforF(res[i]))
  arr.push(" ")
}
else if (res[i]==="=" || res[i]==="<>" ||res[i]===">=" || res[i]==="<=" ||  res[i]==="+" )
{
  arr.push(<span style={{color:"#9400D3"}}>{res[i]}</span> )
  arr.push(" ")
}
else {
arr.push(<span>{res[i]}</span>)
arr.push(" ")
}
}
}
return <span>{arr}</span>
}
function highlightStn(stn){
  
  var opcodes=['/end-free','/free','dow','enddo','DoU', 'EndDo','Select','When','ExSr','BegSr','Write','endif','if','EndIf','If','monitor', 'endmon'];
  
  var result = checkStringInList(opcodes,stn);
  //console.log("result===", result)
  if (stn.substr(0,1)==' ' && result.status){
    
    var ind = stn.indexOf(result.opcode);
    return (<span>{stn.substr(0,ind)}<span style={{color:"#9400D3"}}>{stn.substr(ind,result.opcode.length+1)}</span>
           {checkforstring(stn.substr(ind+result.opcode.length+1))}</span>)
  }
   if (stn.substr(0,1)==' ' && stn.includes("//") || stn.substr(0,2)=='*'  )
       return <span style={{color:"#26AC26"}}>{stn}</span>
  if (stn.substr(0,1)==' ' && stn.includes("'"))
       return checkforstring(stn)     
      
  return <span>{stn}</span>

}
function checkforstring(stn)
{
  
  if (stn.includes("'"))
  {
    var sind = stn.indexOf("'");
    var eind = stn.substr(sind+1).indexOf("'")+1;

    return <span>{stn.substr(0,sind)}<span style={{color:"#f19947"}}>{stn.substr(sind,eind+1)}</span>{stn.substr(sind+eind+1)}</span>
  }
 
  else return <span>{stn}</span>
//
}
function handleSBClose(){
  //props.setSourceBrowser({field:"", value:"", text:"", shortnm:""});
}

 

  //return props.sourceBrowserData.pgmCodeData.length === 0? null : (
  //  return props.sourceBrowserData.rBrowser.length === 0? null : (

  //  return props.sourceBrowserData.pgmCodeData.length === 0? null : (
    return props.srcbpgm.linenum == ""? null : (
    <div id="SBcontainer" className={classes.SBcontainer} style={{height:"100vw", width:"100vw"}}>
    
           
     {/*<div id="Rmenu" style={Rmenuleftpos} className = {classes.Rmenu}>
        <TableContainer component={Paper} style={{maxHeight:"700px"}}>
          <Table className={classes.tabExp} stickyHeader aria-label="sticky table" >
             <colgroup><col style={{width:'15%'}}/><col style={{width:'10%'}}/><col style={{width:'75%'}}/></colgroup>
            <TableHead >
              <TableRow>
                <TableCell align="left" colSpan={3} className={classes.tabhead}> {props.sourceBrowserData.rBrowser[0].MVARDB==""?props.sourceBrowserData.rBrowser[0].MVAR:props.sourceBrowserData.rBrowser[0].MVARDB}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>  
            {props.sourceBrowserData.rBrowser.map((row, index) => (
              <TableRow onClick = {(e)=>  handlerBrowserClickHead(e, row)} style={{cursor:"pointer"}}>
                
                 {index==0?<TableCell  align="left" className={classes.ceTab}><pre  style={{display:"inline"}}>{row.PGMID}</pre></TableCell>:(
                   row.PGMID!==props.sourceBrowserData.rBrowser[index-1].PGMID ?<TableCell align="left"  className={classes.ceTab}><pre  style={{display:"inline"}}>{row.PGMID}</pre></TableCell>:
                   <TableCell align="center"  className={classes.ceTab}><pre  style={{display:"inline"}}></pre></TableCell>
                 )}
                    <TableCell align="left"  className={classes.ceTab}>
                    <pre style={{display:"inline"}}>{row.LINENUM}</pre>
                    </TableCell>
                    <TableCell align="left" className={classes.ceTab}>
                    <pre className={classes.trExp} style={{display:"inline"}}>{row.STN}</pre></TableCell>
                 </TableRow> )) }
            </TableBody>
          </Table>
        </TableContainer>
                 </div> */}

     {props.sourceBrowserData.pgmCodeData.length ===0 ? null :
      <div id='ceDiv' className={classes.ceDiv} style={ceDivleftpos} >
     
      <TableContainer id='ceDivC' component={Paper} style={{maxHeight:"700px"}}>
      
      <Table className={classes.tabSB} stickyHeader aria-label="sticky table">
    <colgroup>
      <col style={{width:'10%'}}/>
      <col style={{width:'70%'}}/>
      <col style={{width:'20%'}}/>
          </colgroup>
          <TableHead >
        
            <TableRow>
          <TableCell style={{padding:"0"}}  colSpan={3} >
            <Table>
              <TableRow className={classes.tabRow}  >
            <TableCell style={{width:"280px"}} align="left" colSpan={0} className={classes.tabhead}>
            <Button
            aria-describedby="simple-popover"
            variant="contained"
            
            onClick={handleDSEClick}
            className={classes.ButDSE}
          >
           Code Explosion
          </Button>
            </TableCell>
            <TableCell   className={classes.tabhead1} >  <Button
            aria-describedby="simple-popover"
            variant="contained"
           
            className={classes.ButDSE1}
          >
            {props.srcbpgm.value}
            </Button>
           </TableCell>
        <TableCell align="right"  className={classes.tabhead} > 
        <IconButton   
            aria-label="close" 
            align="right"
            className={classes.closeButton} 
            onClick={handleSBClose}
          >
            <CloseIcon />
          </IconButton>
           </TableCell>
          </TableRow>
           
   
    
           
            </Table>
          </TableCell>
            </TableRow>
          </TableHead>
          <TableBody id="abody"> 

          {props.sourceBrowserData.hasOwnProperty('pgmCodeData') ? (
            props.sourceBrowserData.pgmCodeData.map((row, index) => (
              <TableRow key={row.ID} id={`row`+index}
                        
              >
                <TableCell align="right" style={{cursor:"pointer"}} className={classes.ceTab}
                // onClick = {()=>  handleLineClick()}
                >
                <pre style={{display:"inline"}}>{row.LineNum}</pre>
                </TableCell>
                
               {/* <TableCell align="left"
                 style={row.Stn.substr(0,1) === '*' ? {color:"rgb(102, 179, 102)"} :{color:"lightgray"}} 
            className={classes.ceTab}><pre style={{display:"inline"}}>{row.Stn}</pre></TableCell>*/}
                
           {/* {row.Stn.substr(0,1)==='D' && row.Stn.substr(1,1)===' ' ? (
                <TableCell align="left" style={row.Stn.substr(0,1) === '*' ? {color:"rgb(102, 179, 102)"} :{color:"lightgray"}} 
                className={classes.ceTab}><pre id={row.LineNum} className={highlightIndex === index? classes.highExp : ""} style={{display:"inline"}}>
                {row.Stn.substr(0,1)}{row.Stn.substr(1,1)}<span onClick = {(e)=>  handleVariableClick(e)} style={{cursor:"pointer", color:"lightblue"}}>
              
                {row.Stn.substr(2,row.Stn.substr(2).indexOf(' '))}</span>{row.Stn.substr(row.Stn.substr(2).indexOf(' ')+2)}
                </pre></TableCell>):
                (
                  <TableCell align="left" style={row.Stn.substr(1,1) === '*' ? {color:"rgb(102, 179, 102)"} :{color:"lightgray"}} 
                  className={classes.ceTab}><pre id={row.LineNum} className={highlightIndex === index ? classes.highExp : ""} style={{display:"inline"}}>
                  {row.Stn}
                </pre></TableCell>)}*/}

                 {row.Stn.substr(0,1)==='D' && row.Stn.substr(1,1)===' ' ? (
                <TableCell align="left" style={row.Stn.substr(0,1) === '*' ? {color:"#26AC26"} :{color:"#010203"}} 
                className={classes.ceTab}><pre id={row.LineNum} className={highlightIndex === index? classes.highExp : ""} style={{display:"inline"}}>
                {row.Stn.substr(0,1)}{row.Stn.substr(1,1)}<span onClick = {(e)=>  handleVariableClick(e)} className={classes.trExp1} style={{cursor:"pointer", color:"#0000CD"}}>
              
                {row.Stn.substr(2,row.Stn.substr(2).indexOf(' '))}</span>{row.Stn.substr(row.Stn.substr(2).indexOf(' ')+2)}
                </pre></TableCell>):
                row.Stn.substr(0,1)==='C' && row.Stn.substr(1,1)===' '  ? (
                  //console.log("anushkaaa",row.Stn.substr(16,20)),
                  <TableCell align="left" style={row.Stn.substr(0,1) === '*' ? {color:"#26AC26"} :{color:"#010203"}} 
                  className={classes.ceTab}><pre id={row.LineNum} className={highlightIndex === index? classes.highExp : ""} style={{display:"inline"}}>
                {row.Stn.substr(0,1)} <span>
                {highlightStn6(row.Stn.substr(1,25))}  </span>   
                  {highlightStn1(row.Stn.substr(26,60))} 
                  </pre></TableCell>):
                 
                  <TableCell align="left" style={row.Stn.substr(1,1) === '*' ? {color:"#26AC26"} :{color:"#010203"}} 
                  className={classes.ceTab}><pre id={row.LineNum} className={highlightIndex === index ? classes.highExp : ""} style={{display:"inline"}}>
                  {highlightStn7(row.Stn)}
                 </pre></TableCell>
                }
                
                <TableCell align="right" className={classes.ceTab}><pre style={{display:"inline"}}>
                {row.StnDate}
                </pre></TableCell>
              </TableRow>
           )) ) : 
            "" }
            
            
           
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>}
    <div id="DSEdiv" className={classes.DSEdiv3} style={DSEstyle}>
    <TableContainer component={Paper} style={{maxHeight:"600px"}} >
      
      <Table className={classes.tabSB} stickyHeader aria-label="sticky table" >
    
          <TableHead >
            <TableRow>
              <TableCell align="left" width="80%" className={classes.tabhead}>Code Explosion</TableCell>
              <TableCell align="right"  width="20%" className={classes.tabhead}>  <IconButton 
              aria-label="close" 
              className={classes.closeButton} 
              onClick={handleDSEClick}
            >
<CloseIcon /> </IconButton>
              </TableCell>
              </TableRow>
          </TableHead>
          <TableBody> 

          {props.sourceBrowserData.hasOwnProperty('PrcCallsExplosionData') ? (
            props.sourceBrowserData.PrcCallsExplosionData.map((row) => (
              <TableRow key={row.ID}>
                <TableCell colSpan={2} align="left"
                   style={{color:"#010203"}} className={classes.ceTab}><pre style={{display:"inline"}}>{row.STN}</pre></TableCell>
                </TableRow>
           )) ) : 
            "" }
          </TableBody>
        </Table>
      </TableContainer>
    
    </div>

    <div id="Expdiv" className={classes.DSEdiv} style={Expstyle}>
    <TableContainer component={Paper} style={{maxHeight:"600px"}} >
      
      <Table className={classes.tabExp} stickyHeader aria-label="sticky table" >
      <colgroup>
      <col style={{width:'12%'}}/>
      <col style={{width:'68%'}}/>
      <col style={{width:'20%'}}/>
          </colgroup>
          <TableHead >
            <TableRow >
              <TableCell align="left" colSpan={2} className={classes.tabhead}>WhereUsed </TableCell>
              <TableCell align="right" className={classes.tabhead}>
              <IconButton 
              aria-label="close" 
              className={classes.closeButton} 
              onClick={handleExpClose}
            >
              <CloseIcon />
            </IconButton></TableCell>
              </TableRow>
          </TableHead>
          <TableBody> 

          {
            
            ExpData.whereusedData.map((row) => (

                <TableRow key={row.LineNum} onClick = {(e)=>  goToLineClick(e, row)} style={{cursor:"pointer"}} >
                  <TableCell align="left"  className={classes.ceTab}>
                  <pre style={{display:"inline"}}>{row.LineNum}</pre>
                  </TableCell>
                  
                 <TableCell align="left" colspan={2} 
                   style={row.Stn.substr(0,1) === '*' ? {color:"#26AC26"} :{color:"#010203"}} 
            className={classes.ceTab}><pre className={classes.trExp} style={{display:"inline"}}>{highlightStn17(row.Stn)}</pre></TableCell>

            </TableRow>
          
                ))  }
          </TableBody>
        </Table>
      </TableContainer>
    
    </div>
    
    </div>
            )};


export default connect(null, null)(CodeEditor);

