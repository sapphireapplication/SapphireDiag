//connObj['query'] = `SELECT  A.*, B.PGMTX, C.ENTTX FROM  ${dbname}.PGMENTS AS A LEFT JOIN ${dbname}.PGMDEFS AS B ON trim(A.PGMID)=trim(B.PGMID) LEFT JOIN ${dbname}.ENTITIES AS C ON trim(A.ENTID)=trim(C.ENTID) WHERE TRIM(A.PGMID)='${pgmid}' order by WHFUSG DESC`;


import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as d3 from "d3";
import $ from 'jquery';
import CodeEditor from "./sourceBrowser";
import { setDataUsageProgramList} from "../../actions/setDataUsageProgramActions";
import { setDataUsageProgram } from "../../actions/DataUsageDiagram/DataUsageProgramAction";
import {setSourceBrowser} from "../../actions/DataUsageDiagram/SourceBrowserAction";
import { useParams } from "react-router-dom";

import Button from "@material-ui/core/Button";
import PgmStruChart from "../PgmStruChart/PgmStruChart";
import Slider from '@material-ui/core/Slider';

var rowId;
var svg;
var totNodes;
//var midIndex;
var gsrcb = {};
var pathTransitionFlag = 0;
var initialScale = 0.25;
var srcData;
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Box, Hidden } from '@material-ui/core';
const mapStateToProps = (state) => {
  console.log('shilpi dudprogramlist  mapStateToProps',state.fetchDataUsageProgramsReducer)
  console.log('shilpi dudprogramlist mapStateToProps', state.fetchDUDProgramReducer)
  console.log('shilpi sb',state.fetchSourceBrowserReducer)
  srcData = state.fetchSourceBrowserReducer.pgmCodeData
  

  return {
     //dataUsageProgramList: state.fetchDataUsageProgramsReducer.dataUsageProgramList,
     dataUsageProgramList: state.fetchDataUsageProgramsReducer,
     DUDProgramData: state.fetchDUDProgramReducer,
     sourceBrowserData:  state.fetchSourceBrowserReducer,
    // SBData: state.fetchSBDataReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  console.log('shilpi dudprogram mapdispatch mapStateToProps')
  let program= {value:"default", text:""}

  return {

    setDataUsageProgramList: async()=> {
          await dispatch(setDataUsageProgramList())
          
      },
      setDataUsageProgram: (program) => {
        Promise.resolve( dispatch(setDataUsageProgram(program)))
      },
     /* setSourceBrowser: async(program)=> {
        await dispatch(setSourceBrowser(program))
        
    }   */
    setSourceBrowser: (program)=> {
      Promise.resolve(dispatch(setSourceBrowser(program)))
      
  }   
      };
      
  }

function handleZoomSlider(val) {
  console.log('handlezoomslider')
  var zoomArr = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55];
  var fontArr = [
    '2em',
    '2em',
    '1.5em',
    '1em',
    '1em',
    '1em',
    '1em',
    '1em',
    '1em',
    '1em',
  ];
  initialScale = zoomArr[val / 10 - 1];
  const svg = d3.select('#rightSvgFO');
  console.log('selected svg', svg);
  let grpmain = svg.select('#grpmain');
  //let allTables = d3.selectAll('table#pgmtable');
 // zoom.scaleBy(svg.transition().duration(750), `${zoomArr[val / 10 - 1]}`);
   grpmain
    .transition()
    .ease(d3.easeLinear)
    .duration(750)
    .attr(
      'transform',
    `translate(250,200) scale(${initialScale})`
    // `translate(${tfx},${tfy}) `
    );
  var trElement = $("tr[id^='pgmTr']").css({
    'font-size': fontArr[val / 10 - 1],
    transition: 'font-size 1s ease',
  });
}

 function DataUsageDiagram(props) {
 const params = useParams();
  const { classes } = props;
  // const [zoomSliderValue, setZoomSliderValue] = useState(40);
const [scddata, setSCDData] = useState({
    value: 'default',
    text: '',
  });
 DBNAME = props.authDetails.dbName;
 SERVERADDR = 'https://'+props.authDetails.ipAddr+':'+props.authDetails.port;
 
  //const [LoadCode, setLoadCode] = useState('0');
  var SELENTITY = { codedata: [], entity: "" };
  var PGMCODE = [];
  var FTXT = "";
  let currentPgm = '';
  var margin = { top: 20, right: 90, bottom: 30, left: 90 },
  width = 5000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;
   let k = 0;
   var pgmid;
  const [srcbpgm, setLoad] = useState({linenum:"", value:"", text:"", shortnm:""});
  useEffect(() => {
    props.setDataUsageProgramList();
        props.setDataUsageProgram({value:"default", text:""});
  },[]); //empty means will be called only once

  useEffect(() => {

 console.log('only once props',props);
      if( props.DUDProgramData.DUDProgramData !==""){
       /* $('html , body').animate(
          { scrollTop: 850 },
          {
            duration: 1000,
            complete: () => {
            },
          },
        );*/
        console.log('in if')
        if (d3.select("#dudsvg")["_groups"][0][0] !== null)
        //removing the existing svg , if anys
        d3.select("#dudsvg").remove();
        svg = d3
      .select("#dudcontainerTree")
      .append("svg")
      .attr("id", "dudsvg")
      .attr("width", width)
      //.attr("height", 500)
      .attr("height",  6000)
      //.attr('x',0)
      //.attr('y',5000)
      .append("g")
      .attr("id", "dudtable")
     
      .attr( 'transform',
       'translate(' +
          0 +
          ',' +
          850 +
           ')'  );

           let fo1 = svg
           .append('foreignObject')
           //.attr("x", 20)
           //.attr("y", 10)
           .attr('class', 'noder0')
        .attr('id', 'fileList')
           .attr('width', 300)
           .attr('height', '100%')
           .attr(
             'style',
             'background:whitesmoke;border: 1px solid;font-size:12px;overflow-y:auto'
           )
           .append('xhtml:body')
           .attr('style', 'margin: 1px ')
           /////making heading
           .append('table')
        .attr('style', 'width:100%')
        .attr('rules', 'none');
      
           var nodeFo1 = fo1.append('tbody');
    nodeFo1
      .selectAll('foreignObject.noder0')

      .data(function (d) {
        //console.log('shilpi pgmlist',props.dataUsageProgramList)
       
        return props.dataUsageProgramList.dataUsageProgramList;
      })

      .enter()
      .append('tr')
        .attr('class', classes.fotable2)
        .attr('style', 'cursor:context-menu')
        .attr('id', function (d, i) {
          return `tr${i}`;
        })
        // .on('click', function (d, i) {
        //   rowId = i; //store in global var
      
      //  let progDetails ={
      //    field: "PGMID",
      //    code: d.PGMID.trim(),
      //    text: d.PGMTX.trim(),
     //     value: d.PGMID.trim(), 
     //   }
    //    props.setDataUsageProgram(progDetails,props);
    //  })
      
        .selectAll('td')
        .data((d,i) => {
         // return ['+', d.PGMID.trim(), ':', d.PGMTX.trim(), '+'];
         pgmid = props.dataUsageProgramList.dataUsageProgramList[i].PGMID.trim()
          
        // const parent = props.dataUsageProgramList.pgmrels.filter((rel) => rel.PAR ==pgmid );
         let programNameData = props.dataUsageProgramList.pgmrels.filter((program) => {
          return pgmid === program.PGMID.trim();
       
        });
        //console.log('programNameData',programNameData)
        let calledPrograms = programNameData.map((data) => {
          return data.CLDPGM;
        });
        //console.log('calledpgm',calledPrograms)


         if(calledPrograms.length == 0){
           return ['', d.PGMID.trim(), ':', d.PGMTX.trim(), '>'];
         // return [d.PGMID.trim(), ':', d.PGMTX.trim(), '>'];
         }
         else
         return ['+', d.PGMID.trim(), ':', d.PGMTX.trim(), '>'];
         //return [d.PGMID.trim(), ':', d.PGMTX.trim(), '>'];
        })
        .enter()
      .append('td')
        .attr('class', (x, i) => {
        //  if (i == 0 || i == 4) return classes.dfdfocell;
         // else return classes.focell;
         if((i == 0 && x == '+') || i == 4) return classes.dfdfocell
         else return classes.focell
        })
        .attr('style', (x,i) => {
         // if(i == 0) return 'max-width:3px;box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);';
         if(i == 0) {
          if(x == '+')return 'max-width:3px;box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);';
          return   'max-width:3px';
        }
          else if (i == 2) return 'max-width:1px';
          //else if (i == 3) return 'max-width:15px';
          else if(i == 3)
          return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:25px;';
          else if ( i == 4)
            return 'max-width:3px;box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);font-weight:bold';
          else
            return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;text-align:left;max-width:18px;';
        })
        .attr('title', (x, i) => {
          if (i === 0 && x!='') {
            return 'Expand SCD';
          } else if ( i === 3) {
            return x;
          } else if (i === 4) {
            return 'Expand Datausage';
          }
      })
        .on('click', (d, i) => {
          var data = props.dataUsageProgramList.dataUsageProgramList;
          var tempRowId;
          var rowid;
          var cell;
          var rowIdToBeSent;
        //  tempRowId = tempRowId.replace('tr', '');
          if (i == 0) {
            rowid = event.target.parentNode.id;
            if(rowid != ''){
              cell =  $(`#${rowid} td:nth-child(1)`)[0].innerHTML;
             //console.log('cell',cell)
             if(cell ==  '') return;
            }

            $("tr[id^='tr']").removeClass(`${classes.highlight}`);
            $("tr[id^='tr'] td").removeClass(`${classes.highlightIcon}`);
           // $("tr[id^='tr'] td:nth-child(2)").removeClass(`${classes.highlight}`);
           $("tr[id^='tr'] td").removeClass(`${classes.highlight}`);

           // $(event.target).removeClass(`${classes.highlightIcon}`);
            tempRowId = String(event.target.parentNode.parentNode.id);
            rowIdToBeSent = tempRowId;
            tempRowId = tempRowId.replace('tr', '');
            if (tempRowId == '') {
              /*this case comes when click is done outside the model icon but within the cell */
            tempRowId = String(event.target.parentNode.id);
              rowIdToBeSent = tempRowId;
              $(`#${tempRowId} td:nth-child(2)`).toggleClass(`${classes.highlight}`)
              $(`#${tempRowId} td:nth-child(3)`).toggleClass(`${classes.highlight}`)
              $(`#${tempRowId} td:nth-child(4)`).toggleClass(`${classes.highlight}`)

              console.log('selection',$(`#${tempRowId} td:nth-child(2)`))
              $(event.target).toggleClass(`${classes.highlightIcon}`);
            tempRowId = tempRowId.replace('tr', '');
            } else {
              var tempZz = String(event.target.parentNode.parentNode.id);

             // $(`#${tempZz} td:nth-child(1)`).toggleClass(`${classes.highlight}`);
             $(`#${tempZz} td:nth-child(2)`).toggleClass(`${classes.highlight}`)
             $(`#${tempZz} td:nth-child(3)`).toggleClass(`${classes.highlight}`)
             $(`#${tempZz} td:nth-child(4)`).toggleClass(`${classes.highlight}`)
              console.log('selection',$(`#${tempZz} td:nth-child(1)`))
              $(event.target.parentNode).toggleClass(
                `${classes.highlightIcon}`
              );
            }
            let progDetails = {
              field: 'PGMID',
              text: data[tempRowId].PGMTX,
              value: data[tempRowId].PGMID.trim(),
              rowid: rowIdToBeSent,
            };
            setSCDData(progDetails);
          } else if (i === 4) {
            $("tr[id^='tr']").removeClass(`${classes.highlight}`);
            $("tr[id^='tr'] td").removeClass(`${classes.highlightIcon}`);
            $("tr[id^='tr'] td").removeClass(`${classes.highlight}`);

            $("tr[id^='tr'] td:nth-child(5)").text('>');
            tempRowId = String(event.target.parentNode.id);
            cell =  $(`#${tempRowId} td:nth-child(1)`)[0].innerHTML;
            $(`#${tempRowId} td:nth-child(2)`).toggleClass(`${classes.highlight}`)
            $(`#${tempRowId} td:nth-child(3)`).toggleClass(`${classes.highlight}`)
            $(`#${tempRowId} td:nth-child(4)`).toggleClass(`${classes.highlight}`)
            if(cell == ''){
              $(`#${tempRowId} td:nth-child(1)`).toggleClass(`${classes.highlight}`)
            }

           // $(`#${tempRowId}`).toggleClass(`${classes.highlight}`);
            $(event.target).toggleClass(`${classes.highlightIcon}`);
            $(event.target).text('-');
            tempRowId = tempRowId.replace('tr', '');
            rowId = tempRowId;
            console.log('rowId kya hai', rowId);
            let progDetails = {
              field: 'PGMID',
              code: data[tempRowId].PGMID.trim(),
              text: data[tempRowId].PGMTX.trim(),
              value: data[tempRowId].PGMID.trim(),
            };
           d3.select("#dudfiletable").select('#grpmain').remove() //remove scd if present
           if(d3.select("foreignObject[id^='scdFO']")["_groups"][0] !== null)
               d3.select("foreignObject[id^='scdFO']").remove();
             setSCDData({   value: 'default', text: '',})
             if(d3.select("foreignObject[id^='rightSvgFO']")["_groups"][0] !== null)
             d3.select("foreignObject[id^='rightSvgFO']").remove(); 
           //  $('#dudcontainerTree').dialog() 
         /*  d3.select(`#dudtable`)
           .append('foreignObject')
           .attr('id', 'dialog')
           .attr('x', () => {
               return 400;
           })
           .attr('y', () => {
            var offsetTop = Math.abs($(`#tr${rowId}`).offset().top - 850);
            // console.log('rowid,x,y',rowId, x, y)
             var forObjectYPos = offsetTop -(44*2)+7 ;
             return forObjectYPos
           })
           .attr('width', 130)
           .attr('height', 90)
           .attr('style', `opacity:1;
               border-radius:0;
               box-shadow: rgba(0,0,0,0.8) 0 0 5px;`);*/

            props.setDataUsageProgram(progDetails);
            props.setSourceBrowser(progDetails)
          }
        })
        .html((d, i) => {
          if (i === 0) {
            if(d == '+')
            return '<i class="fas fa-object-group"></i>';
           // else
            // return ""
          }
         // if(i == 4)
         // return '<i class="fas fa-arrow-right"></i>';
           //return '<i class="fa fa-arrow-right" aria-hidden="true"></i>';
          return d;
         /* if (i === 0) return '<i class="fas fa-object-group"></i>';
          return d;*/
      });
      //alert(props.dataUsageProgramList.japtxt[0].PGMTX)
      }
      //fixes start
    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  
      $('html , body').animate(
        { scrollTop: 850 },
        {
          duration: 1000,
          complete: () => {
          },
        },
      );
      
      
      if(params.hasOwnProperty('pgmid')){
//handling for param in route 
      var arrind = props.dataUsageProgramList.dataUsageProgramList.findIndex(
        (row) => row.PGMID.trim() === params.pgmid.toUpperCase().trim()
      );
      rowId = arrind; //store in global var
      let prog = props.dataUsageProgramList.dataUsageProgramList.find(o => o.PGMID.trim() == params.pgmid.toUpperCase().trim())
      let pgmtx = '';
      console.log('check_prog',prog)
      if(prog !=undefined)
       pgmtx = prog.PGMTX;
     
      let progDetails ={
          field: "PGMID",
          code: params.pgmid.toUpperCase().trim(),  
          text:  pgmtx,  //d.ENTTX.trim(),
          value: params.pgmid.toUpperCase().trim(), 
        }
        props.setDataUsageProgram(progDetails,props);
      }
    
      
  },[props.dataUsageProgramList.dataUsageProgramList]); //empty means will be called only once
      
  useEffect(() => {
    console.log('in second', props.DUDProgramData.DUDProgramData.ID)
    if(props.DUDProgramData.DUDProgramData.ID!='default' && props.DUDProgramData.DUDProgramData.ID!=undefined ){
      console.log('check rowid',rowId)
      setLoad({linenum:"", value:"", text:"", shortnm:""})
      drawDFD1()
    }
    
  },[props.DUDProgramData.DUDProgramData]);  //this will be called every time new row is clicked in table
  
  function drawDFD1() {
    console.log('not called ')
    var rootxPos
   
    var treeData = props.DUDProgramData.DUDProgramData;

    // Set the dimensions and margins of the diagram
    //var margin = { top: 20, right: 90, bottom: 30, left: 0 },
    var margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = 5000 - margin.left - margin.right,
      height;


    //delete any existing rightsvg
    if (d3.select("foreignObject[id^='rightSvg']")["_groups"][0] !== null)
    d3.select("foreignObject[id^='rightSvg']").remove();
    if(d3.select("foreignObject[id^='scdFO']")["_groups"][0] !== null)
    d3.select("foreignObject[id^='scdFO']").remove();

    var i = 0,
      duration = 750,
      root;

    // declares a tree layout and assigns the size
    //var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function (d) {
      return d.children;
    });
    //shilpi
    var diff = 0;
    var sep;
  var mainIndex = 0;
    var num = 0;
    //height = 550;
