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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { $CombinedState } from "redux";
import $ from 'jquery';
import { stratify } from "d3";


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

 function CodeEditor(props) {
  const { classes } = props;
  console.log("inside codeEditor ===", props);
  const [selectedDSE, setselDSE] = React.useState(0);
  const [ExpData, setExpData] = React.useState({slctd:0, whereusedData:[]});
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  var DSEstyle = selectedDSE === 0 ? {display:"none"}: {display:"block"};
  var Expstyle = ExpData.slctd===0 ? {display:"none"}: {display:"block"};
  function refreshSourceBrowser()  {
    var pgmid=props.sourceBrowserData.pgmID;
    var row = props.sourceBrowserData.rBrowser.find(x=>x.PGMID===pgmid);
    console.log("whats in rooow=",row);
     var arrind = props.sourceBrowserData.pgmCodeData.findIndex(elem=>row.LINENUM ===elem.LineNum);
    console.log("arrind==", arrind);
    var subRtFocus = document.getElementById(`row`+arrind);
    document.getElementById("ceDivC").scrollBy(0, subRtFocus.getBoundingClientRect()['top']-190);
   setHighlightIndex(arrind);
  
  };
  
    function handlerBrowserClickHead(e, row){

      console.log("u clicked==", props.sourceBrowserData.pgmID, row.PGMID);
      if (row.PGMID.trim() !==props.sourceBrowserData.pgmID){
        var item = [
          {
            field: "PGMID",
            text: "",
            value: row.PGMID,
            shortnm:props.sourceBrowserData.rBrowser[0].MVARDB==""?props.sourceBrowserData.rBrowser[0].MVAR:props.sourceBrowserData.rBrowser[0].MVARDB,
          }];
          ////if Explorer window open, close it
          if (ExpData.slctd === 1)
                 handleExpClose(event);
                 setselDSE(0);//close DSE window if open

          props.pgmLinksHandler("pgmSourceBrowser", item);
          
        
       console.log("open another source browser",item);
       }
      // else 
      // {
////////////////////////// 
          console.log("whats in row====", row);        
          var arrind = props.sourceBrowserData.pgmCodeData.findIndex(elem=>row.LINENUM ===elem.LineNum);
        console.log("arrind==", arrind);
        var subRtFocus = document.getElementById(`row`+arrind);
        document.getElementById("ceDivC").scrollBy(0, subRtFocus.getBoundingClientRect()['top']-190);
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
      document.getElementById("ceDivC").scrollBy(0, document.getElementById(`row1`).getBoundingClientRect()['top']-190);
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
        document.getElementById("ceDivC").scrollBy(0, subRtFocus.getBoundingClientRect()['top']-190);
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

function highlightStn(stn){
  
  var opcodes=['/end-free','/free','dow','enddo','DoU', 'EndDo','Select','EndSl','When','ExSr','EndSr','BegSr','Write','endif','if','monitor', 'endmon'];
  
  var result = checkStringInList(opcodes,stn);
  //console.log("result===", result)
  if (stn.substr(0,1)==' ' && result.status){
    
    var ind = stn.indexOf(result.opcode);
    return (<span>{stn.substr(0,ind)}<span style={{color:"#d68ff5"}}>{stn.substr(ind,result.opcode.length+1)}</span>
           {checkforstring(stn.substr(ind+result.opcode.length+1))}</span>)
  }
  else if (stn.substr(0,1)==' ' && stn.includes("//"))
       return <span style={{color:"rgb(102, 179, 102)"}}>{stn}</span>
  else if (stn.substr(0,1)==' ' && stn.includes("'"))
       return checkforstring(stn)     
      
  else     
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
  props.SBCloseHandler();
}

 

  return props.sourceBrowserData.pgmCodeData.length === 0? null : (
    <div id="SBcontainer" className={classes.SBcontainer} style={{height:"100vw", width:"100vw"}}>
    <div className={classes.caption}>
    <div>
        <IconButton 
        aria-label="close" 
        align="left"
        className={classes.closeButton1} 
        onClick={handleSBClose}
      >
        <CloseIcon />
      </IconButton></div>
        <span className={classes.span}>
          Source Browser ({props.sourceBrowserData.program.value})
           
        </span>
      </div>
     <div id="Rmenu" className={classes.Rmenu}>
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
             {/*{props.sourceBrowserData.rBrowser.map((row, index) => (
                <div style={{width:"100%"}}>
                
                 {index==0?<TableRow onClick = {(e)=>  handlerBrowserClickHead(e, row)} style={{cursor:"pointer"}}><TableCell colSpan={2} align="center"  className={classes.ceTab1}><pre  style={{display:"inline"}}>{row.PGMID}</pre></TableCell></TableRow>:(
                   row.PGMID!==props.sourceBrowserData.rBrowser[index-1].PGMID ?<TableRow onClick = {(e)=>  handlerBrowserClickHead(e, row)} style={{cursor:"pointer"}}> <TableCell align="center" colSpan={2} className={classes.ceTab1}><pre  style={{display:"inline"}}>{row.PGMID}</pre></TableCell></TableRow>:""
                 )}
                 <TableRow onClick = {(e)=>  handlerBrowserClickHead(e, row)} style={{cursor:"pointer"}}>
                    <TableCell align="left"  className={classes.ceTab}>
                    <pre style={{display:"inline"}}>{row.LINENUM}</pre>
                    </TableCell>
                    <TableCell align="left" className={classes.ceTab}>
                    <pre className={classes.trExp} style={{display:"inline"}}>{row.STN}</pre></TableCell>
                 </TableRow> </div>))  }*/}
            </TableBody>
          </Table>
        </TableContainer>
     </div>


      <div id='ceDiv' className={classes.ceDiv}>
     
      <TableContainer id='ceDivC' component={Paper} style={{maxHeight:"700px"}}>
      
      <Table className={classes.tabSB} stickyHeader aria-label="sticky table">
    <colgroup>
      <col style={{width:'10%'}}/>
      <col style={{width:'70%'}}/>
      <col style={{width:'20%'}}/>
          </colgroup>
          <TableHead >
         {/* <TableRow>
              <TableCell align="center" colSpan={3}>{props.ForProgram[0].value}</TableCell>
          </TableRow>*/}
            <TableRow>
            <TableCell align="left" colSpan={3} className={classes.tabhead}>
            <Button
            aria-describedby="simple-popover"
            variant="contained"
            color="primary"
            onClick={handleDSEClick}
            className={classes.ButDSE}
          >
            Draw Subroutine Explosion
          </Button>
            </TableCell>
          </TableRow>
           
   
    
            <TableRow>
              <TableCell className={classes.tabhead}>No.</TableCell>
              <TableCell className={classes.tabhead} align="center">Statement</TableCell>
              <TableCell className={classes.tabhead} align="center">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody> 

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
                <TableCell align="left" style={row.Stn.substr(0,1) === '*' ? {color:"rgb(102, 179, 102)"} :{color:"lightgray"}} 
                className={classes.ceTab}><pre id={row.LineNum} className={highlightIndex === index? classes.highExp : ""} style={{display:"inline"}}>
                {row.Stn.substr(0,1)}{row.Stn.substr(1,1)}<span onClick = {(e)=>  handleVariableClick(e)} style={{cursor:"pointer", color:"lightblue"}}>
              
                {row.Stn.substr(2,row.Stn.substr(2).indexOf(' '))}</span>{row.Stn.substr(row.Stn.substr(2).indexOf(' ')+2)}
                </pre></TableCell>):
                (
                 
                  <TableCell align="left" style={row.Stn.substr(1,1) === '*' ? {color:"rgb(102, 179, 102)"} :{color:"lightgray"}} 
                  className={classes.ceTab}><pre id={row.LineNum} className={highlightIndex === index ? classes.highExp : ""} style={{display:"inline"}}>
                  {highlightStn(row.Stn)}
                </pre></TableCell>)}
                
                <TableCell align="right" className={classes.ceTab}><pre style={{display:"inline"}}>
                {row.StnDate}
                </pre></TableCell>
              </TableRow>
           )) ) : 
            "" }
            
            
           
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>
    <div id="DSEdiv" className={classes.DSEdiv} style={DSEstyle}>
    <TableContainer component={Paper} style={{maxHeight:"700px"}}>
      
      <Table className={classes.tabSB} stickyHeader aria-label="sticky table" >
    
          <TableHead >
            <TableRow>
              <TableCell align="left" width="80%" className={classes.tabhead}>Draw SubRoutine Explosion</TableCell>
              <TableCell align="right" width="20%" className={classes.tabhead}>
              <IconButton 
              aria-label="close" 
              className={classes.closeButton} 
              onClick={handleDSEClick}
            >
              <CloseIcon />
            </IconButton></TableCell>
              </TableRow>
          </TableHead>
          <TableBody> 

          {props.sourceBrowserData.hasOwnProperty('PrcCallsExplosionData') ? (
            props.sourceBrowserData.PrcCallsExplosionData.map((row) => (
              <TableRow key={row.ID}>
                <TableCell colSpan={2} align="left"
                   style={{color:"lightgray"}} className={classes.ceTab}><pre style={{display:"inline"}}>{row.STN}</pre></TableCell>
                </TableRow>
           )) ) : 
            "" }
          </TableBody>
        </Table>
      </TableContainer>
    
    </div>

    <div id="Expdiv" className={classes.DSEdiv} style={Expstyle}>
    <TableContainer component={Paper} style={{maxHeight:"700px"}}>
      
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
                   style={row.Stn.substr(0,1) === '*' ? {color:"rgb(102, 179, 102)"} :{color:"lightgray"}} 
            className={classes.ceTab}><pre className={classes.trExp} style={{display:"inline"}}>{row.Stn}</pre></TableCell>

            </TableRow>
          
                ))  }
          </TableBody>
        </Table>
      </TableContainer>
    
    </div>
    
    </div>
            )};


export default connect(null, null)(CodeEditor);
