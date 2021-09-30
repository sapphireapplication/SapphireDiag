import React, { useEffect, useState } from 'react';
//import DataUsageDiagramOverlay from "./DataUsageDiagram/DataUsageDiagramOverlay"
//import { drawDFD } from './PgmSChartDataUsage';
import DataUsageDiagramFile from '../DataUsageDiagram/DataUsageDiagramFile';
import { setProgramStructureChart } from '../../actions/ProgramStructureChart/ProgramStrucDataAction.js';
import { setProgramData } from '../../actions/ProgramDataActions';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import $ from 'jquery';
import { Box, Hidden } from '@material-ui/core';
import {
  checkIfBlueOrRed,
  findEndPointRelCoords,
  findRemRelCoords,
  converttocoords,
  findchildCoords,
  findparentCoords,
} from './PgmStrChartUtils';
import { positionLines } from './Line';

import * as d3 from 'd3';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import CodeEditor from '../DataUsageDiagram/sourceBrowser';

var gRemRels;
let gRemRelEntities = [];
//let currentPgm = '';
let contextPgm;
var initialScale = 0.25;
var i = 0;
var tfx = 0;
var tfy = 200;
var tgtgrpid;
var SELPROGRAM;
var currentRowHighlighted;
var currentTgtGrpId;
//var zoom;

const mapStateToProps = (state) => {
  console.log(
    ' pgmschart list  mapStateToProps',
    state.fetchProgramsReducer.programList
  );
  console.log(' pgmschart data', state.fetchPgmStrChartReducer);

  return {
    PgmStrData: state.fetchPgmStrChartReducer,
    programList: state.fetchProgramsReducer.programList,
    chartArray: state.fetchProgramsReducer.chartArray,
    pgmrightrels: state.fetchProgramsReducer.pgmrightrels,
  };
};

const mapDispatchToProps = (dispatch) => {
  console.log('shilpi pgmschart mapdispatch mapStateToProps');
  let pgm = { value: '', text: '' };

  return {
    setProgramData: async () => {
      await dispatch(setProgramData());
    },
    setProgramStructureChart: (pgm) => {
      Promise.resolve(dispatch(setProgramStructureChart(pgm)));
    },
  };
};