//////// in case of Left list only (Default)
    if (root.hasOwnProperty("children"))
    {

     num = root.children.length
     totNodes = num;
if(num ==6){
     height = 250   
     sep = 3.75

    }
    if(num > 6){
      diff = num - 6;
      height = 250 + diff * 41.66  //factor 41.66 = 250/6
      sep = 3.75
    }
    if(num < 6){
      diff = 6-num;
      height = 250 - diff * 41.66  //factor 41.66 = 250/6
      sep = 3.75
      
    }
  }
  
  console.log('height',height)
  var svgHeight = height+ num*500;
    //get x.y position of table row clicked
    var subRtFocus = document.getElementById(`tr` + rowId);
    console.log('subRtFocus.getBoundingClientRect()',subRtFocus.getBoundingClientRect())
    var x = subRtFocus.getBoundingClientRect().x
    var y = subRtFocus.getBoundingClientRect().y
    console.log('check rowid clicked', rowId);
    console.log('check offset top clicked',$(`#tr${rowId}`).offset().top );
    console.log('shilpi window',window.scrollY)
    console.log('shilpi row offset',$(`#tr${rowId}`).offset().top)
    var offsetTop = Math.abs($(`#tr${rowId}`).offset().top - 850);
    console.log('rowid,x,y',rowId, x, y)
    var forObjectYPos = offsetTop - (42*2)-7 - ( height/2)
    /* if number of childern are even  add +15 in forgn object for alignemnt*/
    if(num %2 == 0){
      forObjectYPos = forObjectYPos+20
    }

   //append foreign object
   var rightSvg = d3
   .select(`#dudtable`)
   .append('foreignObject')
   .attr('id', 'rightSvgFO')
   //.attr('height', svgHeight)
   .attr('width', width )
   .attr('height', svgHeight + margin.top + margin.bottom )  // calculate height as per tree
   .attr('x', 300) // width of left table
   .attr('y',forObjectYPos )   //-52
   .attr('style', 'background-color:white')
   .append('svg')
   .attr('id','rightSvg')
   .attr('width', '100%')
   .attr('height', '100%');

   var treegrp = rightSvg.append('g').attr('transform', `translate(0, 20)`); // 20 is margin.top
   var treemap = d3.tree().size([height, width]);
   console.log('height',height)
    root.x0 = height / 2;
    //root.x0 = 950;
    root.y0 = 0;
    //console.log('root',root.children.length);

    // Collapse after the second level
    if(root.hasOwnProperty("children"))
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {
      // Assigns the x and y position for the nodes
      if (source == root) {
        pathTransitionFlag = 1;
      } else if (source != root) {
        pathTransitionFlag = 0;
        console.log('not come here');
         k=0;
        ///// compute additional height
        root.children.forEach(function(d){
          if (d.children && d.children.length > 0) k++;
        });
      }
      console.log('shi_k',k)
 
  if(k>1)
  {
      treemap = d3.tree().size([height+(k-1)*120, width])
 
            .separation(function(a, b) {
              return a.parent == b.parent ? 1 : sep   //5
            });
    }
    else{
      treemap = d3.tree().size([height, width])
  
            .separation(function(a, b) {
              return a.parent == b.parent ? 1 : sep   //5
            });
    }
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
       // links = treeData.descendants().slice(1);
       links = treeData.descendants()
       var totNodes = nodes.length -1;
       var midIndex
     // console.log("nodes====", nodes);
     // console.log("links====", links);
      if(source == root){
        if(totNodes%2 == 0){
          
          midIndex = parseInt(totNodes/2)
          console.log('even case midIndex',midIndex)
        }
        else{
          midIndex = parseInt(totNodes/2)+1
          console.log('odd case midIndex',midIndex)
        }
        rootxPos = links[midIndex].x;
        //console.log('rootxPos',rootxPos,rootyPos,links[midIndex])
      } 
       var srcbLinks;
       srcbLinks = links.filter((obj) => obj.data.ID =='SRCB' );
      console.log('srcbLinks',srcbLinks)
      
     
      if(srcbLinks.length > 1){

        var startIndex = links.findIndex(
          (row) => row.data.ID == 'SRCB' )
        console.log('startIndex',startIndex)  
          links.splice(startIndex,srcbLinks.length-1) 


      }
      

      var x3 = nodes[num].x;

      // Normalize for fixed-depth.
      nodes.forEach(function (d) {
        //console.log('shilpi_DU data', d)
      if ((d.data.TEXT === d.data.ID) & (d.data.ID==='Entity')) {
 //d.y = d.depth * 50; //hit and trial change
        if (props.mainWindowState === "PGMSC_DU")  
         d.y = d.depth * 50; //hit and trial change
       else
        d.y = d.depth * 50;
          
      }
      else if((d.data.TEXT === d.data.ID) & (d.data.ID==='Schema' || d.data.ID =='Brule'))
            //d.y = d.depth * 300 +100;
            if (props.mainWindowState === "PGMSC_DU")  
            d.y = d.depth *50 + 500 //hit and trial change
            else
            d.y = d.depth *50 + 500 //hit and trial change
      else if((d.data.TEXT === d.data.ID) & (d.data.ID==='CODE'))
         if (props.mainWindowState === "PGMSC_DU") 
         d.y = d.depth * 50 + 750; //hit and trial change
        else
            d.y = d.depth * 50 + 850; //hit and trial change  //SA_JUL 750--->800  
       
      else
          d.y = d.depth * 75
        //d.y = d.depth*150;
      });
      var chldHeight = 30;
      console.log('chldHeight', chldHeight)

      // ****************** Nodes section ***************************

      // Update the nodes...
      var node = treegrp.selectAll("g.node").data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });
     

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d, x) {
           if (d.data.TEXT === d.data.ID && (d.data.ID==='Schema' || d.data.ID=='Brule')) {
            //console.log("transform===", source.y0 + 100, source.x0 - 50, x);
             return (
              "translate(" + (source.y0 + 500) + "," + (source.x0 ) + ")"
             );
           }
           else if (d.data.TEXT === d.data.ID && d.data.ID==='CODE') {
             return (
              "translate(" + (source.y0 + 350) + "," + (source.x0 ) + ")" //SA_JUL 250->300
             );
           }
           
           
           else
           return "translate(" + source.y0  + "," + source.x0 + ")";
          })
    
     //adding FO for remaining nodes except root    
      var nodeFo = nodeEnter
        .append("foreignObject")
        .attr("id", function(d,i){
          if(d.data.TEXT !== d.data.ID)
            return null
          else if(d.data.TEXT === d.data.ID && d.data.ID=='Entity')
             return  `nodex${i}`
          })
        .attr("class","noder")
        .attr("width", function (d, index) {
          if (d.data.TEXT === d.data.ID && d.data.ID=='Entity') return 500;
            //SA_CHANGE
          else if(d.data.TEXT === d.data.ID && (d.data.ID=='Schema' || d.data.ID =='Brule'))
             return 350   //SA_JUL 250-->300
          else if(d.data.TEXT === d.data.ID &&  d.data.ID=='CODE')
             return 350
          else{
            if(props.mainWindowState != 'PGMSC_DU')
            return 20;
            else
             return 0;
          
          } 
          //return 150;
        })
        .attr("height", function (d, index) {
          if (d.data.TEXT === d.data.ID && d.data.ID=='Entity') 
          return chldHeight; //just half 150-->75
          else if(d.data.TEXT === d.data.ID && (d.data.ID=='Schema' || d.data.ID=='CODE' || d.data.ID =='Brule'))
           return 150    //  change height 150
          
           
          else { 
              return 0;
          } // hit and trial
          
        })
        .attr('style', (d,i)=>{
          //console.log('whatis d',d)
         
          return "background:whitesmoke;border: 1px solid ;font-size:12px"  //overflow-y:auto
        })
        /*.attr(
          "style",
          "background:whitesmoke;border: 1px solid ;font-size:12px;overflow-y:auto"
        )*/
        .style("border",function(d){
          return '2px solid '
          
        })

        .style("fill", function (d, index) {
          if (d.data.TEXT === d.data.ID)
            return d._children ? "lightsteelblue" : "#fff";
        })
        .on("mouseover", function (d) {
         
          handleMouseOver(d);
        })
        .append("xhtml:body")
        .attr("style", "margin: 1px ")
        /////making heading
        .append('table')
        .attr('style', 'width:100%;padding:1px;table-layout:fixed')
        .attr('id',function(d){
          if(d.data.ID === 'CODE'){
            //console.log('whatis d',d)
            //return `tblcode${d.parent.data.HEADID}${d.data.HEADID}` //SA_ID
            return `tblcode${d.parent.data.HEADID}`
          }
          if(d.data.ID === 'Schema' || d.data.ID =='Brule'){
           // console.log('whatis d',d)
            return `tblsch${d.data.HEADID}`
          }
          if(d.data.ID === 'Entity'){
            // console.log('whatis d',d)
             return `tblent${d.data.HEADID}`
           }

        })
        .attr('rules', 'none'); //NA_CH

        //Adding small circle for root node 
    nodeEnter
    .append("circle")
    .attr("class", "node")
    .attr("r", function (d, index) {
      
      if (d.data.TEXT === d.data.ID && d.data.ID=='Entity' && d.data.WHFUSG >= 4) return 2.5;  //0
     // else return 1e-0;
     else return 0;
    
    })
    .attr("cx", function(d){
      return 7})
    .attr("cy", function(d){
      return 14})

    .style("stroke", function (d, index) {
      if (d.data.TEXT === d.data.ID && d.data.ID=='Entity') return 'red';
      return "steelblue";
    }) // colour the path
    .style("fill", function (d, index) {
      if (d.data.TEXT === d.data.ID && d.data.ID=='Entity') return 'red';
      return "#fff";
    })

    .style("stroke-width", function (d, index) {
      if (d.data.TEXT === d.data.ID&& d.data.ID=='Entity') return '1px';
      return "1px";
    });
  
     nodeFo
        .append("thead")
        .append("tr")
        .attr("id", function (d,i){  
           return `trowent${i}`
        })
        //.attr("style", "background:whitesmoke;text: white;cursor:pointer;font-weight:bold ") //SA_STYLE display:table-cell
        .attr("style", function(d){ 
          if(d.data.ID=='Schema' || d.data.ID=='CODE' || d.data.ID =='Brule')
            return "background:whitesmoke;text: white;cursor:pointer;font-weight:bold;border-bottom:1px solid "
         
             
          else
             return "background:whitesmoke;text: white;cursor:pointer;"   //font-weight:bold "
            
        })
        .style("background",function(d,idx){
          if(d.data.ID === 'Entity' && d.data.HEADID == props.DUDProgramData.DUDProgramData.ID){
            mainIndex = idx+1;
            console.log('now check idx',mainIndex)
            return 'lightblue'
          }
          if(d.data.ID === 'Entity')
           return 'whitesmoke'
          else if(d.data.ID == 'SRCB')
            return 'none'
          else{
            return  'rgba(0,0,0,0.08)' //SA_JUL
          }
        })
       // .attr('class', classes.fotable2) //SA_STYLE
        ///ends adding context menu on head 
        /*.on("click",function(d,i){
          console.log('check now d',d)
          if ((d.data.ID === d.data.TEXT) && d.data.ID==='Entity')
          {
            var table = document.getElementById(`tblent${d.data.HEADID}`)
            var rows = table.getElementsByClassName(`${classes.highlightsch}`);

            console.log('show rows',rows)
            console.log('all rows',table.getElementsByTagName('tr'))
            if(rows.length == 0){
              
              var htmlTrSelection = document.getElementById(`trowent${i}`);
              htmlTrSelection.classList.add(`${classes.highlightsch}`);

           }
            else{
              
              rows[0].classList.remove(`${classes.highlightsch}`)
            }
            foClick1(d)
          }
        })*/
        .selectAll('td')
        .data((d) => {
          if(d.data.ID == 'Entity'){
            return [{'type':'Entity','val':d.data.HEADID}, ':', {'type':'Entity','val':d.data.HEADTEXT},{'data':d,'val':'B'},{'data':d,'val':'>'}]
          }
          
          
          return [{'type':'NotEntity','val':d.data.HEADID}, ':', {'type':'NotEntity','val':d.data.HEADTEXT}];
        })
        .enter()
        .append('td')
        .attr("id", function (x,i){  
          if(i == 3)
          return `cellBR${x.data.data.HEADID}`
          if(i == 4)
          return `cellSCH${x.data.data.HEADID}`
       })
        .attr('class', (x, i) => {
          //  if (i == 0 || i == 4) return classes.dfdfocell;
           // else return classes.focell;
           if(i == 3 || i == 4) return classes.dfdfocell
        })
        .attr('style', (x, i) => {
          if (i == 1) return 'width:10px';
          else if (i == 2)
            return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:200px;';
          else if(i == 3)
             return 'width:15px; box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.08);background-color:lightgrey;border-left:1px solid black ;font-weight:bold;border-right:1px solid black'
          else if( i == 4)
             return 'width:15px;box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.08);background-color:lightgrey;font-weight:bold' 
             
          return 'width:100px;padding:5px;padding-left:14px';
        })
        .attr('title', (x,i) => {
          if(i == 3)
          return 'Business Rules'
          if(i == 4)
          return 'Schema'
          if(i == 0 || i == 2){
            //console.log('whats x',x)
            if(x.type == 'NotEntity')
            return x.val
          }
          
          
        })
       /* .text((d) => {
          if(d!='B')
          return d;
        })*/ /////ends making making heading
        .html((d,i)=>{
          if(i == 3)
          return '<i class="fas fa-clipboard"></i>'; 
          if(i == 4)
            return d.val
          if(i == 0 )
          {
            console.log('comes here')
            
             return d.val;
          }
          if(i == 2)
          return d.val
          else
          return d;
        })
        .on('click',(d,i)=>{
          
          
          //var clickedId;
          //$("tr[id^=`#${tempRowId}`] td").removeClass(`${classes.highlightIcon}`);
          var clickcellID = "";
           clickcellID = String(event.target.id);
           console.log('clicked cell id',clickcellID)
          if(clickcellID != ""){
            handleClick(event,d)
        }
        else{
          console.log('nnw null')
          handleIconClick(event,d)
        }

          console.log('checkclass',$(event.target).hasClass(`${classes.highlightIcon}`))
          console.log('whats i',i)
          if (i == 4) { 
            //console.log('show rowid1',tempRowId)
            //console.log('target',$(event.target))
            d.data.data.children[0].ID = 'Schema'
            d.data.data.children[0].TEXT = 'Schema'
            console.log('calling foClick1 1')
            foClick1(d.data)
          }
          if(i == 3){
            //console.log('showme',d.data.data.children[0].ID)
            /* SA_CHK*/
           
             /* SA_CHK*/
            console.log('showme1',d.data)
            //d.data.data.children[0].ID = 'Brule'
           // d.data.data.children[0].TEXT = 'Brule'

           // alert('business rule clicked')
           console.log('calling foClick1 2')
           //foClick1(d.data)
           setTimeout(function() {
            //your code to be executed after 1 second
            d.data.data.children[0].ID = 'Brule'
            d.data.data.children[0].TEXT = 'Brule'
            foClick1(d.data)
          }, 1000);
          }  
        });
       
       // treegrp.selectAll('#table1').selectAll('tr').remove();
       
      // var nodeFo1 = treegrp.selectAll('#table2').append("tbody");
      var nodeFo1 = nodeFo.append("tbody") //SA_FIX added style
      var oldpgmid = '';
      var arr = [];
      /* fix for tbody scroll starts */
      var nodeFo3 = nodeFo1
        .append('tr')
         .append('div')
        .attr('style', (d, i) => {
          if (d.data.ID == 'Schema' || d.data.ID =='Brule')
            return 'margin:1px; background:whitesmoke ;font-size:12px;overflow-y:auto;width:350px;height:120px';
          else if (d.data.ID == 'CODE')
            return 'margin:1px; background:whitesmoke ;font-size:12px;overflow-y:auto;width:350px;height:120px';
        })
    .append('table')
        .attr('style', 'width:100%;table-layout:fixed')
        .attr('rules', 'none')
    .append('tbody');
      /* fix for tbody scroll ends */
      var nodeFo4 = nodeFo3                 //3--->1
        .selectAll("foreignObject.noder")
        .data(function (d,i) {
          if (d.data.ID === d.data.TEXT && d.data.ID === "Schema" )
            return d.data.SCHMADATA;
          else if (d.data.ID === d.data.TEXT && d.data.ID === "CODE"){
            console.log('shi_check1 data',d.data.DATA)
            return d.data.DATA;
          }
          else if (d.data.ID === d.data.TEXT && d.data.ID === "Brule" )
            return d.data.BRULEDATA; 
          else return [];
        })
        .enter()
        
        .append("tr")
         .attr('style', 'display:table-row')
        .attr("id", function (d,i){  
         console.log('check row x',d)  //e.hasOwnProperty("StnDate")
        if (d.hasOwnProperty("SVAR1") || d.hasOwnProperty("StnDate"))
          return `trowcode${d.FILENM}${i}` //SA_ID
        else if(d.hasOwnProperty("LINENUM"))
          return   `trowsch${d.FILENM}${i}` 
        else
          return `trowsch${d.ENTID}${i}` })
            
       // .attr("class", classes.fotable)
        .attr('class', (d,i)=>{
         // if (d.hasOwnProperty('FILENM') )
             // return classes.testingClass
          return classes.fotablenew   //fotablesch
        })
        //SA_UPD
       /* .attr('style', (d) => {
          if (d.hasOwnProperty('UPD') && d.UPD > 0){
            //console.log('UPD found')
            return 'border-bottom:1px solid red';
          }
        })*/
        .on("click", function (e,i) {
          console.log('clickcheck',e,i)
          if (e.hasOwnProperty("SVAR1") || e.hasOwnProperty("StnDate")){ 
            console.log('now clicked')
           
        /********************************** */
        //var id = `tblcode${e.FILENM}${e.SVAR1}`  SA_ID
        var id = `tblcode${e.FILENM}`
         var temp = ''
         
         if(id.includes("#")){
            for(var k = 0; k < id.length; k++ ){
              if(id[k] == '#'){
                temp +="\\" + id[k]
              }
              else{
                temp +=id[k]
              }
            }
         }
         else
          temp = id
         console.log('newid 1',temp)


         var selectedrows= $("table[id^='tblcode'] tr[id^='trowcode']").not(`#${temp} tr[id^='trowcode']`);
           
            selectedrows.removeClass(`${classes.highlightwu}`)
            var table = document.getElementById(`tblcode${e.FILENM}`) //SA_ID
           //var table = document.getElementById(`${temp}`)
            //console.log('table val',table)
            var rows = table.getElementsByClassName(`${classes.highlightwu}`);

           // console.log('show rows',rows)
            //console.log('all rows',table.getElementsByTagName('tr'))
            if(rows.length == 0){
              //var rowid = 'trowOEBCTLPBAQLCTLUSR0'
              /*now highlight clicked row*/
              //var rowSelected = table.getElementsByTagName('tr');
              //console.log('rowSelected',rowSelected, i)
              //rowSelected.style.backgroundColor = "yellow";
              //console.log('check row', document.getElementById('trowcodeNXTINV#PINVUSER0'))
              var htmlTrSelection = document.getElementById(`trowcode${e.FILENM}${i}`); //SA_ID
             // console.log('htmlTrSelection',htmlTrSelection)
              htmlTrSelection.classList.add(`${classes.highlightwu}`);

           }
            else{
              
              rows[0].classList.remove(`${classes.highlightwu}`)
            }
            setTimeout(function() {
              //your code to be executed after 1 second
              foCodeClick(e,i)
            }, 2);
         
            }
          else if (e.hasOwnProperty("UPD")) {
            console.log('e value schema',e)
            //var selectedrows= $("table[id^='tblsch'] tr[id^='trowsch']").not(`#tblsch${e.ENTID} tr[id^='trowsch']`);
            //console.log('selectedrows',selectedrows)
            //selectedrows.removeClass(`${classes.highlightsch}`)
            var table = document.getElementById(`tblsch${e.ENTID}`)
            var rows = table.getElementsByClassName(`${classes.highlightsch}`);

            //console.log('show rows',rows)
           // console.log('all rows',table.getElementsByTagName('tr'))
            if(rows.length == 0){
              //var rowid = 'trowOEBCTLPBAQLCTLUSR0'
              /*now highlight clicked row*/
              //var rowSelected = table.getElementsByTagName('tr');
              //console.log('rowSelected',rowSelected, i)
              //rowSelected.style.backgroundColor = "yellow";
              var htmlTrSelection = document.getElementById(`trowsch${e.ENTID}${i}`);
              htmlTrSelection.classList.add(`${classes.highlightsch}`);

           }
            else{
              
              rows[0].classList.remove(`${classes.highlightsch}`)
            }
            foClick(e,i);


          }
          else{
            console.log('e val',e)
            var table = document.getElementById(`tblsch${e.FILENM}`)
            var rows = table.getElementsByClassName(`${classes.highlightsch}`);

            if(rows.length == 0){
              var htmlTrSelection = document.getElementById(`trowsch${e.FILENM}${i}`);
              htmlTrSelection.classList.add(`${classes.highlightsch}`);
             }
            else{
              rows[0].classList.remove(`${classes.highlightsch}`)
            }
            /* business rule case */
            console.log('e value brule',e)
            var begruleId = e.ID
            var beglineNum = e.LINENUM
            var endlineNum;
            var sbData = []

            var obj = props.DUDProgramData.DUDProgramData.BRULE.find((obj)=>obj.ID == begruleId )
            console.log('checkobj',obj)
            endlineNum = obj.LINENUM
            console.log('begLine endline',beglineNum,endlineNum)
            console.log('showprop',srcData)
            sbData = srcData.filter((obj)=>(parseFloat(obj.LineNum) >= parseFloat(beglineNum) && 
                     parseFloat(obj.LineNum) <= parseFloat(endlineNum)) )
           /* var clonedArray = []
            for (const obj of sbData) {
              clonedArray.push(copy(obj));
          }  */
          let clonedArray = JSON.parse(JSON.stringify(sbData));      
            console.log('after filter',srcData)
            console.log('what is selentity',SELENTITY)
            console.log('what is node ',e)
            clonedArray = clonedArray.map(function(obj) {
              obj['ID'] = obj['LineNum']; // Assign new key
              obj['TEXT'] = obj['Stn'];
              obj['FILENM'] = e.FILENM
              delete obj['LineNum']; // Delete old key
              delete obj['Stn'];
              return obj;
          });
          console.log('after key',srcData)
          console.log('sbData',sbData)
            SELENTITY.data.children[0].DATA = clonedArray;
            SELENTITY.data.children[0].HEADTEXT = "";
            SELENTITY.data.children[0].HEADID = e.ID;
            if(SELENTITY.data.HEADID == gsrcb.ENTID)
            setLoad({linenum:"", value:"", text:"", shortnm:""})
            console.log('show selentity BR',SELENTITY)
            click(SELENTITY);
          
          }
        });
      

        nodeFo4.selectAll('td')
        .data((d) => {
          console.log('ship d',d)
          if (d.hasOwnProperty('FILENM') || d.hasOwnProperty('StnDate')){
            return ['no',d.ID, '', d.TEXT];
          }
          else if(d.hasOwnProperty('UPD') )
          //return [{'id':d.ID,'text':d.ID}, ':', d.TEXT];
          return [{'id':'yes','val':d.UPD}, d.ID, ':', d.TEXT]
          else
            return ['no',d.ID, ':', d.TEXT];
        })
        .enter()
        .append('td')
        .attr('style', (d, i) => {
          
          /*if (i == 1) return 'width:10px';
          else if (i == 2)
            return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:200px;';
          return 'width:107px;';*/
          if(i==0){
            if(d.hasOwnProperty('id')) return 'width:10px';
            else
              return 'width:0px';
          }
          if(i ==2) return 'width:10px';
          if(i == 3)
          return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:200px;';
          if(i ==1)  return 'width:107px;';
         
        })
        .attr('title', (d, i) => {
         // if (d !== ':' || i != 1) {
           if(i == 3)
            return d;
          
        })
      
        .html((d, i) => {
          if (i === 0) {
            if(d.hasOwnProperty('id')){

              if(d.val == 1) return `<li style='color:red;font-size:initial '> </li>`
              else return `<li style='color:red;font-size:initial; display:block '> </li>`
            }
            else
              return null
          }
          return d;  
        })
       
      
      function foCodeClick(node,i) {
      
      // console.log('in focodeclick selentity',SELENTITY)
    
      clickCode(SELENTITY,node,i)
     //var offsetTop = Math.abs($(`#trow${i}${node.ID}`).offset().top - 190 );
     
      }
       function foSrcbClick(node,i) {
        //console.log('focodeclick node',node,i, `trow${i}${node.ID}`)
        //console.log('getelement',document.getElementById('trow3INAUDUSR'))
       //var offsetTop = Math.abs($(`#trow${i}${node.ID}`).offset().top - 190 );
       // console.log('offsetTop', offsetTop)
       click(node)
        var item = 
        {
              linenum: node.ID,
              text: "",
              value:node.ENTID,
              shortnm:node.SVAR1,
              offset: 850
          };
            console.log("whats in item====", item)
       // props.setSourceBrowser(item);
       setLoad(item)
     
        }
        
      function foClick1(node) {
        console.log('foclick1 clicked node',node);
        //props.setSourceBrowser({field:"", value:"", text:"", shortnm:""});
       console.log('show srcbpgm.', gsrcb)
       if(node.data.HEADID == gsrcb.ENTID){
         setLoad({linenum:"", value:"", text:"", shortnm:""})
       
       }
        click(node)
      }
      function foClick(node, i) {
        console.log('what is selentity',SELENTITY)
        console.log('what is node ',node)
        PGMCODE = SELENTITY.data.CODEDATA.filter(
          (pcode) => (pcode.PGMID === node.PGMNM && pcode.SVAR1 === node.ID 
        ));

        SELENTITY.data.children[0].DATA = PGMCODE;
        SELENTITY.data.children[0].HEADTEXT = node.TEXT;
        SELENTITY.data.children[0].HEADID = node.ID;
        console.log("inside foclick click===", SELENTITY);
 if(SELENTITY.data.HEADID == gsrcb.ENTID)
        setLoad({linenum:"", value:"", text:"", shortnm:""})
        console.log('show selentity schema',SELENTITY)
        click(SELENTITY);

        
        ////added  for global where used
        console.log("on karna chahte hai ham")
       
       
        
        ////added for global where used ends here
       // console.log('foclick node',SELENTITY.data.CODEDATA, node)
        
        
      
      }

      function handleMouseOver(selEntity) {
        SELENTITY = selEntity;
        //console.log('selentity',SELENTITY)
      }

      function handleClick(event,d){
        console.log('handleclick')
        var clickedId;
        var tempRowId = String(event.target.parentNode.id);
          if($(`#${tempRowId} td:nth-child(3)`).hasClass(`${classes.highlightsch}`)){
            //if clicked cell is clicked again, unhighlight row
            if($(`#${tempRowId} td:nth-child(4)`).hasClass(`${classes.highlightIcon}`)){
               clickedId = $(`#${tempRowId} td:nth-child(4)`)[0].id
              // nodecell = `#${tempRowId} td:nth-child(4)`
              if(clickedId != event.target.id)
              $(`#${tempRowId} td:nth-child(4)`).removeClass(`${classes.highlightIcon}`)
            }
               
            else{
               clickedId = $(`#${tempRowId} td:nth-child(5)`)[0].id
               if(clickedId != event.target.id){
               $(`#${tempRowId} td:nth-child(5)`).removeClass(`${classes.highlightIcon}`)
               console.log('collapse now 2')
               foClick1(d.data) //close previously existing schema
               }
            }

            console.log('clickedId, currentid',clickedId, event.target.id)
            if(clickedId == event.target.id){
              //unhighlight row now 
              $(`#${tempRowId} td:nth-child(3)`).removeClass(`${classes.highlightsch}`)
              $(`#${tempRowId} td:nth-child(2)`).removeClass(`${classes.highlightsch}`)
              $(`#${tempRowId} td:nth-child(1)`).removeClass(`${classes.highlightsch}`)
              $(event.target).removeClass(`${classes.highlightIcon}`);
            }
            else{
              // toggle cell 
              $(event.target).addClass(`${classes.highlightIcon}`);      
            }
          }

          else {
          $(`#${tempRowId} td:nth-child(3)`).addClass(`${classes.highlightsch}`)
          $(`#${tempRowId} td:nth-child(2)`).addClass(`${classes.highlightsch}`)
          $(`#${tempRowId} td:nth-child(1)`).addClass(`${classes.highlightsch}`)
          $(event.target).addClass(`${classes.highlightIcon}`);
          }
      }
      function handleIconClick(event,d){
        console.log('handleiconclick')
        var clickedId;
        var tempRowId = String(event.target.parentNode.parentNode.id);
        console.log('HIC temorowid',tempRowId)
        console.log('HIC 3rd child',$(`#${tempRowId} td:nth-child(3)`))
          if($(`#${tempRowId} td:nth-child(3)`).hasClass(`${classes.highlightsch}`)){
            //if clicked cell is clicked again, unhighlight row
            if($(`#${tempRowId} td:nth-child(4)`).hasClass(`${classes.highlightIcon}`)){
               clickedId = $(`#${tempRowId} td:nth-child(4)`)[0].id
              // nodecell = `#${tempRowId} td:nth-child(4)`
              if(clickedId != event.target.id){
              $(`#${tempRowId} td:nth-child(4)`).removeClass(`${classes.highlightIcon}`)
              }
              else{
                $(event.target.parentNode).addClass(`${classes.highlightIcon}`); 
              }
            }
               
            else{
               clickedId = $(`#${tempRowId} td:nth-child(5)`)[0].id
               if(clickedId != event.target.id){
               $(`#${tempRowId} td:nth-child(5)`).removeClass(`${classes.highlightIcon}`)
               console.log('collapse now 1')
               foClick1(d.data) //close previously existing schema
               $(event.target.parentNode).addClass(`${classes.highlightIcon}`); 
               }
               else
               $(event.target).addClass(`${classes.highlightIcon}`); 
            }

            console.log('clickedId, currentid',clickedId, event.target.id)
            if(clickedId == event.target.parentNode.id){
              //unhighlight row now 
              $(`#${tempRowId} td:nth-child(3)`).removeClass(`${classes.highlightsch}`)
              $(`#${tempRowId} td:nth-child(2)`).removeClass(`${classes.highlightsch}`)
              $(`#${tempRowId} td:nth-child(1)`).removeClass(`${classes.highlightsch}`)
             // $(event.target).removeClass(`${classes.highlightIcon}`);
            }
            else{
              // toggle cell 
                  
            }
          }

          else {
          $(`#${tempRowId} td:nth-child(3)`).addClass(`${classes.highlightsch}`)
          $(`#${tempRowId} td:nth-child(2)`).addClass(`${classes.highlightsch}`)
          $(`#${tempRowId} td:nth-child(1)`).addClass(`${classes.highlightsch}`)
          $(event.target.parentNode).addClass(`${classes.highlightIcon}`);
          }
      }

     // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
       
          if (d.data.ID === d.data.TEXT)
            return "translate(" + d.y + "," + (d.x) + ")";
          else
        
         return "translate(" + (d.y) + "," + (d.x) + ")";
          /* This is the actual point of translation- y is for x since it is horiz. tree */
          
        });

     

      // Remove any exiting nodes
      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
          if ((d.data.ID === d.data.TEXT) && (d.data.ID==='Schema' || d.data.ID =='Brule'))
            return "translate(" + (source.y+500) + "," + (source.x) + ")";
          else if ((d.data.ID === d.data.TEXT) && d.data.ID==='CODE')
            return "translate(" + (source.y+350) + "," + (source.x) + ")"; //SA_JUL 250---> 300
         else
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

      // On exit reduce the node circles size to 0
   
      /*nodeExit
        .select("foreignObject")
        .attr("width", function (d) {
          if (d.data.TEXT === d.data.ID) return 150;
          else return 0;
        })
        .attr("height", function (d) {
          if (d.data.TEXT == d.data.ID) return 100;
          else return 0;
        });*/

      // On exit reduce the opacity of text labels
      nodeExit.select("text").style("fill-opacity", 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = treegrp.selectAll("path.link").data(links, function (d) {
        return d.id;
      });

      //shilpi commenting
    /*  var link = svg.selectAll("path.link").data(nodes.slice(1), function (d) {
        return d.id;
      });*/
      

      // Enter any new links at the parent's previous position.
      console.log('totNodes',totNodes)
      if(totNodes %2 == 0){
        midIndex = parseInt((totNodes-1)/2)  + 2
        midIndex = totNodes/2
        console.log('midIndex even',midIndex)
      }
      else{
        midIndex = parseInt(totNodes/2)  + 2
        console.log('midIndex even',midIndex)
      }
      //SA_FIX

      var linkEnter = link
        .enter()
        .insert("path", "g")
        
        .style('stroke', (d) => {
          if (d.data.ID == 'Entity') {
            return 'white';
          } else return 'black';
        }) // colour the path
        .style('fill', 'none')

        .style("vector-effect", "non-scaling-stroke")
        
        .attr("class", "link")
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };

          return drawLine(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      var pathLengthArray = [];
      linkUpdate
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          var temp = drawLine(d, d.parent);
          var xmlns = 'http://www.w3.org/2000/svg';
          var path = document.createElementNS(xmlns, 'path');
          path.setAttribute('id', 'temPath');
          path.setAttribute('d', temp);
          pathLengthArray.push(path.getTotalLength());
         
          path.remove();
          return temp;
          //return diagonal(d, d.parent);
        });

      // Remove any exiting links
      var linkExit = link
        .exit()
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          var o = { x: source.x, y: source.y };
          return drawLine(o, o);
        })
        .remove();

      // Store the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {
        //console.log("source/des==", s, d);
        let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

        return path;
      }

      function drawLine(s, d) {
        if(s.depth == 0){
          console.log('parent case ',s)
          var x1 = rootxPos+15
          var y1 = 0
          var x2 = x1
          var y2 = 25
          let path =`M ${y1} ${x1} L ${y2} ${x2}`
          return path
        }
       
        if(s.depth ==1){
          let path;
          //console.log("source/des==", s);
          var x1 = s.x+15;
          var y1 = s.y;
          var x2 = x1;
          var diff = 25; //random
          var y2 = s.y-diff;
          if(s.id == 2){
            console.log('shilpi id=2 case', midIndex)

            // draw horizontal + vertical line connecting first and last entity
            /*if(s.id == midIndex){
              path =`M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15} M ${y2} ${x2} L ${y2-50} ${x2}`
            }
            else{*/
             path = `M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15}`
            }
            /* if(mainIndex == 1){
               console.log('in check');
              path =`M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15} M ${y2} ${x2} L ${y2-50} ${x2}`
             }*/
         //}
          /* else if(s.id == midIndex){
             console.log('shilpi midIndex case')
             
            //path = `M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15} M ${y2} ${x2} L ${y2-50} ${x2}`
          }*/
          else{
       
           //path = `M ${y1} ${x1} L ${y2} ${x2} `;
           path = `M ${y2} ${x2} L ${y1} ${x1} `;
          }
              
        return path;
          
        }
        if(s.depth ==2){
          var x1 = d.x+15;
          var y1 = s.y;
          var x2 = x1;
          var diff = s.y -(d.y+500);
          var y2 = s.y-diff;
          let path = `M ${y1} ${x1} L ${y2} ${x2} `;
              

        return path;
          
        }
        if(s.depth ==3){
          var x1 = d.x+15;
          var y1 = s.y;
          var x2 = x1;
          var diff = s.y -(d.y+350);  //SA_JUL 250-->300
          var y2 = s.y-diff;
          let path = `M ${y1} ${x1} L ${y2} ${x2} `;
          return path;
        }
        if( s.depth == 4){
          var x1 = d.x+15;
          var y1 = s.y;
          var x2 = x1;
          var diff = s.y -(d.y+400);  //400 -> 350 SA_TO
          var y2 = s.y-diff;
          let path = `M ${y1} ${x1} L ${y2} ${x2} `;
          return path;
        }

        
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children.forEach(collapse);
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
      function clickCode(d,node,i) {
        //console.log('checkthis',document.getElementById('tblschOEBCTLP'))
        //console.log('clickcode show node',node)
        //console.log('clickcode show d',d)
       var exp = 0;
       var offset;
       //var topPos;
       //var leftPos;
        if (d.children) {
          d._children = d.children;
          d.children.forEach(collapse);
          d.children = null;
          exp = 0;
        } else {
          d.children = d._children;
          d._children = null;
          exp = 1;
        }
        update(d);
        if(exp == 1){
         if(gsrcb.linenum!=''){
            console.log('shi_case hit',gsrcb)
            setLoad({linenum:"", value:"", text:"", shortnm:""})
          }  
         var id = `tblcode${node.FILENM}` //SA_ID
         var temp = ''
         
         if(id.includes("#")){
            for(var i = 0; i < id.length; i++ ){
              if(id[i] == '#'){
                temp +="\\" + id[i]
              }
              else{
                temp +=id[i]
              }
            }
         }
         console.log('newid',temp)
         
         console.log('showid',id)
       
        offset = $('[id="'+`tblcode${node.FILENM}`+'"]').offset() ; //SA_ID

       console.log('shilpi offset', offset)
        // topPos = Math.abs(offset.top) 
       
      console.log('nowshow',props)
        
          var item =  
       {
            linenum: node.ID,
            text: "",
           // value: props.DUDProgramData.DUDProgramData.ID, //node.ENTID,
            value: node.PGMID,
            shortnm:node.SVAR1,
            offsetTop: Math.abs(offset.top)-110,   //-175
            offsetLeft: offset.left+350+25
        };
          console.log("whats in item====", item)
          gsrcb['linenum'] = node.ID
          gsrcb['text'] = ''
          gsrcb['value'] = node.ENTID
          gsrcb['shortnm'] = node.SVAR1 
          gsrcb['offset'] = 850
          gsrcb['ENTID'] = d.parent.data.HEADID
     setLoad(item)
        }
        else{
          setLoad({linenum:"", value:"", text:"", shortnm:""})
          //gsrcb = {linenum:"", value:"", text:"", shortnm:""}
          gsrcb['linenum'] = ""
          gsrcb['text'] = ""
          gsrcb['value'] = ""
          gsrcb['shortnm'] = "" 
          gsrcb['PGMID'] = ""
          //gsrcb['offset'] = 850
        }
      }
      if (pathTransitionFlag == 1) {
        var zz = d3.selectAll('path.link');
        var yy = d3
          .select(zz._groups[0][0])
          .style('stroke', 'black')
          .attr('stroke-dasharray', () => {
            return pathLengthArray[0] + ' ' + pathLengthArray[0];
          })
          .attr('stroke-dashoffset', () => {
            return pathLengthArray[0];
          })
          .transition()
          .duration(1000) //1500
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
        setTimeout(() => {
            if (pathLengthArray.length >= 2)
              d3.select(zz._groups[0][1])
                .style('stroke', 'black')
                .attr('stroke-dasharray', () => {
                  return pathLengthArray[1] + ' ' + pathLengthArray[1];
                })
                .attr('stroke-dashoffset', () => {
                  return pathLengthArray[1];
                })
                .transition()
                .duration(1000) //1500
                .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0);
          setTimeout(() => {
                  for (var i = 2; i < pathLengthArray.length; i++) {
                    d3.select(zz._groups[0][i])
                      .style('stroke', 'black')
                      .attr('stroke-dasharray', () => {
            return pathLengthArray[i] + ' ' + pathLengthArray[i];
          })
                      .attr('stroke-dashoffset', () => {
            return pathLengthArray[i];
          })
          .transition()
                      .duration(1000) //1500
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
                  }
          }, 1000);
        }, 0);
      } else {
        var zz = svg.selectAll('path.link').attr('stroke-dasharray', 0);
    }
  
    }
  }
  
