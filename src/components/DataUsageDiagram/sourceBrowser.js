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
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
//import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import PropTypes from 'prop-types';
import { BorderLeft } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;
  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);
  const icon = iconProp || expansionIcon || displayIcon;
  const handleMouseDown = (event) => {
    preventSelection(event);
  };
  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };
  const handleSelectionClick = (event) => {
    handleSelection(event);
  };
  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component='div'
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});
CustomContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  displayIcon: PropTypes.node,
  expansionIcon: PropTypes.node,
  icon: PropTypes.node,
  label: PropTypes.node,
  nodeId: PropTypes.string.isRequired,
};
const CustomTreeItem = (props) => (
  <TreeItem ContentComponent={CustomContent} {...props} />
);
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  noBorder: {
    border: 'none',
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
  var codeExplosionDataStart = [];
  var codeExplosionJson = {};
  var expandedJsonCheckObject = {};
  console.log('codeeditor props', props);
  
  

  useEffect(() => {
    scrollceDiv()  //to scroll sb window to particular line
   
  //},[props.sourceBrowserData.pgmCodeData,props.srcbpgm]);
   },[props.srcbpgm]);
  function scrollceDiv(){
   
    if(props.srcbpgm.linenum!=''){
    if(props.sourceBrowserData.pgmCodeData.length!=0){
      $('#ceDivC').scrollTop(0)
       var arrind = props.sourceBrowserData.pgmCodeData.findIndex(elem=>props.srcbpgm.linenum ===elem.LineNum);
       console.log("arrind==", arrind);
       if(arrind !=-1){
         var subRtFocus = document.getElementById(`row`+arrind);
        
         var otop = Math.abs($(`#row${arrind}`).offset().top );
        
         var divTop =  Math.abs($(`#ceDivC`).offset().top ) 
      
         setHighlightIndex(arrind);
           
          $('#ceDivC').animate(
            { scrollTop: otop- divTop - 50 },
            {
              duration: 1000,
              complete: () => {
              },
            },
          );
          
         
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
  const ceDivleftpos =
    selectedDSE == 0 && ExpData.slctd == 0
      ? {
          left: props.srcbpgm.offsetLeft + 'px',
          width: '700px',
          top: props.srcbpgm.offsetTop,
        }
      : {
          left: props.srcbpgm.offsetLeft + 'px',
          width: '700px',
          top: props.srcbpgm.offsetTop,
        };
  
  console.log("inside codeEditor ===", props);
  const [selectedDSE, setselDSE] = React.useState(0);
  const [ExpData, setExpData] = React.useState({slctd:0, whereusedData:[]});
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  //var DSEstyle = selectedDSE === 0 ? {display:"none"}: {display:"block", top:props.srcbpgm.offset,left : window.screen.width - 450 + "px"}; //shilpi
  //left : window.screen.width - 10 + "px"
  var DSEstyle =
    selectedDSE === 0
      ? { display: 'none' }
      : {
          display: 'block',
          top: props.srcbpgm.offsetTop,
          left: props.srcbpgm.offsetLeft + 750 + 'px',
        }; //shilpi
  var Expstyle =
    ExpData.slctd === 0
      ? { display: 'none' }
      : {
          display: 'block',
          top: props.srcbpgm.offsetTop,
          left: props.srcbpgm.offsetLeft + 750 + 'px',
          width: '600px',
          height: '600px',
        }; //shilpi
  function refreshSourceBrowser()  {
    var pgmid=props.sourceBrowserData.pgmID;
    var row = props.sourceBrowserData.rBrowser.find((x) => x.PGMID === pgmid);
    console.log('whats in rooow=', row);
    var arrind = props.sourceBrowserData.pgmCodeData.findIndex(
      (elem) => row.LINENUM === elem.LineNum
    );
    console.log('arrind==', arrind);
    var subRtFocus = document.getElementById(`row`+arrind);
    document
      .getElementById('ceDivC')
      .scrollBy(0, subRtFocus.getBoundingClientRect()['top'] - arrind + 50); //changed 190 to 230 anushka
   setHighlightIndex(arrind);
  
  }
  
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
    $(`#ceDivC`).scrollTop(0);
    console.log('u clicked ', elem);
    var lineno, arrind;
    if (elem.hasOwnProperty('LINENUM')) lineno = elem.LINENUM;
    else if (elem.hasOwnProperty('LineNum')) lineno = elem.LineNum;
    arrind = props.sourceBrowserData.pgmCodeData.findIndex(
      (row) => row.LineNum === lineno
    );
    console.log(arrind, lineno);
    // var subRtFocus = document.getElementById(`row` + arrind);
    //   .scrollBy(0, subRtFocus.getBoundingClientRect()['top'] - arrind + 50); //changed 190 to 230 anushka
    var rowtop = $(`#row${arrind}`).offset().top;
    var divtop = $(`#ceDivC`).offset().top;
    $(`#ceDivC`).scrollTop(rowtop - divtop - 50);
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
    var res = stn.split(' ');
 var arr=[];
    var s = [];
    var f = 0;
for(var i=0; i<res.length;i++){
      if (res[i].length == 0) {
        arr.push(' ');
        continue;
    }
      if (res[i] === undefined) {
        arr.push(res[i]);
      } else if (
        !res[i].includes('(') &&
        !res[i].includes(')') &&
        !res[i].includes("'") &&
        isNaN(res[i]) &&
        !res[i].includes('Not') &&
        !res[i].includes('AND') &&
        !res[i].includes('And') &&
        !res[i].includes('=') &&
        !res[i].includes('<>') &&
        !res[i].includes('>=') &&
        !res[i].includes('<=') &&
        !res[i].includes('+')
      ) {
        arr.push(
          <span
            onClick={(e) => handleVariableClick(e)}
            className={classes.trExp1}
            style={{ cursor: 'pointer' }}
          >
            {res[i]}
          </span>
        );
        arr.push(' ');
      } else if (res[i].includes('(') || res[i].includes(')')) {
        arr.push(checkforF(res[i]));
        arr.push(' ');
}
      // else if (res[i].includes('(') || res[i].includes(')')) {
      //   arr.push(checkforF(res[i]));
      //   arr.push(<span style={{ color: '#9400D3' }}>{res[i]}</span>);
      //   arr.push(' ');
      // }
else {
        arr.push(<span>{res[i]}</span>);
        arr.push(' ');
}
}
    return <span>{arr}</span>;
}
function highlightStn6(stn){
    var res = stn.split(' ');
 var arr=[];
    var s = [];
    var f = 0,
      c = 0;
for(var i=0; i<res.length;i++){
      if (res[i].length == 0) {
        arr.push(' ');
        continue;
    }
      if (res[i] === undefined) {
        arr.push(res[i]);
      } else if (
        res[i].length != 0 &&
        res[i] != undefined &&
        i != 19 &&
        i != 15 &&
        i != 13
      ) {
    if(f==0){
          arr.push(
            <span
              onClick={(e) => handleVariableClick(e)}
              className={classes.trExp1}
              style={{ cursor: 'pointer' }}
            >
              {res[i]}
            </span>
          );
          arr.push(' ');
   f=1;
        } else if (f == 1) {
          arr.push(checkforV(res[i]));
          arr.push(' ');
    }
      } else {
        arr.push(checkforV(res[i]));
        arr.push(' ');
    }
    }
    return <span>{arr}</span>;
  }
  function checkforF2(res) {
    var arr = [];
    if (res.includes('(:')) {
      var string = res;
      var i = string.indexOf(':');
      var redText = string.substring(0, i);
      var leftOutV = string.substring(i + 1, string.length);
      arr.push(<span className={classes.trExp2}>{redText}</span>);
      arr.push(<span className={classes.trExp4Trial}>{':'}</span>);
      if (!leftOutV.includes(','))
        arr.push(
          <span
            className={classes.trExp3}
            onClick={(e) => handleVariableClick(e)}
            style={{ cursor: 'pointer' }}
          >
            {leftOutV}
          </span>
        );
else {
        arr.push(
          <span
            className={classes.trExp3}
            onClick={(e) => handleVariableClick(e)}
            style={{ cursor: 'pointer' }}
          >
            {leftOutV.substring(0, leftOutV.length - 1)}
          </span>
        );
        arr.push(<span className={classes.trExp4Trial}>{','}</span>);
      }
    } else if (res.includes(')')) {
      var string = res;
      var j = string.indexOf(')');
      var leftOutV = string.substring(0, j);
      if (!leftOutV.includes(':'))
        arr.push(
          <span
            className={classes.trExp3}
            onClick={(e) => handleVariableClick(e)}
            style={{ cursor: 'pointer' }}
          >
            {leftOutV}
          </span>
        );
      else {
        arr.push(<span className={classes.trExp4Trial}>{':'}</span>);
        arr.push(
          <span
            className={classes.trExp3}
            onClick={(e) => handleVariableClick(e)}
            style={{ cursor: 'pointer' }}
          >
            {leftOutV.substring(1, leftOutV.length)}
          </span>
        );
}
      arr.push(
        <span className={classes.trExp2}>
          {string.substring(j, string.length)}
        </span>
      );
}
    return arr;
}
function checkforF(res){
    var arr = [];
    if (res.includes('=') && res.includes('(') && res.includes(')')) {
      var i = res.indexOf('=');
      var variable = res.substring(0, i);
      arr.push(
        <span
          onClick={(e) => handleVariableClick(e)}
          className={classes.trExp3}
          style={{ cursor: 'pointer' }}
        >
          {variable}
        </span>
      );
      arr.push(<span className={classes.trExp4Trial}>{'='}</span>);
      res = res.substring(i + 1, res.length);
    }
    if (res.includes('(') || res.includes(')')) {
    var string = res; 
      var i,
        j,
        redText,
        flag1 = 0,
        flag2 = 0;
      if (res.includes('(') && res.includes(')')) {
        i = string.indexOf('(');
        j = string.lastIndexOf(')') + 1;
        redText = string.substring(i + 1, j - 1);
      } else if (res.includes('(') && !res.includes(')')) {
        i = string.indexOf('(');
        j = string.length;
        redText = string.substring(i + 1);
        flag1 = 1;
      } else if (!res.includes('(') && res.includes(')')) {
        i = 0;
        j = string.indexOf(')');
        redText = string.substring(0, j);
        flag2 = 1;
  }
      var tempArr = undefined;
      var st = [];
      var comma = 0;
      if (redText.includes(':')) {
        tempArr = redText.split(':');
        tempArr.map((de) => {
          if (de.includes(',')) {
            comma = 1;
          }
          st.push(
            <span
              onClick={(e) => handleVariableClick(e)}
              className={classes.trExp3}
              style={{ cursor: 'pointer' }}
            >
              {comma ? de.substring(0, de.length - 1) : de}
            </span>
          );
          if (comma)
            st.push(<span className={classes.trExp4Trial}>{','}</span>);
          st.push(<span className={classes.trExp4Trial}>{':'}</span>);
        });
        st.pop();
        if (comma && flag1 == 0 && flag2 == 0) st.pop();
        if (comma && flag1 == 0 && flag2 == 1) st.pop();
      }
      arr.push(
        <span
          className={
            res.substr(0, 1) == '%' ? classes.trExp4Trial : classes.trExp2
          }
        >
          <span
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleVariableClick(e)}
          >
            {string.substring(0, i)}
          </span>
          {flag1 == 0 && flag2 == 0 ? '(' : flag1 == 1 && flag2 == 0 ? '(' : ''}
          <span
            onClick={(e) => handleVariableClick(e)}
            className={classes.trExp3}
            style={{ cursor: 'pointer' }}
          >
            {tempArr === undefined ? redText : st}
          </span>
          {flag1 == 0 && flag2 == 0 ? ')' : flag1 == 0 && flag2 == 1 ? ')' : ''}
          {string.substring(j + 1)}
        </span>
      );
    }
return arr;
}
  function checkforblock(res) {
    if (
      res.toUpperCase() == 'AND' ||
      res.toUpperCase() == 'DO' ||
      res.toUpperCase() == 'DOU' ||
      res.toUpperCase() == 'DOW' ||
      res.toUpperCase() == 'ELSE' ||
      res.toUpperCase() == 'ELSEIF' ||
      res.toUpperCase() == 'FOR' ||
      res.toUpperCase() == 'FOR-EACH' ||
      res.toUpperCase() == 'IF' ||
      res.toUpperCase() == 'ITER' ||
      res.toUpperCase() == 'LEAVE' ||
      res.toUpperCase() == 'OR' ||
      res.toUpperCase() == 'OTHER' ||
      res.toUpperCase() == 'SELECT' ||
      res.toUpperCase() == 'WHEN' ||
      res.toUpperCase() == 'GOTO' ||
      res.toUpperCase() == 'MONITOR' ||
      res.toUpperCase() == 'JOIN' ||
      res.toUpperCase() == 'WHERE' ||
      res.toUpperCase() == 'ON' ||
      res.toUpperCase() == 'IN' ||
      res.toUpperCase() == 'OREQ' ||
      res.toUpperCase() == 'ANDNE' ||
      res.toUpperCase().includes('END') ||
      res.toUpperCase().includes('IF') ||
      res.toUpperCase().includes('DOU') ||
      res.toUpperCase().includes('DOW') ||
      res.toUpperCase().includes('WHEN') ||
      res.toUpperCase().includes('ELSE') ||
      res.toUpperCase().includes('WHERE') ||
      res.toUpperCase().includes('SELECT')
    )
      return true;
    return false;
  }
  function checkforio(res) {
    if (
      res.toUpperCase().includes('ACQ') ||
      res.toUpperCase().includes('CHAIN') ||
      res.toUpperCase().includes('CLOSE') ||
      res.toUpperCase().includes('COMMIT') ||
      res.toUpperCase().includes('DELETE') ||
      res.toUpperCase().includes('EXCEPT') ||
      res.toUpperCase().includes('EXFMT') ||
      res.toUpperCase().includes('FEOD') ||
      res.toUpperCase().includes('FORCE') ||
      res.toUpperCase().includes('NEXT') ||
      res.toUpperCase().includes('OPEN') ||
      res.toUpperCase().includes('POST') ||
      res.toUpperCase().includes('READ') ||
      res.toUpperCase().includes('REL') ||
      res.toUpperCase().includes('ROLBK') ||
      res.toUpperCase().includes('SETGT') ||
      res.toUpperCase().includes('SETLL') ||
      res.toUpperCase().includes('UNLOCK') ||
      res.toUpperCase().includes('UPDATE') ||
      res.toUpperCase().includes('WRITE')
    )
      return true;
    return false;
  }
  function chekforcall(res) {
    if (
      res.toUpperCase().includes('CALL') ||
      res.toUpperCase().includes('EXSR')
    )
      return true;
    return false;
  }
function checkforV(res){
  var arr;
    if (res === undefined) {
    arr=res;
    } else if (checkforblock(res)) {
      arr = <span style={{ color: '#9400D3' }}>{res}</span>;
    } else if (chekforcall(res)) {
      arr = <span style={{ color: '#FF4500' }}>{res}</span>;
    } else if (checkforio(res)) {
      arr = <span style={{ color: '#964B00' }}>{res}</span>;
    } else {
      arr = <span style={{ color: '#010203' }}>{res}</span>;
}
return arr;
}
function highlightStn7(stn){ 
  var arr=[];
    if (
      stn.includes('//') ||
      stn.includes('**') ||
      stn.substr(0, 2).includes('*')
    ) {
      arr.push(stn);
      return <span style={{ color: '#26AC26' }}>{arr}</span>;
 
    } else {
      var res = stn.split(' ');
      var s = [];
      var f = 0;
for(var i=0; i<res.length;i++){
        // var opcodes = [
        //var result = checkStringInList(opcodes, res[i]);
        if (res[i].length == 0) {
          arr.push(' ');
          continue;
    }
        if (res[i] === undefined) {
          arr.push(res[i]);
        } else if (checkforblock(res[i])) {
          arr.push(<span style={{ color: '#9400D3' }}>{res[i]}</span>);
          arr.push(' ');
        } else if (chekforcall(res[i])) {
          arr.push(<span style={{ color: '#FF4500' }}>{res[i]}</span>);
          arr.push(' ');
        } else if (checkforio(res[i])) {
          arr.push(<span style={{ color: '#964B00' }}>{res[i]}</span>);
          arr.push(' ');
        } else if (
          !res[i].includes('(') &&
          !res[i].includes(')') &&
          !res[i].includes("'") &&
          !res[i].includes('CallP') &&
          !res[i].includes('Close') &&
          !res[i].includes('/copy') &&
          !res[i].includes('SetLL') &&
          isNaN(res[i]) &&
          !res[i].includes('Not') &&
          !res[i].includes('AND') &&
          res[i].length > 2 &&
          !res[i].includes('and') &&
          !res[i].includes('clear') &&
          !res[i].includes('CLEAR') &&
          !res[i].includes('And') &&
          !res[i].includes('=') &&
          !res[i].includes('<>') &&
          !res[i].includes('>=') &&
          !res[i].includes('<=') &&
          !res[i].includes('+')
        ) {
          if (!res[i].includes(':'))
            arr.push(
              <span
                onClick={(e) => handleVariableClick(e)}
                className={classes.trExp1}
                style={{ cursor: 'pointer' }}
              >
                {res[i]}
              </span>
            );
          else {
            var st = '';
            var f = 0,
              f1 = 0;
            for (var j = 0; j < res[i].length; j++) {
              if (res[i][j] == ':') {
                if (j == 0)
                  arr.push(<span className={classes.trExp4Trial}>{':'}</span>);
                else if (j == res[i].length - 1) f = 1;
              } else if (res[i][j] == ',') {
                f1 = 1;
              } else st = st + res[i][j];
    }
            arr.push(
              <span
                className={classes.trExp3}
                onClick={(e) => handleVariableClick(e)}
                style={{ cursor: 'pointer' }}
              >
                {st}
              </span>
            );
            if (f == 1 && f1 == 0)
              arr.push(<span className={classes.trExp4Trial}>{':'}</span>);
            else if (f1 == 1 && f == 0)
              arr.push(<span className={classes.trExp4Trial}>{','}</span>);
            else {
              arr.push(<span className={classes.trExp4Trial}>{','}</span>);
              arr.push(<span className={classes.trExp4Trial}>{':'}</span>);
}
}
          arr.push(' ');
        } else if (res[i].includes('(') || res[i].includes(')')) {
          arr.push(checkforF(res[i]));
          arr.push(' ');
}
else {
          arr.push(<span>{res[i]}</span>);
          arr.push(' ');
}
}
} 
    return <span>{arr}</span>;
}
  function testingStn(stn) {
  var arr=[];
    var splittedString = stn.split(' ');
    var onlyTextElements = splittedString.filter((e) => e);
    var tempIndex = 0;
    splittedString.map((de, index) => {
      if (tempIndex >= onlyTextElements.length) return;
      var wordInFocus = onlyTextElements[tempIndex];
      if (de == '') arr.push(' ');
      else if (
        de != '' &&
        (wordInFocus.substr(0, 2) == 'D*' ||
          wordInFocus.substr(0, 2) == 'd*' ||
          wordInFocus.substr(0, 2) === 'f*' ||
          wordInFocus.substr(0, 2) === 'F*')
      ) {
        arr.push(stn);
        return <span>{arr}</span>;
      } else if (
        de != '' &&
        (wordInFocus == 'd' ||
          wordInFocus == 'D' ||
          wordInFocus === 'f' ||
          wordInFocus === 'F')
      ) {
        arr.push(wordInFocus);
        arr.push(' ');
        tempIndex += 1;
      } else if (de != '' && wordInFocus.includes('(')) {
        var ind = wordInFocus.indexOf('(');
        var len = wordInFocus.length;
        var st = '';
        for (var i = ind; i < len; i++) {
          if (wordInFocus[i] != '(' && wordInFocus[i] != ')')
            st += wordInFocus[i];
        }
        arr.push(<span>{wordInFocus.substr(0, ind + 1)}</span>);
        if (st.includes(':')) {
          var twoVar = st.split(':');
          arr.push(
            <span
              onClick={(e) => handleVariableClick(e)}
              className={classes.trExp1}
              style={{ cursor: 'pointer' }}
            >
              {twoVar[0]}
            </span>
          );
          arr.push(<span>{':'}</span>);
          arr.push(
            <span
              onClick={(e) => handleVariableClick(e)}
              className={classes.trExp1}
              style={{ cursor: 'pointer' }}
            >
              {twoVar[1]}
            </span>
          );
        } else {
          arr.push(
            <span
              onClick={(e) => handleVariableClick(e)}
              className={classes.trExp1}
              style={{ cursor: 'pointer' }}
            >
              {st}
            </span>
          );
        }
        if (wordInFocus.includes(')')) arr.push(') ');
        tempIndex += 1;
      } else if (de != '' && wordInFocus.length > 1 && tempIndex == 0) {
        arr.push(<span>{wordInFocus.substr(0, 1)}</span>);
        if (!wordInFocus.includes('...')) {
          if (
            (wordInFocus.substr(0, 1) === 'f' ||
              wordInFocus.substr(0, 1) === 'F') &&
            wordInFocus.length > 11
          ) {
            arr.push(
              <span
                onClick={(e) => handleVariableClick(e)}
                className={classes.trExp1}
                style={{ cursor: 'pointer' }}
              >
                {wordInFocus.substr(1, 10)}
              </span>
            );
            arr.push(<span>{wordInFocus.substr(11)}</span>);
          } else {
            arr.push(
              <span
                onClick={(e) => handleVariableClick(e)}
                className={classes.trExp1}
                style={{ cursor: 'pointer' }}
              >
                {wordInFocus.substr(1)}
              </span>
            );
          }
          arr.push(' ');
        } else {
  {
            arr.push(
              <span
                onClick={(e) => handleVariableClick(e)}
                className={classes.trExp1}
                style={{ cursor: 'pointer' }}
              >
                {wordInFocus.substr(1, wordInFocus.length - 3)}
              </span>
            );
            arr.push(<span>{'...'}</span>);
            arr.push(' ');
  }
        }
        tempIndex += 1;
      } else if (de != '' && tempIndex == 1 && wordInFocus.length > 2) {
        if (!wordInFocus.includes('...'))
          arr.push(
            <span
              onClick={(e) => handleVariableClick(e)}
              className={classes.trExp1}
              style={{ cursor: 'pointer' }}
            >
              {wordInFocus}
            </span>
          );
  else{
          arr.push(
            <span
              onClick={(e) => handleVariableClick(e)}
              className={classes.trExp1}
              style={{ cursor: 'pointer' }}
            >
              {wordInFocus.substr(0, wordInFocus.length - 3)}
            </span>
          );
          arr.push(<span>{'...'}</span>);
        }
        arr.push(' ');
        tempIndex += 1;
      } else if (de != '' && !wordInFocus.includes('(')) {
        arr.push(<span>{wordInFocus}</span>);
        arr.push(' ');
        tempIndex += 1;
      }
    });
    return <span>{arr}</span>;
  }
  function highlightStn17(stn) {
    var arr = [];
    if (
      stn.includes('//') ||
      stn.includes('**') ||
      stn.substr(0, 2).includes('*')
    ) {
      arr.push(stn);
      return <span style={{ color: '#26AC26' }}>{arr}</span>;
    } else {
      var res = stn.split(' ');
      var s = [];
      var f = 0;
for(var i=0; i<res.length;i++){
        var opcodes = [
          '/end-free',
          '/END-FREE',
          '/free',
          '/End-Free',
          '/Free',
          'dow',
          'enddo',
          'DoU',
          'EndDo',
          'Select',
          'When',
          'ExSr',
          'Else',
          'BegSr',
          'Write',
          'endif',
          'if',
          'EndIf',
          'If',
          'monitor',
          'endmon',
          'ENDMON',
          'DoW',
          'Clear',
        ];
  var result = checkStringInList(opcodes,res[i]);
        if (res[i].length == 0) {
          arr.push(' ');
          continue;
    }
        if (res[i] === undefined) {
          arr.push(res[i]);
        } else if (result.status) {
          arr.push(<span style={{ color: '#9400D3' }}>{res[i]}</span>);
          arr.push(' ');
        } else if (
          !res[i].includes('(') &&
          !res[i].includes(')') &&
          !res[i].includes("'") &&
          !res[i].includes('CallP') &&
          !res[i].includes('Close') &&
          !res[i].includes('/copy') &&
          !res[i].includes('SetLL') &&
          isNaN(res[i]) &&
          !res[i].includes('Not') &&
          !res[i].includes('AND') &&
          res[i].length > 2 &&
          !res[i].includes('and') &&
          !res[i].includes('clear') &&
          !res[i].includes('CLEAR') &&
          !res[i].includes('And') &&
          !res[i].includes('=') &&
          !res[i].includes('<>') &&
          !res[i].includes('>=') &&
          !res[i].includes('<=') &&
          !res[i].includes('+')
        ) {
          arr.push(<span className={classes.trExp1}>{res[i]}</span>);
          arr.push(' ');
        } else if (res[i].includes('(') && res[i].includes(')')) {
          arr.push(checkforF(res[i]));
          arr.push(' ');
        } else if (
          res[i] === '=' ||
          res[i] === '<>' ||
          res[i] === '>=' ||
          res[i] === '<=' ||
          res[i] === '+'
        ) {
          arr.push(<span style={{ color: '#9400D3' }}>{res[i]}</span>);
          arr.push(' ');
        } else {
          arr.push(<span>{res[i]}</span>);
          arr.push(' ');
}
}
}
    return <span>{arr}</span>;
}
function highlightStn(stn){
    var opcodes = [
      '/end-free',
      '/free',
      'dow',
      'enddo',
      'DoU',
      'EndDo',
      'Select',
      'When',
      'ExSr',
      'BegSr',
      'Write',
      'endif',
      'if',
      'EndIf',
      'If',
      'monitor',
      'endmon',
    ];
  
  var result = checkStringInList(opcodes,stn);
  //console.log("result===", result)
  if (stn.substr(0,1)==' ' && result.status){
    
    var ind = stn.indexOf(result.opcode);
      return (
        <span>
          {stn.substr(0, ind)}
          <span style={{ color: '#9400D3' }}>
            {stn.substr(ind, result.opcode.length + 1)}
          </span>
          {checkforstring(stn.substr(ind + result.opcode.length + 1))}
        </span>
      );
  }
    if (
      (stn.substr(0, 1) == ' ' && stn.includes('//')) ||
      stn.substr(0, 2) == '*'
    )
      return <span style={{ color: '#26AC26' }}>{stn}</span>;
  if (stn.substr(0,1)==' ' && stn.includes("'"))
      return checkforstring(stn);
      
    return <span>{stn}</span>;

}
  function checkforstring(stn) {
  
    if (stn.includes("'")) {
    var sind = stn.indexOf("'");
    var eind = stn.substr(sind+1).indexOf("'")+1;

      return (
        <span>
          {stn.substr(0, sind)}
          <span style={{ color: '#f19947' }}>{stn.substr(sind, eind + 1)}</span>
          {stn.substr(sind + eind + 1)}
        </span>
      );
    } else return <span>{stn}</span>;
//
}
function handleSBClose(){
  console.log('in handleSBClose')
  //props.setSourceBrowser({field:"", value:"", text:"", shortnm:""});
  //props.srcbpgm = {linenum:"", value:"", text:"", shortnm:""}
  props.setLoad({linenum:"0", value:"", text:"", shortnm:""})
}
  function testingRecursion(obj) {
    return (
      <TreeItem
        nodeId={obj.NODEID}
        style={{ width: '100%', display: 'inline' }}
        className={classes.treeViewClass}
        // onClick={(event) => {
        //   event.preventDefault();
        // }}
        label={
          <pre
            style={{ display: 'block' }}
            // onClick={(e) => goToLineClick(e, obj)}
            //id={obj.LINENUM}
          >
            {obj.STN.trim()}
          </pre>
        }
      >
        {codeExplosionJson.hasOwnProperty(obj.INVPRNM)
          ? codeExplosionJson[obj.INVPRNM].map((zz) => {
              return testingRecursion(zz);
            })
          : ''}
      </TreeItem>
    );
  }
  var codeexplosioncountervariable = 0;
  function handleCodeExplosion() {
    var tempArray = props.sourceBrowserData.PrcCallsExplosionData;
    tempArray.map((data) => {
      var st = data.CURPRNM.trim();
      var st2 = data.INVPRNM.trim();
      var string = data.STN;
      if (
        (string[0].toUpperCase() == 'C' && string[1] == ' ') ||
        (string[0].toUpperCase() == 'D' && string[1] == ' ') ||
        (string[0].toUpperCase() == 'F' && string[1] == ' ') ||
        (string[0].toUpperCase() == 'P' && string[1] == ' ')
      ) {
        string = string.substring(1);
}
      if (string.includes('|')) {
        var i = string.indexOf('|');
        string = string.substring(0, i);
      }
      data.STN = string.trim();
      if (st == '') {
        data.NODEID = `${codeexplosioncountervariable}`;
        codeExplosionDataStart.push(data);
        if (!expandedJsonCheckObject.hasOwnProperty(st2))
          expandedJsonCheckObject[st2] = `${codeexplosioncountervariable}`;
        codeexplosioncountervariable += 1;
      }
    });
    tempArray.map((data) => {
      var st = data.CURPRNM.trim();
      var st2 = data.INVPRNM.trim();
      if (st !== '') {
        data.NODEID = `${codeexplosioncountervariable}`;
        if (codeExplosionJson.hasOwnProperty(st)) {
          codeExplosionJson[st].push(data);
        } else codeExplosionJson[st] = [data];
        if (!expandedJsonCheckObject.hasOwnProperty(st2))
          expandedJsonCheckObject[st2] = `${codeexplosioncountervariable}`;
        codeexplosioncountervariable += 1;
      }
    });

    return true;
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

      {props.sourceBrowserData.pgmCodeData.length === 0 ? null : (
      <div id='ceDiv' className={classes.ceDiv} style={ceDivleftpos} >
          <TableContainer
            id='ceDivC'
            component={Paper}
            style={{ maxHeight: '700px', backgroundColor: '#f5f5f5' }}
          >
            <Table
              className={classes.tabSB}
              stickyHeader
              aria-label='sticky table'
            >
    <colgroup>
      <col style={{width:'10%'}}/>
      <col style={{width:'70%'}}/>
      <col style={{width:'20%'}}/>
                {/*   <col style={{ width: '20%' }} />*/}
          </colgroup>
          <TableHead >
        
            <TableRow>
                  <TableCell style={{ padding: '0' }} colSpan={4}>
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
                        <TableCell className={classes.tabhead1}>
                          {' '}
                          <Button
                            aria-describedby='simple-popover'
                            variant='contained'
           
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
              <TableBody id='abody'>

                {props.sourceBrowserData.hasOwnProperty('pgmCodeData')
                  ? props.sourceBrowserData.pgmCodeData.map((row, index) => (
                      <TableRow key={row.ID} id={`row` + index}>
                        <TableCell
                          align='right'
                          style={{ cursor: 'pointer' }}
                          className={classes.ceTab}
                // onClick = {()=>  handleLineClick()}
                >
                          <pre style={{ display: 'inline' }}>{row.LineNum}</pre>
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

                        {row.Stn.substr(0, 1) === 'D' ||
                        row.Stn.substr(0, 1) === 'd' ||
                        row.Stn.substr(0, 1) === 'f' ||
                        row.Stn.substr(0, 1) === 'F' ? (
                          <TableCell
                            align='left'
                            style={
                              row.Stn.substr(1, 1) === '*'
                                ? { color: '#26AC26' }
                                : { color: '#010203' }
                            }
                            className={classes.ceTab}
                          >
                            <pre
                              id={row.LineNum}
                              className={
                                highlightIndex === index ? classes.highExp : ''
                              }
                              style={{ display: 'inline' }}
                            >
                              {testingStn(row.Stn)}
                            </pre>
                          </TableCell>
                        ) : row.Stn.substr(0, 1) === 'C' &&
                          row.Stn.substr(1, 1) === ' ' ? (
                  //console.log("anushkaaa",row.Stn.substr(16,20)),
                          <TableCell
                            align='left'
                            style={
                              row.Stn.substr(0, 1) === '*'
                                ? { color: '#26AC26' }
                                : { color: '#010203' }
                            }
                            className={classes.ceTab}
                          >
                            <pre
                              id={row.LineNum}
                              className={
                                highlightIndex === index ? classes.highExp : ''
                              }
                              style={{ display: 'inline' }}
                            >
                              {row.Stn.substr(0, 1)}{' '}
                              <span>
                                {highlightStn6(row.Stn.substr(1, 25))}{' '}
                              </span>
                  {highlightStn1(row.Stn.substr(26,60))} 
                            </pre>
                          </TableCell>
                        ) : (
                          <TableCell
                            align='left'
                            style={
                              row.Stn.substr(1, 1) === '*'
                                ? { color: '#26AC26' }
                                : { color: '#010203' }
                            }
                            className={classes.ceTab}
                          >
                            <pre
                              id={row.LineNum}
                              className={
                                highlightIndex === index ? classes.highExp : ''
                              }
                              style={{ display: 'inline' }}
                            >
                  {highlightStn7(row.Stn)}
                            </pre>
                          </TableCell>
                        )}
                
                        <TableCell align='right' className={classes.ceTab}>
                          <pre style={{ display: 'inline' }}>{row.StnDate}</pre>
                        </TableCell>
              </TableRow>
                    ))
                  : ''}
            
            
           
          </TableBody>
        </Table>
      </TableContainer>
      
        </div>
      )}
      <div id='DSEdiv' className={classes.DSEdiv3} style={DSEstyle}>
        <TableContainer
          component={Paper}
          style={{
            maxHeight: '700px',
            background:
              'linear-gradient(to bottom, lightgray 0px, lightgray 50px, #f5f5f5 50px, #f5f5f5 600px)',
          }}
        >
          <Table
            className={classes.tabSB}
            stickyHeader
            aria-label='sticky table'
          >
          <TableHead >
            <TableRow>
                <TableCell align='left' width='80%' className={classes.tabhead}>
                  Code Explosion
                </TableCell>
                <TableCell
                  align='right'
                  width='20%'
                  className={classes.tabhead}
                >
                  {' '}
                  <IconButton
                    aria-label='close'
              className={classes.closeButton} 
              onClick={handleDSEClick}
            >
                    <CloseIcon />{' '}
                  </IconButton>
              </TableCell>
              </TableRow>
          </TableHead>
          <TableBody> 
              {/*props.sourceBrowserData.hasOwnProperty('PrcCallsExplosionData')
                ? props.sourceBrowserData.PrcCallsExplosionData.map((row) => (
                : ''*/}
              {props.sourceBrowserData.hasOwnProperty('PrcCallsExplosionData')
                ? handleCodeExplosion()
                : ''}
              {
                <TreeView
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  style={{
                    backgroundColor: '#f5f5f5',
                    minHeight: '548px',
                  }}
                  defaultExpanded={Object.values(expandedJsonCheckObject)}
                >
                  {codeExplosionDataStart.map((d) => {
                    return testingRecursion(d);
                  })}
                </TreeView>

              }
          </TableBody>
        </Table>
      </TableContainer>
    
    </div>

      <div id='Expdiv' className={classes.DSEdiv} style={Expstyle}>
        <TableContainer component={Paper} style={{ maxHeight: '600px' }}>
          <Table
            className={classes.tabExp}
            stickyHeader
            aria-label='sticky table'
          >
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

            
              {ExpData.whereusedData.map((row) => (
                <TableRow
                  key={row.LineNum}
                  onClick={(e) => goToLineClick(e, row)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell align='left' className={classes.ceTab}>
                    <pre style={{ display: 'inline' }}>{row.LineNum}</pre>
                  </TableCell>
                  

                  <TableCell
                    align='left'
                    colspan={2}
                    style={
                      row.Stn.substr(0, 1) === '*'
                        ? { color: '#26AC26' }
                        : { color: '#010203' }
                    }
                    className={classes.ceTab}
                  >
                    <pre
                      className={classes.trExp}
                      style={{ display: 'inline' }}
                    >
                      {highlightStn17(row.Stn)}
                    </pre>
                  </TableCell>
            </TableRow>
          
                ))  }
          </TableBody>
        </Table>
      </TableContainer>
    
    </div>
    
    </div>
  );
}

export default connect(null, null)(CodeEditor);