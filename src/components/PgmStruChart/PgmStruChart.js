import React, { useEffect, useState } from "react";
//import DataUsageDiagramOverlay from "./DataUsageDiagram/DataUsageDiagramOverlay"
import {drawDFD} from "./PgmSChartDataUsage";
import $  from 'jquery';
import {
  checkIfBlueOrRed,
  findEndPointRelCoords,
  findRemRelCoords,
  converttocoords,
  findchildCoords,
  findparentCoords
} from "./PgmStrChartUtils";
import { positionLines } from "./Line";

import * as d3 from "d3";
import Button from "@material-ui/core/Button";

var gRemRels;
let gRemRelEntities=[];
//let currentPgm = '';
let contextPgm;
var initialScale = 0.25;
var i =0;
var tfx=200;
var tfy=200;

export default function PgmStruChart(props) {
  const { classes } = props;
 
   useEffect(() => {
    
    drawPgmStrChart();

    
    
  
  }, [props.PgmStrData, props.mainWindowState, props.DUDProgramData.program]);
  
  function bringToPos()
  {
     
     var grpid= `grpid${contextPgm.PGMID}${contextPgm.index}`;
    
    
      var curpos = document.getElementById(grpid).getBoundingClientRect();
      
      
      var tgtpos = { x : 150, y:200};
      var transval = { x: tgtpos.x-curpos.x, y: tgtpos.y - curpos.y}; 
      var grptrans= d3.select(`#grpmain`).attr('transform');
      console.log("whats in curpos",grptrans, curpos, transval);
      var tempCoords = grptrans.substring(10, grptrans.length - 1);
      var x = parseFloat(tempCoords.split(',')[0])+transval.x;
      var y = parseFloat(tempCoords.split(',')[1])+transval.y;

      console.log(x,y);
      d3.select(`#grpmain`).attr("transform", "translate(" + parseFloat(x) +
      "," +
      parseFloat(y) +  ")"+ "scale("+initialScale+")")
      tfx=x;
      tfy=y;
      console.log("XXX==", tfx, tfy);
  }

  function handlePgmStructureChart(){
    //console.log('shilpi handlepgm clicked ',props.ForProgram)
    let progDetails = {};
    //let prog = props.programList.find(o => o.PGMID == currentPgm)
    let prog = props.programList.find(o => o.PGMID == contextPgm.PGMID)
    
     progDetails={
            field: "PGMID",
            //code: prog.PGMID,
            text: prog.PGMTX,
            value: prog.PGMID,
             
          };
          //console.log('shilpi progdetails',progDetails)
          
          props.setProgramStructureChart(progDetails)
          //props.pgmLinksHandler("pgmStrChart",progDetails);
        
  }

  function handleDataUsage(){
    //console.log('shilpi handledatausage clicked ')
    //let progDetails = [];
    let prog = props.programList.find(o => o.PGMID == contextPgm.PGMID)
     let progDetails={
            field: "PGMID",
            //code: prog.PGMID,
            text: prog.PGMTX,
            value: prog.PGMID, 
            
          };
     //props.linkClickHandler('','but27',progDetails,'Data Usage','LBContext','')
     if (contextPgm.POS === "LT")
     props.linkClickHandler("DATAUSAGE",progDetails);
     else{

     props.linkClickHandler("PGMSC_DU",progDetails);
     }
     //props.pgmLinksHandler("pgmDataUsage",progDetails);
 
    }
  function drawPgmStrChart() {
    console.log("yahan kitti baar aaya")
    if(props.PgmStrData.diagData.length == 0){

    // d3.select("#PSCcontainerTree").selectAll("svg").remove();
    //d3.select("#PSCcontainerTree").select("#svg1").remove();
    d3.select("#svg1").remove();

   
   
    const svg = d3
    .select("#PSCcontainerTree")
    .append("svg")
    .attr("id", "svg1")
    .attr("width", 3000)
    .attr("height", 3000)
    .append("g")
    .attr("id", "grpmain2")
    .attr(
      "transform",
      "translate(" +
        0 +
        "," +
        0 +
        ")" 
    );

    let fo1 = svg.append("foreignObject")
    
    .attr("class", "noder")
    .attr("width", 200)
    .attr("height", 1100)
    .attr(
      "style",
      "background:whitesmoke;border: 1px solid;font-size:12px;overflow-y:auto"
    )
    .append("xhtml:body")
    .attr("style", "margin: 1px ")
      /////making heading
    .append("table");

    fo1
      .append("thead")
      .append("tr")
      .attr("style", "background:darkgrey;text: white")
      .append("td");
       /////ends making making heading

    var nodeFo1 = fo1.append("tbody");
    nodeFo1
      .selectAll("foreignObject.noder")

      .data(function (d) {
        return props.programList;
      })
      .enter()
      .append("tr")
      .attr("class", classes.fotable)
      .on("click", function (e) {
        let progDetails = {
        
          field: "PGMID",
          //code: e.PGMID,
          text: e.PGMTX,
          value: e.PGMID, 
        };
        //props.pgmLinksHandler("pgmStrChart",progDetails);
        props
                  .setProgramStructureChart(progDetails);
    
      
        
      })
      .on("contextmenu", function (d) {
        console.log('shilpi table data',d)
        const container = d3.select("#PSCcontainerTree").node();
        console.log('shilpi container',container)
        d3.event.preventDefault();
        const position = d3.mouse(container);
        const posX = position[0] + 10 * .25;
        const posY = position[1];
  
        var g = d3.select("#d3contextMenu")
          .style("top", "" + posY + "px")
          .style("left", "" + posX + "px")
          .style("width","150px")
          .style("height","75px")
          .style("visibility", "visible")
          .style("z-index", 1)
          .on("click",function(){
            console.log('clicked',d.PGMID )
            //currentPgm = d.PGMID;
            contextPgm = {PGMID : d.PGMID,  POS : "LT"};
            
          })
        d3.selectAll('body').on("click", function (d) {
          const container = d3.select("#PSCcontainerTree").node();
          d3.event.preventDefault();
          const position = d3.mouse(container);
          d3.select("#d3contextMenu")
            .style("top", "" + 0 + "px")
            .style("left", "" + 0 + "px")
            .style("width","0px")
            .style("height","0px")
            .style("visibility", "hidden");
        });
  
        //context.pgmName = d.data.name;
        d3.event.stopPropagation();
      })
      .append("td")
      .attr("class",classes.focell)
      /*.style("background",function(d){
        //console.log('sa_val',d)
        if(d.PGMID == props.ForProgram[0].value){
          return "lightblue"
        }
      })*/
      .text(function (e) {
        return e.PGMID + "(" + e.PGMTX + ")";
      });
      return;
    }
    var res = props.PgmStrData.diagData[0].data

    const pgmdefs = props.programList;
    const schemaBoxes = props.PgmStrData.schemaBoxes
    //console.log('shilpi_pgm res', res)
    const [PgmStrChart, RemRels, Diagram, levelsCount, DiagramBoxes] = res;
    const levelWidths = [];
  let level = 0;
  gRemRels = RemRels;
  console.log('shilpi gremrels',gRemRels)
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
  }

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
      treewidth = 1200 + maxSum * 350;
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
    if (maxSum < 20) {
      treedepth = 6000;
    } else {
      treedepth = (6000 * maxSum) / 30;
    }
  }
  const treeLayout = d3.tree().size([treewidth, treedepth]);

  //////////////////////////////////////////
  console.log("whats in PgmStrChart", PgmStrChart);
  const root1 = d3.hierarchy(PgmStrChart, function (d) {
    return d.children;
  });
  console.log("whats in root==", root1);

 // context.diagData = root1;   //TO_DO context
 /* zoom_change start */
 