function handleZoomSlider(val) {
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
  grpmain.transition().ease(d3.easeLinear).duration(750).attr(
      'transform',
    `translate(0,200) scale(${initialScale})`
    // `translate(${tfx},${tfy}) `
    );
  var trElement = $("tr[id^='pgmTr']").css({
    'font-size': fontArr[val / 10 - 1],
    transition: 'font-size 1s ease',
  });
}
function PgmStruChart(props) {
  const { classes } = props;

  const [zoomSliderValue, setZoomSliderValue] = useState(40);
  //const [oldZoom, setOldZoom] = useState(40);

  const params = useParams();
  console.log('PROPS ', props);

  const [datausgfile, setDataUsg] = useState({ value: 'default', text: '' });
  DBNAME = props.authDetails.dbName;
  SERVERADDR =
    'https://' + props.authDetails.ipAddr + ':' + props.authDetails.port;
  useEffect(() => {
    console.log('shilpi calling setProgramData');
    props.setProgramData();
    if(props.PgmStrData.diagData.length!=0){
      console.log('case hit now')
    props.setProgramStructureChart( { value: 'default', text: '' });
    }
    /*if(props.hasOwnProperty('scddata') ){
      props.setProgramStructureChart(props.scddata);
     }*/
  }, []); //empty means will be called only once

  /*useEffect(() => {
    console.log('case hit SCD')
    props.setProgramData();
  },[props.scddata]);*/
  useEffect(() => {
    
  /* if(props.scddata && props.PgmStrData.program == ''){
    props.setProgramStructureChart(props.scddata);
   }*/
   
   if(!props.hasOwnProperty('scddata')){
    console.log('calling drawPgmStrChart not come ');
    drawPgmStrChart();
   
      handleZoomSlider(zoomSliderValue); /*SA_COMM*/
   }
    // $('html , body').animate({scrollTop:1000},2000);
  }, [props.programList, props.PgmStrData]);

  useEffect(() => {
  if(props.hasOwnProperty('scddata')){
    console.log('setting  data');

    props.setProgramStructureChart(props.scddata);
   }
  },[props.scddata, props.programList]);

   useEffect(() => {
    if(props.hasOwnProperty('scddata')){
      console.log('calling draw pgmstrchart')
     drawPgmStrChart();
    }
  }, [props.PgmStrData]);

  function bringToPos() {
    var grpid = `grpid${contextPgm.PGMID}${contextPgm.index}`;
    var curpos = document.getElementById(grpid).getBoundingClientRect();

    var tgtpos = { x: 150, y: 200 };
    var transval = { x: tgtpos.x - curpos.x, y: tgtpos.y - curpos.y };
    var grptrans = d3.select(`#grpmain`).attr('transform');
    console.log('whats in curpos', grptrans, curpos, transval);
    var tempCoords = grptrans.substring(10, grptrans.length - 1);
    var x = parseFloat(tempCoords.split(',')[0]) + transval.x;
    var y = parseFloat(tempCoords.split(',')[1]) + transval.y;

    console.log(x, y);
    d3.select(`#grpmain`).attr(
      'transform',
      'translate(' +
        parseFloat(x) +
        ',' +
        parseFloat(y) +
        ')' +
        'scale(' +
        initialScale +
        ')'
    );
    tfx = x;
    tfy = y;
    console.log('XXX==', tfx, tfy);
  }

  function bringToPos2() {
    var grpid = `grpid${contextPgm.PGMID}${contextPgm.indexPgmid}`;

    var curpos = document.getElementById(grpid).getBoundingClientRect();

    var tgtpos = { x: 150, y: 200 };
    var transval = { x: tgtpos.x - curpos.x, y: tgtpos.y - curpos.y };
    var grptrans = d3.select(`#grpmain`).attr('transform');
    console.log('whats in curpos', grptrans, curpos, transval);
    var tempCoords = grptrans.substring(10, grptrans.length - 1);
    var x = parseFloat(tempCoords.split(',')[0]) + transval.x;
    var y = parseFloat(tempCoords.split(',')[1]) + transval.y;

    console.log(x, y);
    d3.select(`#grpmain`).attr(
      'transform',
      'translate(' +
        parseFloat(x) +
        ',' +
        parseFloat(y) +
        ')' +
        'scale(' +
        initialScale +
        ')'
    );
    tfx = x;
    tfy = y;
    console.log('XXX==', tfx, tfy);
  }
  //$('html , body').animate({scrollTop:1000},2000);
  //$('html , body').animate({scrollTop:0},2000);
  function handleMouseOver(d, i) {
    SELPROGRAM = d.data.name + i;
    console.log('in handle mouse over', SELPROGRAM);
  }
  function handlePgmStructureChart() {
    //console.log('shilpi handlepgm clicked ',props.ForProgram)
    let progDetails = {};
    //let prog = props.programList.find(o => o.PGMID == currentPgm)
    let prog = props.programList.find((o) => o.PGMID == contextPgm.PGMID);

    progDetails = {
      field: 'PGMID',
      //code: prog.PGMID,
      text: prog.PGMTX,
      value: prog.PGMID.trim(),
    };
    //console.log('shilpi progdetails',progDetails)

    props.setProgramStructureChart(progDetails);
    //props.pgmLinksHandler("pgmStrChart",progDetails);
  }

  function handleDataUsage() {
    //console.log('shilpi handledatausage clicked ')
    //let progDetails = [];
    let prog = props.programList.find((o) => o.PGMID == contextPgm.PGMID);
    let progDetails = {
      field: 'PGMID',
      //code: prog.PGMID,
      text: prog.PGMTX,
      value: prog.PGMID,
    };
    tgtgrpid = `grpid${contextPgm.PGMID}${contextPgm.index}`;
    console.log('what is grpid====', tgtgrpid);
    //props.linkClickHandler('','but27',progDetails,'Data Usage','LBContext','')
    if (contextPgm.POS === 'LT')
      props.linkClickHandler('DATAUSAGE', progDetails);
    else {
      console.log('calling from here');
      props.linkClickHandler('PGMSC_DU', progDetails);
    }
    //props.pgmLinksHandler("pgmDataUsage",progDetails);
  }

  //   function handleDataUsageFile() {
  //     let ent = props.PgmStrData.entities.find(
  //       (o) => o.ENTID.trim() == contextPgm.ENTID
  //     );
  //     let entDetails = {
  //       field: 'ENTID',
  //       text: ent.ENTTX,
  //       value: ent.ENTID,
  //     };
  //     props.linkClickHandler('PGMSC_DU_FILE', entDetails);
  //     console.log(entDetails);
  //   }

  function handleHighlightRows(tgtgrpid, rowid, buttonid, tgtgrpidsvg) {
    var htmlTempTrSelection = document
      .getElementById(tgtgrpid)
      .querySelector(`#${rowid}`);
    var btsel = document.getElementById(tgtgrpid).querySelector(`#${buttonid}`);
    var buttonSelection = tgtgrpidsvg.select(`#${buttonid}`);
    var buttonText = buttonSelection.text();
    if (buttonText == 'P' || buttonText == 'S') {
      buttonSelection.text('X');
  }
   // console.log('gid', gId, d3.select(`#${gId}`).attr('transform'))
   // var tempCoords = d3.select(`#${gId}`).attr('transform');
   // tempCoords = tempCoords.substring(10, tempCoords.length - 1);
  //  var tempCoordsList = tempCoords.split(',');
  //  var x = tempCoordsList[0];
  //  var y = tempCoordsList[1];
  //  console.log('shilpi grpid x y',x,y)
    htmlTempTrSelection.classList.remove(`${classes.fotable}`);
    htmlTempTrSelection.classList.add(`${classes.highlight}`);
    btsel.classList.remove(`${classes.tdPandSbutton}`);
    btsel.classList.add(`${classes.tdPandSbutton2}`);
  }

  function handleUnhighLightingRows(tgtgrpid, rowid, buttonid, tgtgrpidsvg) {
    if (currentTgtGrpId != tgtgrpid) {
      if (currentTgtGrpId == undefined) currentTgtGrpId = tgtgrpid;
      else {
        var htmlTempTrSelection = document

          .getElementById(currentTgtGrpId)
          .querySelector(`#${currentRowHighlighted}`);

// pass event coordinates

// transform to SVG coordinates
        htmlTempTrSelection.classList.remove(`${classes.highlight}`);
        htmlTempTrSelection.classList.add(`${classes.fotable}`);
        var pButton = htmlTempTrSelection.childNodes[0];
        var sButton = htmlTempTrSelection.childNodes[4];
        pButton.classList.add(`${classes.tdPandSbutton}`);
        sButton.classList.add(`${classes.tdPandSbutton}`);
        pButton.classList.remove(`${classes.tdPandSbutton2}`);
        sButton.classList.remove(`${classes.tdPandSbutton2}`);
        if (pButton.innerHTML == 'X') {
          pButton.innerHTML = 'P';
        } else if (sButton.innerHTML == 'X') {
          sButton.innerHTML = 'S';
        }
        handleHighlightRows(tgtgrpid, rowid, buttonid, tgtgrpidsvg);
        currentRowHighlighted = rowid;
        currentTgtGrpId = tgtgrpid;
        return;
      }
    }
    if (currentRowHighlighted == undefined) {
      currentRowHighlighted = rowid;
      handleHighlightRows(tgtgrpid, rowid, buttonid, tgtgrpidsvg);
    } else {
      if (currentRowHighlighted != rowid) {
        var htmlTempTrSelection = document
          .getElementById(tgtgrpid)
          .querySelector(`#${currentRowHighlighted}`);
        htmlTempTrSelection.classList.remove(`${classes.highlight}`);
        htmlTempTrSelection.classList.add(`${classes.fotable}`);
        var pButton = htmlTempTrSelection.childNodes[0];
        var sButton = htmlTempTrSelection.childNodes[4];
        pButton.classList.add(`${classes.tdPandSbutton}`);
        sButton.classList.add(`${classes.tdPandSbutton}`);
        pButton.classList.remove(`${classes.tdPandSbutton2}`);
        sButton.classList.remove(`${classes.tdPandSbutton2}`);
        if (pButton.innerHTML == 'X') {
          pButton.innerHTML = 'P';
        } else if (sButton.innerHTML == 'X') {
          sButton.innerHTML = 'S';
        }
        handleHighlightRows(tgtgrpid, rowid, buttonid, tgtgrpidsvg);
        currentRowHighlighted = rowid;
       // 'y',Number(trcoords.top) - (height + margin.top + margin.bottom) / 2 + trcoords.top
      } else {
        var htmlTempTrSelection = document
          .getElementById(tgtgrpid)
          .querySelector(`#${currentRowHighlighted}`);
     
        var btsel = document
          .getElementById(tgtgrpid)
          .querySelector(`#${buttonid}`);
        var buttonSelection = tgtgrpidsvg.select(`#${buttonid}`);
        if (buttonSelection.text() == 'X') {
          if (String(buttonid).includes('plusBut')) {
            buttonSelection.text('P');
          } else {
            buttonSelection.text('S');
          }
          $("foreignObject[id^='rightSvg']").fadeOut(400, () => {
            d3.select("foreignObject[id^='rightSvg']").remove();
    });
          // d3.select('#helperGroup').remove();
    //SA_DEMO
          $('#ceDiv').remove();
          $('#DSEdiv').remove();
          $('#Expdiv').remove();
    
          currentRowHighlighted = undefined;
          currentTgtGrpId = undefined;
          htmlTempTrSelection.classList.remove(`${classes.highlight}`);
          htmlTempTrSelection.classList.add(`${classes.fotable}`);
          btsel.classList.add(`${classes.tdPandSbutton}`);
          btsel.classList.remove(`${classes.tdPandSbutton2}`);
          return true;
        } else {
          var pButton = htmlTempTrSelection.childNodes[0];
          var sButton = htmlTempTrSelection.childNodes[4];
          if (pButton.innerHTML == 'X') {
            pButton.innerHTML = 'P';
            sButton.innerHTML = 'X';
            pButton.classList.remove(`${classes.tdPandSbutton2}`);
            pButton.classList.add(`${classes.tdPandSbutton}`);
            sButton.classList.add(`${classes.tdPandSbutton2}`);
            sButton.classList.remove(`${classes.tdPandSbutton}`);
          } else if (sButton.innerHTML == 'X') {
            pButton.innerHTML = 'X';
            sButton.innerHTML = 'S';
            pButton.classList.add(`${classes.tdPandSbutton2}`);
            pButton.classList.remove(`${classes.tdPandSbutton}`);
            sButton.classList.remove(`${classes.tdPandSbutton2}`);
            sButton.classList.add(`${classes.tdPandSbutton}`);
          }
          currentRowHighlighted = rowid;
        }
      }
    }
    return false;
  }
  function removeHash(st) {
    var temp = '';
    for (var i = 0; i < st.length; i++) {
      if (st[i] == '#') temp += '\\' + st[i];
      else temp += st[i];
    }
    return temp;
  }
  function handleSchema(pgmid, rowid, buttonid) {
    var gId = `grpid${pgmid}`;
    var tgtgrpidsvg = d3.select(`#${gId}`);
    var gIdzz = removeHash(gId);
    var rowidzz = removeHash(rowid);
    var buttonidzz = removeHash(buttonid);
    if (handleUnhighLightingRows(gIdzz, rowidzz, buttonidzz, tgtgrpidsvg))
      return;
    var ss = rowid.substr(3, rowid.length);
    let ent = props.PgmStrData.entities.find((o) => o.ENTID.trim() === ss);
    var rowSelection = $('[id="' + `${gId}` + '"] [id="' + `${rowid}` + '"]');
    var divOffset = $(`#${gId} div`).offset();
    var rowOffset = rowSelection.offset();
    var rowActualTop = Math.abs(rowOffset.top - divOffset.top);
    var rowHeight = rowSelection.innerHeight() / 4;
    var rowBottom = rowActualTop + rowHeight;
    var finalTranslateYCoordinate =
      rowHeight / 2 + (rowBottom % 25) + Math.floor(rowBottom / 25) * 100 + 50;
    let entDetails = {
      field: 'ENTID',
      text: ent.ENTTX,
      value: ent.ENTID.trim(),
      tgtgrpid: gId,
      type: 'schema click',
      yPos: finalTranslateYCoordinate,
    };
    console.log(entDetails);
    setDataUsg(entDetails);
  }
  function handleDataUsageFile(rowid, pgmid, buttonid,event) {
    tgtgrpid = `grpid${pgmid}`;
    //tgtgrpid = `grpid${contextPgm.PGMID}${contextPgm.indexPgmid}`;
    //console.log('contextPgm',contextPgm)
    var tgtgrpidsvg = d3.select(`#${tgtgrpid}`);
    console.log('testing789', tgtgrpid, rowid, buttonid, tgtgrpidsvg);
    var tgtgrpidzz = removeHash(tgtgrpid);
    var rowidzz = removeHash(rowid);
    var buttonidzz = removeHash(buttonid);

    if (handleUnhighLightingRows(tgtgrpidzz, rowidzz, buttonidzz, tgtgrpidsvg))
      // alert('close');
      return;
    var rowSelection = $(
      '[id="' + `${tgtgrpid}` + '"] [id="' + `${rowid}` + '"]'
    );

    console.log(
      'what is grpid====',
      tgtgrpid,
      rowid.substr(3, rowid.length).trim().length
    );
    console.log(rowid.substr(3, rowid.length).length);
    var ss = rowid.substr(3, rowid.length);
    console.log('SS show', rowid);
    let ent = props.PgmStrData.entities.find((o) => o.ENTID.trim() === ss);
    //document.getElementsByClassName(".highlight").className = "nohighlight";
    // document.getElementsByClassName(`.${classes.highlight}`).className =
    //   classes.nohighlight;

    // var checksvg = document.getElementById('grpParentSvg'); //rightSvg
    // const pt = checksvg.createSVGPoint();
    // var transformed = checksvg.getElementById(`grpmain`); //('grpmain')     //(`${tgtgrpid}`);
    // console.log('show transformed', transformed, pt);

    // //   event.target.closest('g') || event.target.ownerSVGElement || event.target;
    // var target = document.getElementById(tgtgrpid);
   // console.log('showme', target, tgtgrpidsvg)

// pass event coordinates
//fetch clicked row co-ordinates
    // var offset = $(`#${tgtgrpid} #${rowid}`).offset();
//var offsetTop = Math.abs($(`#ftrBRANDMSTP`).offset().top -850 );
//var offsetLeft = Math.abs($(`#ftrBRANDMSTP`).offset().left)
    // console.log('check now', offset, rowid);
    // pt.x = Math.abs(offset.left); //event.clientX    //offsetLeft  //event.clientX
    // pt.y = event.clientY; //Math.abs(offset.top - window.scrollY);
    // console.log('check scroll', window.scrollY);
// transform to SVG coordinates
    // const svgP = pt; //.matrixTransform(target.getScreenCTM().inverse());
    // console.log('svgP', svgP);
    // console.log('what is contextPgm', ent, ss);
    var divOffset = $(`#${tgtgrpid} div`).offset();
    var rowOffset = rowSelection.offset();
    var rowActualTop = Math.abs(rowOffset.top - divOffset.top);
    var rowHeight = rowSelection.innerHeight() / 4;
    var rowBottom = rowActualTop + rowHeight;
    var finalTranslateYCoordinate =
      rowHeight / 2 + (rowBottom % 25) + Math.floor(rowBottom / 25) * 100 + 50;
    let entDetails = {
      field: 'ENTID',
      text: ent.ENTTX,
      value: ent.ENTID.trim(),
      tgtgrpid: tgtgrpid,
      type: 'program click',
      yPos: finalTranslateYCoordinate,
    };
    console.log(entDetails);
    setDataUsg(entDetails);
    //props.linkClickHandler('PGMSC_DU_FILE', entDetails);
  }
  
  function drawPgmStrChart() {
  currentRowHighlighted = undefined;
  currentTgtGrpId = undefined;
    console.log('yahan kitti baar aaya');
    if (props.PgmStrData.diagData.length == 0) {
      // d3.select("#PSCcontainerTree").selectAll("svg").remove();
      //d3.select("#PSCcontainerTree").select("#svg1").remove();
      d3.select('#svg1').remove();

      const svg = d3
        .select('#PSCcontainerTree')
        .append('svg')
        .attr('id', 'svg1')
        .attr('width', 3000)
        .attr('height', 3000)
        .append('g')
        .attr('id', 'grpmain2')
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

      let fo1 = svg
        .append('foreignObject')

        .attr('class', 'noder')
        .attr('width', 250)
        .attr('height', 1100)
        .attr(
          'style',
          'background:whitesmoke;border: 1px solid;font-size:12px;overflow-y:auto'
        )
        .append('xhtml:body')
        .attr('style', 'margin: 1px ')
        /////making heading
        .append('table')
        .attr('rules', 'none')
        .attr('style', 'width:100%');

      fo1
        .append('thead')
        .append('tr')
        .attr('style', 'background:darkgrey;text: white')
        .append('td');
      /////ends making making heading

      var nodeFo1 = fo1.append('tbody');
      nodeFo1
        .selectAll('foreignObject.noder')

        .data(function (d) {
          return props.programList;
        })
        .enter()
        .append('tr')
        .attr('height', '44px')
        .attr('class', classes.fotable)
        .on('click', function (e) {
          let progDetails = {
            field: 'PGMID',
            //code: e.PGMID,
            text: e.PGMTX,
            value: e.PGMID.trim(),
          };
          //props.pgmLinksHandler("pgmStrChart",progDetails);
          console.log('now calling  click setProgramStructureChart');
          props.setProgramStructureChart(progDetails);
        })
        .on('contextmenu', function (d) {
          console.log('shilpi table data', d);
          const container = d3.select('#PSCcontainerTree').node();
          console.log('shilpi container', container);
          d3.event.preventDefault();
          const position = d3.mouse(container);
          const posX = position[0] + 10 * 0.25;
          const posY = position[1];

          var g = d3
            .select('#d3contextMenu')
            .style('top', '' + posY + 'px')
            .style('left', '' + posX + 'px')
            .style('width', '150px')
            .style('height', '75px')
            //.style("visibility", "visible")
            .style('display', 'block')
            .style('z-index', 1)
            .on('click', function () {
              console.log('clicked', d.PGMID);
              //currentPgm = d.PGMID;
              contextPgm = { PGMID: d.PGMID, POS: 'LT' };
            });
          d3.selectAll('body').on('click', function (d) {
            const container = d3.select('#PSCcontainerTree').node();
            d3.event.preventDefault();
            const position = d3.mouse(container);
            d3.select('#d3contextMenu')
              .style('top', '' + 0 + 'px')
              .style('left', '' + 0 + 'px')
              .style('width', '0px')
              .style('height', '0px')
              //.style("visibility", "hidden");
              .style('display', 'none');
          });

          //context.pgmName = d.data.name;
          d3.event.stopPropagation();
        })
        .selectAll('td')
        .data((d) => {
          return [d.PGMID.trim(), ':', d.PGMTX.trim()];
        })
        .enter()
        .append('td')
        .attr('class', classes.focell)
        .attr('style', (x, i) => {
          // return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:10px';
          if (i == 1) return 'max-width:1px';
          else if (i == 2)
          return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:18px;';
          return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:15px;';
        })
        /*.style("background",function(d){
        //console.log('sa_val',d)
        if(d.PGMID == props.ForProgram[0].value){
          return "lightblue"
        }
      })*/
        .attr('title', (x) => {
          if (x !== ':') return x;
        })
        .text((d) => {
          return d;
        });
      return;
    }
    var res = props.PgmStrData.diagData[0].data;

    const pgmdefs = props.programList;
    const schemaBoxes = props.PgmStrData.schemaBoxes;
    const fileList = props.PgmStrData.fileList;

    //console.log('shilpi_pgm res', res)

    for (i in fileList) {
      var arr = fileList[i];
      var arr2 = [...new Set(arr)];
      fileList[i] = arr2;
    }

    const [PgmStrChart, RemRels, Diagram, levelsCount, DiagramBoxes] = res;
    const levelWidths = [];
    let level = 0;
    gRemRels = RemRels;
    console.log('shilpi gremrels', gRemRels);
    const getMaxWidth = (PgmStrChart) => {
      level++;
      if (PgmStrChart.children.length > 0) {
        levelWidths.push({ level, length: PgmStrChart.children.length });
        PgmStrChart.children.map((chld) => {
          getMaxWidth(chld);
        });
      }
      level--;
      return PgmStrChart;
    };

    getMaxWidth(PgmStrChart);
    const widthArray = levelWidths.reduce((acc, lvl) => {
      if (acc[lvl.level]) {
        acc[lvl.level] = acc[lvl.level] + lvl.length;
      } else {
        acc[lvl.level] = lvl.length;
      }
      return acc;
    }, {});

    const levelKeys = Object.keys(widthArray);
    const levelLengths = levelKeys.map((key) => widthArray[key]);
    const maxWidth = Math.max(...levelLengths);
    const maxSum = levelLengths.reduce((a, b) => a + b, 0);
    console.log(maxSum);

    ///////////////////////new trial
    let width = 11000;
    let treewidth = 8500;
    const MaxLevel = Math.max(...levelsCount);
    console.log(MaxLevel);

    if (MaxLevel > 0) {
      if (maxSum < 30) {
        width = 1300 + maxSum * 350;
        treewidth = 4800 + maxSum * 350; //naman- 1200-->1800   1800-->4800
      } else if (maxSum < 40) {
        width = 1300 + maxSum * 450;
        treewidth = 1200 + maxSum * 450;
      } else {
        width = 1300 + maxSum * 750;
        treewidth = 1200 + maxSum * 750;
      }
    }

    let height = (6000 * maxSum) / 10;
    let treedepth = (6000 * maxSum) / 15;

    if (maxSum < 30) {
      if (maxSum > 0 && maxSum <= 10) {
        treedepth = 1500 * (maxSum / 2);
      }     //fixes for depth
     else if (maxSum < 20) {
        treedepth = 6000;
      } else {
        treedepth = (6000 * maxSum) / 30;
      }
    }
    const treeLayout = d3.tree().size([treewidth, treedepth]);

    //////////////////////////////////////////
    console.log('whats in PgmStrChart', PgmStrChart);
    const root1 = d3.hierarchy(PgmStrChart, function (d) {
      return d.children;
    });
    console.log('whats in root==', root1);

    // context.diagData = root1;   //TO_DO context
    /* zoom_change start */

    /* zoom_change end */
    var drag = d3.drag().on('drag', () => {
      var zoomArr = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55];
      var temp = $('#zoomcontainer input:hidden').val();
      var xarr = [-100, -190, -220, -250, -300, -350, -400, -450, -500, -550];
      var yarr = [20, 30, 50, 70, 80, 90, 100, 110, 120, 130, 140];

      var x = d3.event.x + xarr[temp / 10 - 1];
      var y = d3.event.y + yarr[temp / 10 - 1];
      if (props.hasOwnProperty('scddata')) {
        initialScale = zoomArr[temp / 10 - 1];
        //initialScale = props.scddata.initialScale;
        x += xarr[temp / 10 - 1];
        y += yarr[temp / 10 - 1];
      }
      d3.select('#grpmain').attr(
        'transform',
        'translate(' + x + ',' + y + ') scale(' + initialScale + ')'
      );
    });
    d3.select('#PSCcontainerTree').selectAll('svg').remove();
    /* for no pgmrels case */
    if (height == 0) {
      height = 3000;
    }

  
    var svg = d3   //SA_CH  const to var
      .select('#PSCcontainerTree')
      .append('svg')
      .attr('id', 'svg1')
      .attr('width', width)
      .attr('height', height);
     // .call(drag);
    let grpmain = svg
      .append('g')
      .attr('id', 'grpmain')
      .attr(
        'transform',
        'translate(0,' + tfy + ') scale(' + initialScale + ')'
    // 'translate(' + tfx + ',' + tfy 
      );
   /*SA_CH start from here */
   if(props.hasOwnProperty('scddata')){
    (d3.select("foreignObject[id^='rightSvg']")["_groups"][0] !== null)
    d3.select("foreignObject[id^='rightSvg']").remove();
    (d3.select("foreignObject[id^='scdFO']")["_groups"][0] !== null)
    d3.select("foreignObject[id^='scdFO']").remove();
    //append foreign object
    svg = d3
   .select(`#dudtable`)
   .append('foreignObject')
  // .attr('id', 'rightSvgFO')   SA_CH
  .attr('id', 'scdFO') 
   .attr('width', 20000 )
  // .attr('height', svgHeight + margin.top + margin.bottom )  // calculate height as per tree
  .attr('height', 3000 )
   .attr('x', 300) // width of left table
        .attr('y', () => {
          var yOffsetRow = $(`#${props.scddata.rowid}`).offset().top;
          var yOffsetList = $(`#fileList`).offset().top;
          $('html, body').animate({
            scrollTop: yOffsetRow - 200,
          });
          setZoomSliderValue(40);
          handleZoomSlider(40);
          return yOffsetRow - yOffsetList - 120;
        }) //-52
   .attr('style', 'background-color:white')
   .append('svg')
   .attr('id','rightSvgFO')
   .attr('width', '100%')
   .attr('height', '100%');
  // .call(drag);
      grpmain = svg
        .append('g')
        .attr('id', 'grpmain')
        .attr(
          'transform',
          'translate(0,' + tfy + ') scale(' + initialScale + ')'
        ); // 20 is margin.top
  }

    // let zoom = d3.zoom().on('zoom', function (event) {
    //   //initialScale = zoomArr[temp / 10 - 1];
    //   grpmain.attr('transform', d3.event.transform);
  
      
    // svg
    //   .call(zoom)
    //   .call(
    //     zoom.transform,
    //     d3.zoomIdentity.translate(tfx, tfy).scale(initialScale)
    //   )
    //   .on('dblclick.zoom', null)
    //   .on('wheel.zoom', null);

     

    d3.select('#zoomIn').on('click', function () {
      console.log('inside zoomin');
      zoom.scaleBy(svg.transition().duration(750), 1.05);
    
    });
    d3.select('#zoomOut').on('click', function () {
      zoom.scaleBy(svg.transition().duration(750), 0.95);
    });

    //if (props.mainWindowState === 'PGMSCHART') {
    const svg2 = d3
      .select('#svg1')
      .append('g')
      .attr('id', 'grpmain2')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    //adding table for list of programs
    //let fo1 = d3
    //  .select("#grpmain2")
    let fo1 = svg2
      .append('foreignObject')
      //.attr("x", 20)
      //.attr("y", 10)
      .attr('class', 'noder')
      .attr('width', 250)
      .attr('height', 1100)
      .attr(
        'style',
        'background:whitesmoke;border: 1px solid;font-size:12px;overflow-y:auto'
      )
      .append('xhtml:body')
      .attr('style', 'margin: 1px ')
      /////making heading
      .append('table')
      .attr('rules', 'none')
      .attr('style', 'width:100%');

    fo1
      .append('thead')
      .append('tr')
      .attr('style', 'background:darkgrey;text: white')
      .append('td');
    /////ends making making heading

    var nodeFo1 = fo1.append('tbody');
     ///////////////////old code
    nodeFo1
      .selectAll('foreignObject.noder')

      .data(function (d) {
        console.log('SHILPIABC');
        console.log('shilpi_du programList', props.programList);
        //newList = processList(props.programList)
        return props.programList;
      })
      .enter()
      .append('tr')
      .attr('class', classes.fotable)
      .on('click', function (e) {
        console.log('shilpi_du row clicked', e);
        let progDetails = {
          field: 'PGMID',
          //code: e.PGMID,
          text: e.PGMTX,
          value: e.PGMID.trim(),
        };
        console.log('shilpi progdetails2', progDetails);

        //props.pgmLinksHandler("pgmStrChart",progDetails);
        props.setProgramStructureChart(progDetails);
      })
      .on('contextmenu', function (d) {
        console.log('shilpi table data', d);
        const container = d3.select('#PSCcontainerTree').node();
        console.log('shilpi container', container);
        d3.event.preventDefault();
        const position = d3.mouse(container);
        const posX = position[0] + 10 * 0.25;
        const posY = position[1];

        var g = d3
          .select('#d3contextMenu')
          .style('top', '' + posY + 'px')
          .style('left', '' + posX + 'px')
          .style('width', '150px')
          .style('height', '75px')
          //.style("visibility", "visible")
          .style('display', 'block')
          .style('z-index', 1)
          .on('click', function () {
            console.log('clicked', d.PGMID);
            //currentPgm = d.PGMID
            contextPgm = { PGMID: d.PGMID, POS: 'LT' };
          });
        d3.selectAll('body').on('click', function (d) {
          const container = d3.select('#PSCcontainerTree').node();
          d3.event.preventDefault();
          const position = d3.mouse(container);
          d3.select('#d3contextMenu')
            .style('top', '' + 0 + 'px')
            .style('left', '' + 0 + 'px')
            .style('width', '0px')
            .style('height', '0px')
            //.style("visibility", "hidden");
            .style('display', 'none');
        });

        //context.pgmName = d.data.name;
        d3.event.stopPropagation();
      })
      .selectAll('td')
      .data((d) => {
        return [d.PGMID.trim(), ':', d.PGMTX.trim()];
      })
      .enter()
      .append('td')
      .attr('class', classes.focell)
      .attr('style', (x, i) => {
        // return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:10px';
        if (i == 1) return 'max-width:1px';
        else if (i == 2)
      //  return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:10px;';
        return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:18px;';
        return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:15px;';
      })
      .attr('title', (x) => {
        if (x !== ':') return x;
      })
      .style('background', function (d) {
        //console.log('sa_val',d)
        // if(d.PGMID == props.ForProgram[0].value){
        if (d.PGMID == props.PgmStrData.program.value) {
          return 'lightblue';
        }
      })
      .text((d) => {
        return d;
      });
    // } ////end of if

    d3.select('.node').classed('visited', false);
    const scale = 0.25;
    const treeData = treeLayout(root1);

    const getPgmFullName = (name, pgmdefs) => {
      console.log('shi_chk',name, name.length)
      const result = pgmdefs.filter((pgmdef) => pgmdef.PGMID.trim() === name);
      if (result.length > 0) {
        return result[0];
      } else return {};
    };

    const nodes = treeData.descendants();
    const links = treeData.links();
    console.log('shilpi nodes', nodes);
    let DiagrammedEntities = [];
    var i, j;
    var chldInfoArray = [];

    const g1 = grpmain.append('g');
    const g2 = grpmain.append('g');
    // const g3 = grpmain.append("g");
    // const g4 = grpmain.append("g");
    //console.log('SHILPI', g1.selectAll("g"))

    g1.selectAll('g')
      .data(links)
      .enter()
      .append('line')
      .style('fill', 'none')
      .attr('stroke', function (d) {
        return 'black';
      })
      .attr('stroke-width', function (d) {
        return 5;
      })
      .attr('x1', function (d) {
        return d.source.x;
      })
      .attr('y1', function (d) {
        return d.source.y+320; //naman- added 320
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y-300; //naman- added -300
      });

    for (i = 0; i < nodes.length; i++) {
      //if (nodes[i].data.children.length) {
      if (nodes[i].children != null) {
        //get child info
        console.log(
          'children len and pgmname',
          nodes[i].children.length,
          nodes[i].data.name
        );
        chldInfoArray = [];

        for (j = 0; j < nodes[i].data.children.length; j++) {
          //  console.log('in loop chldInfoArray', chldInfoArray,i);
          var name = nodes[i].children[j].data.name;
          var depth = nodes[i].children[j].depth;

          var cords = findparentCoords(name, nodes);
          /*if (DiagramType == 'D' && isDummyNode){
              depth = depth -1;
            }*/

          chldInfoArray.push({
            chldId: name,
            chldLev: depth,
            chldXLFTP: cords.x - 300,
            chldYLFTP: cords.y - 300,
            rlnID: nodes[i].data.name + ':' + name,
          });
        }
        //console.log('chldInfoArray', chldInfoArray);
        var depth = nodes[i].depth;
        /*if (DiagramType == 'D' && isDummyNode){
            depth =   depth -1;
          }*/
        DiagrammedEntities.push({
          XLFTP: nodes[i].x - 300,
          YLFTP: nodes[i].y - 300,
          Level: depth,
          DgeID: i + 1,
          PgmName: nodes[i].data.name,
          chldInfoArray: chldInfoArray,
        });
      }
    }
    for (i = 0; i < gRemRels.length; i++) {
      let newID = gRemRels[i].relID.split(':');
      let par = newID[0];
      let chld = newID[1];
      let cords = findchildCoords(newID[1], nodes);

      if (cords == undefined) {
        continue;
      }

      let DgmObj = DiagrammedEntities.find(
        (DgmObj) => DgmObj.PgmName == newID[0]
      );
      if (DgmObj == undefined) {
        DgmObj = new Object();
        let chldInfoArray = [];

        let parCords = findchildCoords(newID[0], nodes);

        DgmObj['XLFTP'] = parCords.x - 300;
        DgmObj['YLFTP'] = parCords.y - 300;
        DgmObj['Level'] = parCords.depth;
        DgmObj['DgeID'] = 1;
        DgmObj['PgmName'] = newID[0];
        DgmObj['chldInfoArray'] = chldInfoArray;
        DiagrammedEntities.push(DgmObj);
      }
      if (DgmObj.Level < cords.depth) {
        DgmObj.chldInfoArray.push({
          chldId: newID[1],
          chldLev: cords.depth,
          chldXLFTP: cords.x - 300,
          chldYLFTP: cords.y - 300,
          rlnID: newID[0] + ':' + newID[1],
        });
      }
      //DgmObj = DiagrammedEntities.find(DgmObj => DgmObj.PgmName == newID[0]);
      //  console.log('new DgmObj', DgmObj);
    }
    DiagrammedEntities = DiagrammedEntities.filter(function (obj) {
      return obj.chldInfoArray.length !== 0;
    });
    console.log('SHILPI DiagrammedEntities', DiagrammedEntities);

    //Line function call
    /*var lineCords = positionLines(DiagrammedEntities, 600, 600, 600);
      var lines2 = g2.selectAll("path")
      .data(lineCords)
      .enter()
      .insert("path","g")
      .attr("class", "line")
      .attr("d", function(d){
        return drawline(d)})
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");*/

    const PgmInfo = (ProgramName, schemaBoxes) => {
      const objProps = schemaBoxes.filter(
        (schema) => schema.PGMID === ProgramName
      ); /* for each box */
      console.log('Shilpi Program name', ProgramName);
      console.log(
        'Shilpi filtered objProps ',
        objProps
      ); /* now loop for all props of any box*/
      const finalprops = objProps.map((objProp) => {
        //console.log('shilpi  objProps',objProp)
        return (
          "<div class='schemaBoxes'> <p>" +
          'PGM' +
          ':' +
          objProp.PGMID +
          '</p>' +
          '<p>' +
          'SHORTNM' +
          ':' +
          objProp.SHORTNM +
          '</p>' +
          '<p>' +
          'LEN' +
          ':' +
          objProp.LEN +
          '</p>' +
          '<p>' +
          'DECP' +
          ':' +
          objProp.DECP +
          '</p>' +
          '<p>' +
          'DTATYP' +
          ':' +
          objProp.DTATYP +
          '</p>' +
          '<p>' +
          'FLDDBCLS' +
          ':' +
          objProp.FLDDBCLS +
          '</p>' +
          '<p>' +
          'FLDSCNCLS' +
          ':' +
          objProp.FLDSCNCLS +
          '</p>' +
          '<p>' +
          'ENTID' +
          ':' +
          objProp.ENTID +
          '</p>' +
          '<p>' +
          'VIEWID' +
          ':' +
          objProp.VIEWID +
          '</p>' +
          '<p>' +
          'FTXT' +
          ':' +
          objProp.FTXT +
          '</p>' +
          '<p>' +
          'FSEQ' +
          ':' +
          objProp.FSEQ +
          '</p>' +
          '<p>' +
          'DIRNM' +
          ':' +
          objProp.DIRNM +
          '</p>' +
          '<p>' +
          'APPNM' +
          ':' +
          objProp.APPNM +
          '</p>' +
          '<p>' +
          'PGMTX' +
          ':' +
          objProp.PGMTX +
          '</p>' +
          '<p>' +
          'ENTTX' +
          ':' +
          objProp.ENTTX +
          '</p>' +
          '</div>'
        );
      });
      return finalprops.join('');
    };

    const node = grpmain.selectAll('g.node').data(nodes, function (d, i) {
      return d.id || (d.id = i);
    });
    console.log('shilpi Printing nodes in data', nodes);

    //console.log(fileList);
    var fileListDesc = {};
    for (var i in fileList) {
      fileList[i].map((d) => {
        if (typeof fileListDesc[d] == 'undefined') {
          props.PgmStrData.entities.map((de) => {
            if (de.ENTID.trim() == d) fileListDesc[d] = de.ENTTX;
          });
        }
      });
    }

    // const FileInfo = (programname, fileList) => {
    //   var st = ``;
    //   for (i in fileList[programname]) {
    //     //console.log('IIII ', fileList[programname][i]);
    //     st =
    //       st +
    //       `<div class="divForFilesDataUsage" id="div${fileList[programname][i]}" ></div>`;
    //   }
    //   return st;
    // };

    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', function (d, i) {
        return `grpid${d.data.name}${i}`;
      });

    // Add Rectangle for the nodes
    var foTab = nodeEnter
      .append('foreignObject')
      .attr('width', 1000)
      .attr('height', 700)
      .attr('class', 'pgmfoclass')
      .on('mouseover', function (d, i) {
        handleMouseOver(d, i);
      })

      .attr(
        'style',
        'margin: 1px; background-color:whitesmoke;font-size:50px; border:1px solid black;'   //commented overflow
      )
      .append('xhtml:body')
      .append('table')
      .attr('id', 'pgmtable')
      .attr('style', 'width:100%;table-layout:fixed')
      .attr('rules', 'none');
    // .style('overflow-y', 'scroll');

    var theadtobeused = svg.selectAll('#pgmtable').append('thead');

    var pgmlistrightrelsheading = [];

    var pgmTable = theadtobeused
      // .selectAll('#pgmtable')
      // .append('thead')
      .append('tr')
      .attr('id', (d) => {
        return 'pgmTr' + d.data.name;
      })
      //.attr("class", classes.fotable)
      .attr('style', 'background:darkgrey; display:table-row')
      .selectAll('th')
      .data(function (d) {
        pgmlistrightrelsheading.push(d.data.name);
        return [d.data.name, '+'];
      })

      .enter()
      .append('th')
      .attr('style', function (x) {
        if (x == '+')
          return 'cursor:pointer;text-align:right;width:20%;padding:10px 50px 10px 0px;cursor:pointer';
        else return 'text-align:left;width:80%;cursor:context-menu';
      })
      .attr('colspan', (d, i) => {
        if (i == 0) return '4';
      })
      .attr('id', (x) => {
        if (x == '+') {
          var temp = `rightButton${pgmlistrightrelsheading[0]}`;
          pgmlistrightrelsheading.shift();
          return temp;
        }
      })
      .on('click', (d, i) => {
        if (i === 1) {
          populateRightRels(
            event.target.id,
            event.target.parentNode.parentNode.parentNode.parentNode.parentNode
              .parentNode.id
          );
        }
      })
      .text(function (col) {
        return col;
      });

    theadtobeused
      .append('tr')
      .attr('style', 'background:darkgrey; display:table-row;text-align:left;')
      .selectAll('th')
      .data(function (d) {
        if (getPgmFullName(d.data.name, pgmdefs).PGMTX)
          return [getPgmFullName(d.data.name, pgmdefs).PGMTX];
        else return ['Duplicate'];
      })
      .enter()
      .append('th')
      .attr(
        'style',
        'white-space: nowrap;overflow: hidden; text-overflow: ellipsis;cursor:context-menu;max-width:10px;'
      )
      .attr('colspan', '5')
      .attr('title', (d, i) => {
        return d;
      })
      .text(function (col) {
        return col;
      });

    // var tdCells = document.getElementsByTagName('th');

    // for (var i = 0; i < tdCells.length; i++) {
    //   var cell = tdCells[i];
    //   cell.setAttribute('title', cell.innerHTML);
    // }

    var pgmTablebody = foTab.append('tbody').attr('id', function (d) {
      console.log('yahan ji===', d);
      return 'pgmTbody' + d.data.name;
    });
    // .attr('style', 'overflow:scroll');
    // .attr("style","display:none");

    var plusButIdList = [];

    //shilpi changes start
    //nodeFo1 = nodeFo2.append('tr')
    nodeFo1 = pgmTablebody
      .append('tr')
      .append('div')
    .attr(
      'style',
        'margin: 1px; background-color:whitesmoke;font-size:50px; overflow-y:auto;overflow-x:hidden;height:550px;width:990px' //commented overflow
    )
    .append('table')
      .attr('style', 'width:100%;table-layout:fixed')
    .append('tbody');
    
    //pgmTablebody
       nodeFo1
      .selectAll('foreignObject.pgmfoclass')
      .data((d) => {
        console.log('whats in d ==', d);
        console.log(props.PgmStrData.fileList[`${d.data.name}`]);
        if (props.PgmStrData.fileList.hasOwnProperty(d.data.name))
          return props.PgmStrData.fileList[`${d.data.name}`];
        else return [];
      })
      .enter()
      .append('tr')
      .attr('id', (d) => {
        return `ftr${d}`;
      })
      .attr('helpingIndex', (d, i) => {
        return i;
      })
      .attr('class', classes.fotable2)
      .attr('style', 'padding:10px 50px 10px 0px;height:100px')
      .selectAll('td')
      .data((d) => {
        plusButIdList.push(d);
        return ['P', d, ':', fileListDesc[d], 'S'];
      })
      .enter()
      .append('td')
      .attr('class', (x, i) => {
        if (i === 4 || i === 0) return classes.tdPandSbutton;
      })
      .attr('style', function (x, i) {
        // var st =
        //   'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:context-menu;text-align:left';
        // if (x == '+')
        //if (i == 1) return 'width:20px;cursor:context-menu;text-align:left';
        if (i == 1) return 'width:365px;cursor:context-menu';
        else if (i == 2)
          return 'width:20px;cursor:context-menu;text-align:left';
        else if (i == 3)
          return 'display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;';
        else if (i == 0 || i == 4) return 'width:30px';
        //return 'width:365px;cursor:context-menu';
      })
      .attr('title', (x) => {
        if (x === 'P') return 'Program';
        else if (x === 'S') return 'Schema';
        else if (x !== ':') return x;
      })
      .attr('id', (x, i) => {
        if (x == 'P') {
          var temp = `plusBut${plusButIdList[0]}`;
          return temp;
        } else if (x == 'S') {
          var temp = `schemaBut${plusButIdList[0]}`;
          plusButIdList.shift();
          return temp;
        }
      })
      .on('click', (d, i) => {
        //console.log('check d', d);
        if (i === 0) {
          console.log('u clicked me', event.target.parentNode.id);
          console.log('SELPROGRAM==', SELPROGRAM);
          handleDataUsageFile(
            event.target.parentNode.id,
            SELPROGRAM,
            event.target.id,
            event
          );
        } else if (i === 4) {
          var trIdClicked = String(event.target.parentNode.id);
          var tdSiblingData =
            document.getElementById(trIdClicked).childNodes[3];
          console.log('sibling',tdSiblingData, trIdClicked)  
          trIdClicked = trIdClicked.substring(3, trIdClicked.length);
          handleSchema(SELPROGRAM, event.target.parentNode.id, event.target.id);
        }
      })
      .text((x) => {
        return x;
      });
    var verticalLine = nodeFo1.selectAll('foreignObject.pgmfoclass');
    //for removing the plus button if right rels doesn't exist
    var allPgmNames = {};
    DiagrammedEntities.map((d) => {
      if (typeof allPgmNames[d.PgmName] == 'undefined') {
        allPgmNames[d.PgmName] = 0;
      }
      d.chldInfoArray.map((de) => {
        if (typeof allPgmNames[de.chldId] == 'undefined') {
          allPgmNames[de.chldId] = 0;
        }
      });
    });

    console.log('testing567', $('#grpmain')[0].getBoundingClientRect().width);
    var zoomWidth = $('#grpmain')[0].getBoundingClientRect().width;
    var zoomHeight = $('#grpmain')[0].getBoundingClientRect().height;
    console.log('zoomHeight',zoomHeight)
    if (zoomWidth > 1300 || zoomHeight > 1300) {
      setZoomSliderValue(10);
      handleZoomSlider(10);
    } else if (
      (zoomWidth > 1100 && zoomWidth <= 1300) ||
      (zoomHeight > 1100 && zoomHeight <= 1300)
    ) {
      setZoomSliderValue(20);
      handleZoomSlider(20);
    }
    //console.log('hello', allPgmNames);

    var allPgmNames2 = {};
    var res = props.pgmrightrels;
    for (var i = 0; i < res.length; i++) {
      if (typeof allPgmNames2[res[i].PGMID] == 'undefined')
        allPgmNames2[res[i].PGMID] = 1;
      else allPgmNames2[res[i].PGMID] += 1;
    }

    for (var i in allPgmNames) {
      if (typeof allPgmNames2[i] == 'undefined') {
        var tempElement = document.getElementById(
          `rightButton${i}`
        ).previousSibling;
        tempElement.setAttribute('colspan', '5');
        d3.select(`#rightButton${i}`).remove();
      }
    }

    //setting style for rightrels
    function setStyle() {
      var style1 = document.createElement('style');
      var style2 = document.createElement('style');
      var style3 = document.createElement('style');
      var style4 = document.createElement('style');

      style1.innerHTML =
        '.rightlinks { fill: none;stroke: black;stroke-width: 2px; }';
      document.getElementsByTagName('head')[0].appendChild(style1);

      style2.innerHTML =
        '.rightNode circle {fill: #fff;stroke: steelblue;stroke-width: 3px;}';
      document.getElementsByTagName('head')[0].appendChild(style2);

      style3.innerHTML = '.rightNode text { font: 12px sans-serif; }';
      document.getElementsByTagName('head')[0].appendChild(style3);

      style4.innerHTML =
        '.rightNode--internal text {text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff; }';
      document.getElementsByTagName('head')[0].appendChild(style4);
    }

    ////////////////populate right rels//////////////
    function populateRightRels(nameId, gId) {
      setStyle();
      //console.log('Name 1', name1, name2);
      //var gId = document.getElementById(`${name}`).parentNode.parentNode.id;

      var buttonSelection = d3.select(`#${nameId}`);
      var buttonText = buttonSelection.text();

      var name = nameId.substring(11, nameId.length);

      if (buttonText == '+') {
        buttonSelection.text('x');
      } else if (buttonText == 'x') {
        buttonSelection.text('+');
        dePopulateRightRels(name);
        return;
      }

      var tempCoords = d3.select(`#${gId}`).attr('transform');
      tempCoords = tempCoords.substring(10, tempCoords.length - 1);
      var tempCoordsList = tempCoords.split(',');
      var x = tempCoordsList[0];
      var y = tempCoordsList[1];
      // console.log(x + ' ' + y);

      var res = props.pgmrightrels;

      //console.log(res);

      var rightRelsObj = {
        ID: name,
        children: [],
      };
      for (var i = 0; i < res.length; i++) {
        if (res[i].PGMID == name) {
          rightRelsObj['children'].push({ name: res[i].CLDPGM });
        }
      }

      console.log(rightRelsObj);

      var margin = { top: 20, right: 500, bottom: 30, left: 390 },
        width = 1500 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

      var treemap = d3.tree().size([height, width]);

      var nodes = d3.hierarchy(rightRelsObj, (d) => {
        return d.children;
      });

      nodes = treemap(nodes);

      var svg = d3
        .select(`#grpmain`)
        .append('foreignObject')
        .attr('id', `rightSvg${name}`)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('x', Number(x) + 1000)
        .attr('y', Number(y) - 350)
        .attr('style', 'background-color:white;')
        .append('svg')
        .attr('id', (d) => {
          return `rightSvg${name}`;
        })
        .attr('width', '100%')
        .attr('height', '100%');

      var g = svg.append('g').attr('transform', `translate(0,${margin.top})`);

      var link = g
        .selectAll('.rightlinks')
        .data(nodes.descendants().slice(1))
        .enter()
        .append('path')
        .attr('id', `rightPath${name}`)
        .attr('class', 'rightlinks')
        .attr('d', (d) => {
          return (
            'M' +
            d.y +
            ',' +
            d.x +
            'C' +
            (d.y + d.parent.y) / 2 +
            ',' +
            d.x +
            ' ' +
            (d.y + d.parent.y) / 2 +
            ',' +
            d.parent.x +
            ' ' +
            d.parent.y +
            ',' +
            d.parent.x
          );
        });

      var node = g
        .selectAll('.rightNode')
        .data(nodes.descendants())
        .enter()
        .append('g')
        .attr('class', function (d) {
          return 'node' + (d.children ? ' node--internal' : ' node--leaf');
        })
        .attr('transform', function (d) {
          return 'translate(' + d.y + ',' + d.x + ')';
        });

      node.append('circle').attr('r', 10);
      node._groups[0].splice(0, 1);

      var list = [];
      var tabNode = node.selectAll('g.rightlinks').data((d, i) => {
        return d.data;
      });
      node
        .append('foreignObject')
        .attr('class', 'nodeRightRels')
        .attr('width', width * 5)
        .attr('height', 500)
        .attr('y', '-45')
        .append('xhtml:body')
        .append('table')
        .attr('style', 'width:100%')
        .append('th')
        .append('tr')
        .attr('style', 'cursor:pointer; display:table-cell;')
        .selectAll('td')
        .data((d) => {
          var fullPgmName = getPgmFullName(d.data.name, pgmdefs);
          var st = '';
          if (fullPgmName.PGMTX) {
            st = `${fullPgmName.PGMTX}`;
          } else {
            st = `Duplicate`;
          }
          return [d.data.name, ':', st.trim()];
        })
        .enter()
        .append('td')
        .attr('style', (x, i) => {
          if (i == 0) {
            return 'width:300px;font-size:3em;text-align:left';
          } else if (i == 1) {
            return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:200px;font-size:3em';
          } else {
            return 'text-align:left;font-size:3em';
          }
        })
        .attr('title', (x) => {
          if (x != ':') return x;
        })
        .text((d, i) => {
          return d;
        });

      // node
      //   .append('text')
      //   .attr('dy', '.35em')
      //   .attr('font-size', '4em')
      //   .attr('x', function (d) {
      //     return d.children ? -13 : 13;
      //   })
      //   .style('text-anchor', function (d) {
      //     return d.children ? 'end' : 'start';
      //   })
      //   .attr('style', 'cursor:pointer')
      //   .text(function (d) {
      //     var fullPgmName = getPgmFullName(d.data.name, pgmdefs);
      //     var st = '';
      //     if (fullPgmName.PGMTX) {
      //       st = `${d.data.name}: ${fullPgmName.PGMTX}`;
      //     } else {
      //       st = `${d.data.name}: Duplicate`;
      //     }
      //     if (!st.includes('undefined')) {
      //       list.push(st);
      //       return st;
      //     }
      //   })
      //   .append('title')
      //   .text((d, i) => {
      //     if (i != 0) return list[i - 1];
      //   });

      //   .attr('title', st);

      var zz = d3
        .selectAll(`#rightPath${name}`)
        .attr('stroke-dasharray', function () {
          var totalLength = this.getTotalLength();
          return totalLength + ' ' + totalLength;
        })
        .attr('stroke-dashoffset', function () {
          var totalLength = this.getTotalLength();
          return totalLength;
        })
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    }

    function dePopulateRightRels(name) {
      console.log(name);
      var zz = d3
        .selectAll(`#rightPath${name}`)
        .attr('stroke-dasharray', function () {
          var totalLength = this.getTotalLength();
          return totalLength + ' ' + totalLength;
        })
        .attr('stroke-dashoffset', 0)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', function () {
          var totalLength = this.getTotalLength();
          return totalLength;
        })
        .remove()
        .on('end', () => {
          d3.select(`#rightSvg${name}`).remove();
        });
    }

    //   .html(function (d, i) {
    //     const progProps = PgmInfo(d.data.name, schemaBoxes);
    //     const st = FileInfo(d.data.name, fileList);
    //     const class1 = classes.Program; //"Program";
    //     const class2 = classes.largeFont; //"largeFont";
    //     const class3 = classes.fullPgmName;
    //     const plusbut = classes.plusbut;
    //     const fullPgmName = getPgmFullName(d.data.name, pgmdefs);

    //     console.log('shilpi fullPgmName', fullPgmName);
    //     if (fullPgmName.PGMTX) {
    //       return (
    //         '<div><div class=' +
    //         class1 +
    //         '>' +
    //         d.data.name +
    //         '</div><div class=' +
    //         class1 +
    //         `><button id=but` +
    //         `${d.data.name + i} class=` +
    //         plusbut +
    //         '>+</button></div>' +
    //         '</div>' +
    //         '<div class=' +
    //         class2 +
    //         '>' +
    //         '<div class=' +
    //         class3 +
    //         ' ><p>' +
    //         fullPgmName.PGMTX +
    //         '<p></div>' +
    //         st +
    //         '</div>' /* end of div largefont cont. fullpgmname and schemaboxes */
    //       );
    //     } else {
    //       return (
    //         '<div><div class=' +
    //         class1 +
    //         '>' +
    //         d.data.name +
    //         '</div><div class=' +
    //         class1 +
    //         `><button id=but` +
    //         `${d.data.name + i} class=` +
    //         plusbut +
    //         '>+</button></div>' +
    //         '</div>' +
    //         '<div class=' +
    //         class2 +
    //         '>' +
    //         '<div class=' +
    //         class3 +
    //         ' ><p>duplicate<p></div>' +
    //         st +
    //         '</div>' /* end of div largefont cont. fullpgmname and schemaboxes */
    //       );
    //     }
    //   })
    //  .on('click', function (d, i) {
    //    contextPgm = { PGMID: d.data.name, POS: 'DB', index: i };
    //    console.log('clicked===', d, i);

    //    handleDataUsage();
    //  });
    ///adding button

    // nodeEnter
    //   .selectAll('.divForFilesDataUsage')
    //   .html((z, i, d) => {
    //     var res = d[i].id;
    //     var res2 = res.substring(3);
    //     // console.log('ZID ', z, i, d[i].id);
    //     return `<h3 id="btn${res2}" style="cursor:pointer">${res2}<span style="float:right">+</span></h3>`;
    //   })
    //   .on('click', (z, i, d) => {
    //     var zz = document.getElementById(d[i].id).parentNode.parentNode
    //       .parentNode.parentNode.id;
    //     var zz2 = zz.substring(5, zz.length - 1);
    //     var indexz = zz.substr(zz.length - 1);
    //     var res = d[i].id;
    //     var res2 = res.substring(3);
    //     contextPgm = {
    //       PGMID: zz2,
    //       ENTID: res2,
    //       POS: 'DB',
    //       index: i,
    //       indexPgmid: indexz,
    //     };
    //     console.log('CLICKED ', res2, i);
    //     handleDataUsageFile();
    //     // alert(`clicked ${res2}`);
    //     // console.log(`clicked ${res2}`);
    //   });

    const checkDiagramBoxes = (entityId, DiagramBoxes) => {
      const DiagBox = DiagramBoxes.finalDiagramArr.filter(
        (box) => box.entityId === entityId
      );
      if (DiagBox.length > 0) {
        return DiagBox[0].Moved_Object;
      } else {
        return false;
      }
    };
    // UPDATE
    const nodeUpdate = nodeEnter.merge(node);

    let obj;

    // Transition to the proper position for the node
    nodeUpdate
      .attr('transform', function (d) {
        return 'translate(' + (d.x - 300) + ',' + (d.y - 300) + ')';
      })
      .on('contextmenu', function (d) {
        console.log('shilpi d', d);
        const container = d3.select('#PSCcontainerTree').node();
        console.log('shilpi container', container);
        d3.event.preventDefault();
        const position = d3.mouse(container);
        const posX = position[0] + 10 * 0.25;
        const posY = position[1];

        var g = d3
          .select('#d3contextMenu')
          .style('top', '' + posY + 'px')
          .style('left', '' + posX + 'px')
          .style('width', '150px')
          .style('height', '75px')
          //.style("visibility", "visible")
          .style('display', 'block')
          .style('z-index', 1)
          .on('click', function () {
            console.log('clicked', d.data.name);
            //currentPgm = d.data.name
            contextPgm = { PGMID: d.data.name, POS: 'DB' };
          });
        console.log('shilpi g', g);
        d3.selectAll('body').on('click', function (d) {
          const container = d3.select('#PSCcontainerTree').node();
          d3.event.preventDefault();
          const position = d3.mouse(container);
          d3.select('#d3contextMenu')
            .style('top', '' + 0 + 'px')
            .style('left', '' + 0 + 'px')
            .style('width', '0px')
            .style('height', '0px')
            //.style("visibility", "hidden");
            .style('display', 'none');
        });

        //context.pgmName = d.data.name;
        d3.event.stopPropagation();
      });
    // if (props.mainWindowState == 'PGMSC_DU') {
    //   bringToPos();
    //   var grpid = `grpid${contextPgm.PGMID}${contextPgm.index}`;
    //   console.log('what the k factor===', tfx, tfy);
    //   drawDFD(props, grpid);
    // }
    // if (props.mainWindowState == 'PGMSC_DU_FILE') {
    //   bringToPos2();
    //   var grpid = `grpid${contextPgm.PGMID}${contextPgm.indexPgmid}`;
    //   console.log('what the k factor===', tfx, tfy);
    //   drawDFDFile(props, grpid);
    // }
  }

  return props.scddata ? (
    <div id='scd'>
      <Box
        id='zoomcontainer'
        style={{
          width: '150px',
          top: '5px',
          left: '950px',
          backgroundColor: 'whitesmoke',
          borderRadius: '25px',
          padding: '0px 20px 0px 20px',
          position: 'fixed',
          zIndex: '99999',
        }}
      >
        <Slider
          value={zoomSliderValue}
          aria-labelledby='continuous-slider'
          valueLabelDisplay='off'
          step={10}
          min={10}
          max={100}
          onChange={(e, val) => {
            setZoomSliderValue(val);
          }}
          onChangeCommitted={(e, val) => {
            handleZoomSlider(val);
          }}
        />
        Zoom: {zoomSliderValue}%
      </Box>
      {datausgfile.value != 'default' ? (
        <DataUsageDiagramFile datausgfile={datausgfile} {...props} />
      ) : null}
    </div>
  ) : (
    <div id='PSCmaincontainer' style={{ position: 'relative' }}>
      <div className={classes.caption}>
        <span className={classes.span}>
          {/*{props.NavListData[0].label}  {props.ForProgram ===""? null : props.ForProgram[0].value+': '+props.ForProgram[0].text} */}
          Program Structure Chart{' '}
          {props.PgmStrData.program == ''
            ? null
            : props.PgmStrData.program.value}
        </span>
      </div>
      {/*zoom_change start */}

      <div
        id='zoomcontainer'
        style={{
          width: '150px',
          left: '950px',
          top: '20px',
          backgroundColor: 'whitesmoke',
          borderRadius: '25px',
          padding: '0px 20px 0px 20px',

          position: 'relative',
          // zIndex: 10,
        }}
      >
      
        <Slider
          value={zoomSliderValue}
          key={zoomSliderValue}
          aria-labelledby='continuous-slider'
          valueLabelDisplay='auto'
          step={10}
          min={10}
          max={100}
          onChange={(e, val) => {
            setzoomSliderValue(val);
            handleZoomSlider(val);
          }}
        />
        Zoom: {zoomSliderValue}
      </div>

      {/* zoom_change end */}

      <div id='PSCcontainerTree'>
        {/*<DataUsageDiagramFile tgtgrpid={tgtgrpid} {...props} />*/}
      </div>
      {datausgfile.value!="default"?
      <DataUsageDiagramFile datausgfile={datausgfile} {...props} />:null}
      {/*<CodeEditor {...props} />*/}
    </div>
  );
}

function drawline(d) {
  var path;
  //if (d.x5 == undefined) {

  //check if we have any crossing points

  if (d.x5 == undefined) {
    path =
      'M' +
      d.x1 +
      ',' +
      d.y1 +
      'L' +
      d.x2 +
      ',' +
      d.y2 +
      'L' +
      d.x3 +
      ',' +
      d.y3 +
      'L' +
      d.x4 +
      ',' +
      d.y4;
  } else {
    path = `M ${d.x1} ${d.y1}
     L ${d.x2} ${d.y2}
     L ${d.x3} ${d.y3}
     L ${d.x4} ${d.y4}
     L ${d.x5} ${d.y5}
     L ${d.x6} ${d.y6}`;
  }

  return path;
}

export default connect(mapStateToProps, mapDispatchToProps)(PgmStruChart);