//   function handleDUDClose(){
// props.DUDCloseHandler();
//   }
   function handleDUDClose(){
    props.setMainWindowState("PGMSCHART");
   }
   function handleCloseClick()
    {
        console.log("clicking close", d3.select("foreignObject[id^='rightSvg']"));
        d3.select("foreignObject[id^='rightSvg']").remove();
        
    }



  //console.log("FTXT===", FTXT);
  return props.DUDProgramData.DUDProgramData ==
    '' ? null : props.mainWindowState === 'PGMSC_DU' ? null : (
    <div id='dudmaincontainer' style={{ position: 'relative' }}>
      {scddata.value != 'default'
        ? null
     
        : // <Box
          //   id='zoomcontainer'
          //   style={{
          //     width: '150px',
          //     top: '5px',
          //     left: '950px',

          //     backgroundColor: 'whitesmoke',
          //     borderRadius: '25px',
          //     padding: '0px 20px 0px 20px',

          //     position: 'fixed',
          //     zIndex: '99999',
          //   }}
      
          //   <Slider
          //     value={zoomSliderValue}
          //key={zoom}
          //     aria-labelledby='continuous-slider'
          //     valueLabelDisplay='off'
          //     step={10}
          //     min={10}
          //     max={100}
          //     onChange={(e, val) => {
          //       setZoomSliderValue(val);
          //     }}
          //     onChangeCommitted={(e, val) => {
          //       handleZoomSlider(val);
          null}

     
        
      
      <div id="dudcontainerTree">
        
     
        
         </div>

      {/*{scddata.value == 'default'?(<CodeEditor srcbpgm={srcbpgm} {...props}/>):null} */}
      {srcbpgm.linenum !=""?(<CodeEditor srcbpgm={srcbpgm}{...props} />):null}
      {scddata.value != 'default' ? (
        
        <PgmStruChart scddata={scddata} {...props} />
      ) : null}
    </div>
  );
  
}
export default connect(mapStateToProps, mapDispatchToProps)(
  DataUsageDiagram
);