/* zoom_change end */
  d3.select("#PSCcontainerTree").selectAll("svg").remove();
  /* for no pgmrels case */
  if(height == 0){
    height = 3000
  }
  ///////////////////////////////////
  
  if(props.mainWindowState==="PGMSCHART") { tfx=200;tfy=200;}
  if(props.mainWindowState==="PGMSC_DU") {
    tfx=0;tfy=200
    
  }
  const svg = d3
    .select("#PSCcontainerTree")
    .append("svg")
    .attr("id", "svg1")
    .attr("width", width)
    .attr("height", height);
    let grpmain=svg
    .append("g")
    .attr("id", "grpmain")
    .attr(
      "transform",
      "translate(" +
        tfx +
        "," +
        tfy +
        ") scale(" +initialScale +")"
    );
    
       
       let zoom = d3.zoom().on("zoom", function (event) {
       grpmain.attr("transform", d3.event.transform);
      });
      svg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity.translate(tfx, tfy).scale(initialScale))
       .on("dblclick.zoom", null)
      .on("wheel.zoom", null);
    
      d3.select("#zoomIn").on("click", function () {
      console.log("inside zoomin");
       zoom.scaleBy(svg.transition().duration(750), 1.05 );
       
    });
    d3.select("#zoomOut").on("click", function () {
       zoom.scaleBy(svg.transition().duration(750), 0.95);
       
      
    });

  if (props.mainWindowState==="PGMSCHART"){  
  const svg2 = d3
    .select("#svg1")
    .append("g")
    .attr("id", "grpmain2")
    .attr(
      "transform",
      "translate(" +
        0 +
        "," +
        0 +
        ")" 
    );

    //adding table for list of programs
    //let fo1 = d3
    //  .select("#grpmain2")
      let fo1 = svg2.append("foreignObject")
      //.attr("x", 20)
      //.attr("y", 10)
      .attr("class", "noder")
      .attr("width", 200)
      .attr("height", 1100)
      .attr(
        "style",
        "background:whitesmoke;border: 1px solid;font-size:12px;overflow-y:auto"
      )
      .append("xhtml:body")
      .attr("style", "margin: 1px ")
        /////making heading
      .append("table");

      fo1
        .append("thead")
        .append("tr")
        .attr("style", "background:darkgrey;text: white")
        .append("td");
         /////ends making making heading

      var nodeFo1 = fo1.append("tbody");
      nodeFo1
        .selectAll("foreignObject.noder")

        .data(function (d) {
          console.log('SHILPIABC')
          console.log('shilpi_du programList',props.programList)
          //newList = processList(props.programList)
          return props.programList;
        })
        .enter()
        .append("tr")
        .attr("class", classes.fotable)
        .on("click", function (e) {
          console.log("shilpi_du row clicked",e);
          let progDetails = {
            field: "PGMID",
            //code: e.PGMID,
            text: e.PGMTX,
            value: e.PGMID, 
          };
          console.log('shilpi progdetails2',progDetails)
                 
          //props.pgmLinksHandler("pgmStrChart",progDetails);
          props.setProgramStructureChart(progDetails);

          
        })
        .on("contextmenu", function (d) {
          console.log('shilpi table data',d)
          const container = d3.select("#PSCcontainerTree").node();
          console.log('shilpi container',container)
          d3.event.preventDefault();
          const position = d3.mouse(container);
          const posX = position[0] + 10 * .25;
          const posY = position[1];
    
          var g = d3.select("#d3contextMenu")
            .style("top", "" + posY + "px")
            .style("left", "" + posX + "px")
            .style("width","150px")
            .style("height","75px")
            .style("visibility", "visible")
            .style("z-index", 1)
            .on("click",function(){
              console.log('clicked',d.PGMID )
              //currentPgm = d.PGMID
              contextPgm = {PGMID : d.PGMID,  POS : "LT"};
            })
          d3.selectAll('body').on("click", function (d) {
            const container = d3.select("#PSCcontainerTree").node();
            d3.event.preventDefault();
            const position = d3.mouse(container);
            d3.select("#d3contextMenu")
              .style("top", "" + 0 + "px")
              .style("left", "" + 0 + "px")
              .style("width","0px")
              .style("height","0px")
              .style("visibility", "hidden");
          });
    
          //context.pgmName = d.data.name;
          d3.event.stopPropagation();
        })
        .append("td")
        .attr("class",classes.focell)
        .style("background",function(d){
          //console.log('sa_val',d)
          // if(d.PGMID == props.ForProgram[0].value){
            if(d.PGMID == props.PgmStrData.program.value){
            return "lightblue"
          }
        })
        .text(function (e) {
          return e.PGMID + "(" + e.PGMTX + ")";
        });

      }////end of if


  d3.select(".node").classed("visited", false);
  const scale = .25;
  const treeData = treeLayout(root1);

  const getPgmFullName = (name, pgmdefs) => {
    const result = pgmdefs.filter((pgmdef) => pgmdef.PGMID === name);
    if (result.length > 0) {
      return result[0];
    } else return {};
  };

  const nodes = treeData.descendants();
  const links = treeData.links();
  console.log('shilpi nodes',nodes)
  let DiagrammedEntities = [];
  var i, j;
  var chldInfoArray = [];

  const g1 = grpmain.append("g");
  const g2 = grpmain.append("g");
  // const g3 = grpmain.append("g");
  // const g4 = grpmain.append("g");
  //console.log('SHILPI', g1.selectAll("g"))
  
  g1.selectAll("g")
    .data(links)
    .enter()
    .append("line")
    .style("fill", "none")
    .attr("stroke", function (d) {
      return "black";
    })
    .attr("stroke-width", function (d) {
      return 5;
    })
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });


    /* Below code add a bubble over lines 
    g1.selectAll("g")
    .data(links)
    .enter()
    .append("circle")
    .attr("cx",function(d){
      return((d.source.x + d.target.x)/2)
    })
    .attr("cy",function(d){
      return((d.source.y + d.target.y)/2)
    })
    .attr("r",20)
    .style("cursor","pointer")
    .on("click", function (d) {
      d3.select(this).append("foreignObject")
      .attr("width", 800) //710
      .attr("height", 800)
      .append("xhtml:div")
      .attr("class", function (d) {
        return "RectContent2";
      })
      .style("overflow-y", "scroll")
    });*/

    /*.on("click", function (d,i) {
      var id = `grpid${d.data.name}${i}`
      d3.select("#"+id).append("foreignObject")
      .attr("width", 900) //710
      .attr("height", 900)
      .append("xhtml:div")
      .attr("class", function (d) {
        return "RectContent1";
      })
      .style("overflow-y", "scroll")
      .html(function (d) {*/


      /*newRemRels = findRemRelCoords(RemRels,root1.descendants())
      newRemRels = newRemRels.map((rel)=>{return converttocoords(rel)})*/
      for (i = 0; i < nodes.length; i++) {
        //if (nodes[i].data.children.length) {
        if (nodes[i].children != null) {
  
          //get child info
          console.log('children len and pgmname', nodes[i].children.length, nodes[i].data.name);
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
              "chldId": name,
              "chldLev": depth,
              "chldXLFTP": cords.x-300,
              "chldYLFTP": cords.y-300,
              "rlnID": nodes[i].data.name + ':' + name
            });
          }
          //console.log('chldInfoArray', chldInfoArray);
          var depth = nodes[i].depth;
          /*if (DiagramType == 'D' && isDummyNode){
            depth =   depth -1;
          }*/
          DiagrammedEntities.push({
            "XLFTP": nodes[i].x-300,
            "YLFTP": nodes[i].y-300,
            "Level": depth,
            "DgeID": i + 1,
            "PgmName": nodes[i].data.name,
            "chldInfoArray": chldInfoArray
          });
        }
      }
      for (i = 0; i < gRemRels.length; i++) {
        let newID = gRemRels[i].relID.split(":");
        let par = newID[0];
        let chld = newID[1];
        let cords = findchildCoords(newID[1], nodes);
       
        if (cords == undefined) {
          continue;
        }
    
        let DgmObj = DiagrammedEntities.find(DgmObj => DgmObj.PgmName == newID[0]);
        if (DgmObj == undefined) {
          DgmObj = new Object();
          let chldInfoArray = [];
          
          let parCords = findchildCoords(newID[0], nodes);
         
          DgmObj["XLFTP"] = parCords.x -300;
          DgmObj["YLFTP"] = parCords.y -300;
          DgmObj["Level"] = parCords.depth;
          DgmObj["DgeID"] = 1;
          DgmObj["PgmName"] = newID[0];
          DgmObj["chldInfoArray"] = chldInfoArray;
          DiagrammedEntities.push(DgmObj);
        }
        if(DgmObj.Level < cords.depth){
        DgmObj.chldInfoArray.push({
          "chldId": newID[1],
          "chldLev": cords.depth,
          "chldXLFTP": cords.x-300,
          "chldYLFTP": cords.y-300,
          "rlnID": newID[0] + ':' + newID[1]
        });
      }
        //DgmObj = DiagrammedEntities.find(DgmObj => DgmObj.PgmName == newID[0]);
        //  console.log('new DgmObj', DgmObj);
      }
     DiagrammedEntities = DiagrammedEntities.filter(function( obj ) {
        return obj.chldInfoArray.length !== 0;
    });
      console.log('SHILPI DiagrammedEntities',DiagrammedEntities)

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
    );    /* for each box */
    console.log('Shilpi Program name',ProgramName)
    console.log('Shilpi filtered objProps ', objProps) /* now loop for all props of any box*/
    const finalprops = objProps.map((objProp) => {
      //console.log('shilpi  objProps',objProp)
      return (
        "<div class='schemaBoxes'> <p>" +
        "PGM" +
        ":" +
        objProp.PGMID +
        "</p>" +
        "<p>" +
        "SHORTNM" +
        ":" +
        objProp.SHORTNM +
        "</p>" +
        "<p>" +
        "LEN" +
        ":" +
        objProp.LEN +
        "</p>" +
        "<p>" +
        "DECP" +
        ":" +
        objProp.DECP +
        "</p>" +
        "<p>" +
        "DTATYP" +
        ":" +
        objProp.DTATYP +
        "</p>" +
        "<p>" +
        "FLDDBCLS" +
        ":" +
        objProp.FLDDBCLS +
        "</p>" +
        "<p>" +
        "FLDSCNCLS" +
        ":" +
        objProp.FLDSCNCLS +
        "</p>" +
        "<p>" +
        "ENTID" +
        ":" +
        objProp.ENTID +
        "</p>" +
        "<p>" +
        "VIEWID" +
        ":" +
        objProp.VIEWID +
        "</p>" +
        "<p>" +
        "FTXT" +
        ":" +
        objProp.FTXT +
        "</p>" +
        "<p>" +
        "FSEQ" +
        ":" +
        objProp.FSEQ +
        "</p>" +
        "<p>" +
        "DIRNM" +
        ":" +
        objProp.DIRNM +
        "</p>" +
        "<p>" +
        "APPNM" +
        ":" +
        objProp.APPNM +
        "</p>" +
        "<p>" +
        "PGMTX" +
        ":" +
        objProp.PGMTX +
        "</p>" +
        "<p>" +
        "ENTTX" +
        ":" +
        objProp.ENTTX +
        "</p>" +
        "</div>"
      );
    });
    return finalprops.join("");
  };



  const node = grpmain.selectAll("g.node").data(nodes, function (d, i) {
    return d.id || (d.id = i);
  });
  console.log('shilpi Printing nodes in data',nodes)

  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("id", function (d, i) {
      return `grpid${d.data.name}${i}`;
    })
    

  // Add Rectangle for the nodes
  nodeEnter
    .append("foreignObject")
    .attr("width", 710)
    .attr("height", 700)
    .append("xhtml:div")
    .attr("class", classes.RectContent)
    .style("overflow-y", "scroll")
    
    .html(function (d,i) {
      const progProps = PgmInfo(d.data.name, schemaBoxes);
      const class1 = classes.Program     //"Program";
      const class2 =  classes.largeFont   //"largeFont";
      const class3 = classes.fullPgmName;
      const plusbut = classes.plusbut;
      const fullPgmName = getPgmFullName(d.data.name, pgmdefs);

      console.log('shilpi fullPgmName', fullPgmName)
      if (fullPgmName.PGMTX) {
        return (
          "<div><div class=" +
          class1 +
          ">" +
          d.data.name +
           
          "</div><div class="+ class1+`><button id=but`+`${d.data.name+i} class=`+plusbut + ">+</button></div>"+
          "</div>" +
          "<div class=" +
          class2 +
          ">" +
          "<div class=" +
          class3 +
          " ><p>" +
          fullPgmName.PGMTX + 
          
          
          
          "<p></div>" +
          progProps +
          "</div>"   /* end of div largefont cont. fullpgmname and schemaboxes */
        );
      } else {
        return (
          "<div class=" +
          class1 +
          "><h3>" +
          d.data.name +
          "</h3>" +
          "</div> <div class=" +
          class2 +
          ">" +
          "<div class=" +
          class3 +
          " ><p>" +
          "duplicate" +
          "<p></div>" +
          progProps +
          "</div>"
        );
      }
    })
    .on("click", function(d,i){
      contextPgm = {PGMID : d.data.name,  POS : "DB", index:i};
      console.log("clicked===", d,i)
      
      handleDataUsage();


    })
///adding button




     ;
  
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
    .attr("transform", function (d) {
      return "translate(" + (d.x - 300) + "," + (d.y - 300) + ")";
    })
    .on("contextmenu", function (d) {
      console.log('shilpi d',d)
      const container = d3.select("#PSCcontainerTree").node();
      console.log('shilpi container',container)
      d3.event.preventDefault();
      const position = d3.mouse(container);
      const posX = position[0] + 10 * .25;
      const posY = position[1];

      var g = d3.select("#d3contextMenu")
        .style("top", "" + posY + "px")
        .style("left", "" + posX + "px")
        .style("width","150px")
        .style("height","75px")
        .style("visibility", "visible")
        .style("z-index", 1)
        .on("click",function(){
          console.log('clicked',d.data.name )
          //currentPgm = d.data.name
          contextPgm = {PGMID : d.data.name,  POS : "DB"};
          
        })
        console.log('shilpi g', g)
      d3.selectAll('body').on("click", function (d) {
        const container = d3.select("#PSCcontainerTree").node();
        d3.event.preventDefault();
        const position = d3.mouse(container);
        d3.select("#d3contextMenu")
          .style("top", "" + 0 + "px")
          .style("left", "" + 0 + "px")
          .style("width","0px")
          .style("height","0px")
          .style("visibility", "hidden");
      });

      //context.pgmName = d.data.name;
      d3.event.stopPropagation();
    });
    if(props.mainWindowState=="PGMSC_DU")
    {
    bringToPos();
    var grpid= `grpid${contextPgm.PGMID}${contextPgm.index}`;
    console.log("what the k factor===",tfx, tfy);
    drawDFD(props, grpid);
    }
 

 };

  return (
    <div id="PSCmaincontainer" >
      <div className={classes.caption}>
        <span className={classes.span}>
        {/*{props.NavListData[0].label}  {props.ForProgram ===""? null : props.ForProgram[0].value+': '+props.ForProgram[0].text} */}
        Program Structure Chart {props.PgmStrData.program=="" ? null : props.PgmStrData.program.value}
        
        </span>
       </div>
      {/*zoom_change start */}
      {props.mainWindowState==="PGMSCHART" ? 
      <div  id="zoomcontainer"
        style={{
          width: "150px",
          left: "0px",
          top:"0px",
          backgroundColor: "whitesmoke",
          borderRadius: "25px",
          padding:"0px 20px 0px 20px",

          position: "relative",
          // zIndex: 10,
        }}>
      <Button
            variant="contained"
            size="small"
            id="zoomIn"
            //onClick={}
           // className={classes.buttonZoomInStyle}
            color="primary"
          >
            +
          </Button>&nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            size="small"
            id="zoomOut"
            //onClick={}
           // className={classes.buttonZoomInStyle}
            color="primary"
          >
            -
          </Button>

      </div> : null }
     
      {/* zoom_change end */}
      
      <div id="PSCcontainerTree">
       
        <div className={classes.d3contextMenu} id="d3contextMenu">
           <div className={classes.d3contextItem} onClick={handlePgmStructureChart} >
             <p className={classes.d3menuItem}>{`Go to PgmStructureChart`}</p>
            </div>
            <div className={classes.d3contextItem} onClick={handleDataUsage}>
              <p className={classes.d3menuItem}>{`Go to DataUsage`}</p>
            </div>
        </div>
        
      </div>
      
      
    </div>
  );
}


function drawline(d) {
  var path;
  //if (d.x5 == undefined) {

  //check if we have any crossing points
  
  
  
  
    if (d.x5 == undefined) {
      path = 'M' + d.x1 + ',' + d.y1 + 'L' + d.x2 + ',' + d.y2 + 'L' + d.x3 + ',' + d.y3 + 'L' + d.x4 + ',' + d.y4;
    }
    else {
      path = `M ${d.x1} ${d.y1}
     L ${d.x2} ${d.y2}
     L ${d.x3} ${d.y3}
     L ${d.x4} ${d.y4}
     L ${d.x5} ${d.y5}
     L ${d.x6} ${d.y6}`
    }
  
  return path;
}
