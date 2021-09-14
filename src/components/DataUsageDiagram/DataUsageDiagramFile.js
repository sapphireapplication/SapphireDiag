import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import * as d3 from "d3";
import $ from 'jquery';
import CodeEditor from "./sourceBrowser";
import { setDataUsageFileList} from "../../actions/setDataUsageFileActions";
import {setDataUsageFile} from "../../actions/DataUsageDiagram/DataUsageFileAction";
import {setSourceBrowser} from "../../actions/DataUsageDiagram/SourceBrowserAction";
import { useParams } from "react-router-dom";
import { Link} from "react-router-dom";
import DMDChart from '../DMDChart';

var rowId;
var svg;
var factor;
var gsrcb = {};
var srcData;

var pathTransitionFlag = 0;
const mapStateToProps = (state) => {
 
  console.log('shilpi dudfile mapStateToProps',state.fetchDUDFileReducer)
  console.log('check this',state.fetchSourceBrowserReducer)
  srcData = state.fetchSourceBrowserReducer.pgmCodeData

  return {
  // dataUsageFileList: state.fetchDataUsageFilesReducer.dataUsageFileList, SA_ST
    dataUsageFileList: state.fetchDataUsageFilesReducer,
    DUDFileData: state.fetchDUDFileReducer, //shilpi
    sourceBrowserData:  state.fetchSourceBrowserReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  console.log('shilpi dudfile mapdispatch mapStateToProps')
  let entity= {value:"default", text:""}

  return {

    setDataUsageFileList: async()=> {
          await dispatch(setDataUsageFileList())
          
      },
      setDataUsageFile: (entity) => {
        Promise.resolve( dispatch(setDataUsageFile(entity)))
      },
      setSourceBrowser: async(program)=> {
        await dispatch(setSourceBrowser(program))
    }   
      
      
  }
}

 function DataUsageDiagramFile(props) {
  console.log("props to dikha do==", props);
  console.log('window loc', window.location.href)
  const params = useParams()  //reads the param in route path
  console.log('this params',params)
  
  const { classes } = props;
const [dmddata, setDMDData] = useState({
    value: 'default',
    text: '',
  });
  //DBNAME = params.dbname;
  DBNAME = props.authDetails.dbName;
  //IPADDR = props.authDetails.ipAddr;
  //PORT = props.authDetails.port;
  SERVERADDR = 'https://'+props.authDetails.ipAddr+':'+props.authDetails.port;
  //SERVERADDR = 'https://'+props.authDetails.ipAddr+'/sapphiressl';
  console.log('serverip',SERVERADDR)
  //console.log('dbname, ipaddr, port',DBNAME,IPADDR,PORT)
  
  var SELENTITY = { codedata: [], entity: "" };
  var PGMCODE = [];
  var FTXT = "";
  let currentPgm = '';
  var entid;
  var margin = { top: 20, right: 90, bottom: 30, left: 90 },
  width = 5000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;
  
  let k = 0;
  const [srcbpgm, setLoad] = useState({linenum:"", value:"", text:"", shortnm:""});

  useEffect(() => {
    console.log('case hit')
    props.setDataUsageFile(props.datausgfile);
   
  },[props.datausgfile]);

  useEffect(() => {
    console.log('case Double hit');
    props.setDataUsageFile(props.datausgschema);
  }, [props.datausgschema]);
  useEffect(() => {
    if(!props.hasOwnProperty('datausgfile')){
    props.setDataUsageFileList();
              
      props.setDataUsageFile({ value: 'default', text: '' });
        
    }
        
  },[]); //empty means will be called only once

 
  useEffect(() => {
   
      console.log('only once props',props);
      if( props.DUDFileData.DUDFileData !==""){
        console.log('in if')
        if (d3.select("#dudfilesvg")["_groups"][0][0] !== null)
        //removing the existing svg , if anys
        d3.select("#dudfilesvg").remove();
        svg = d3
      .select("#dudfilecontainerTree")
      .append("svg")
      .attr("id", "dudfilesvg")
      .attr("width", width)
      //.attr("height", 500)
      .attr("height",  2600000)  //6000
      //.attr('x',0)
      //.attr('y',5000)
      .append("g")
      .attr("id", "dudfiletable")
     
      .attr( 'transform',
       'translate(' +
          0 +
          ',' +
          850 +    //850 100000
           ')'  );

           let fo1 = svg
           .append('foreignObject')
           //.attr("x", 20)
           //.attr("y", 10)
           .attr('class', 'noder0')
        .attr('id', 'fileList')
           .attr('width', 300) //SA_WID
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
       
        return props.dataUsageFileList.dataUsageFileList;
      })

      .enter()
      .append('tr')
        .attr('class', classes.fotable2)
        .attr('style', 'cursor:context-menu')
        .attr('id', function (d, i) {
          return `tr${i}`;
        })
      
        .selectAll('td')
        .data((d,i) => {
         
          entid = props.dataUsageFileList.dataUsageFileList[i].ENTID.trim()
          
          const parent = props.dataUsageFileList.entrels.filter((rel) => rel.PAR.trim() ==entid || rel.CHLD.trim() == entid);
          if(parent.length == 0){
            return ['', d.ENTID.trim(), ':', d.ENTTX.trim(), '>'];
           // return [d.ENTID.trim(), ':', d.ENTTX.trim(), '+'];
          }
          else
          return ['+', d.ENTID.trim(), ':', d.ENTTX.trim(), '>'];
        })
        .enter()
      .append('td')
        .attr('class', (x, i) => {
        /*  if (i == 0 || i == 4) return classes.dfdfocell;
          else return classes.focell;*/
          if((i == 0 && x == '+') || i == 4) return classes.dfdfocell
          else return classes.focell
        })
        .attr('style', (x, i) => {
          if(i == 0) {
            if(x == '+')return 'max-width:3px;box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);';
            return 'max-width:3px';
          }
          else if (i == 2) return 'max-width:1px';
          else if (i == 3) 
          //return 'max-width:15px';
          return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:25px;';
          else if ( i == 4)
            return 'max-width:3px;box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);font-weight:bold';
          else
            return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;text-align:left;max-width:18px;';
        })
        .attr('title', (x, i) => {
          if (i === 0) {
            return 'Expand DMD';
          } else if (i === 1 || i === 3) {
            return x;
          } else if (i === 4) {
            return 'Expand Datausage';
          }
      })
        .on('click', (d, i) => {
          var data = props.dataUsageFileList.dataUsageFileList;
          var tempRowId; 
          var rowid;
          var cell;
         // console.log('on click rowid ',event.target.parentNode.parentNode.id)
          //console.log('on click index ',i)
          //tempRowId = tempRowId.replace('tr', '');
          //console.log('tempRowId',tempRowId,data)
          if (i == 0) {
            rowid = event.target.parentNode.id;
            if(rowid != ''){
              cell =  $(`#${rowid} td:nth-child(1)`)[0].innerHTML;
             //console.log('cell',cell)
             if(cell ==  '') return;
            }
            $("tr[id^='tr']").removeClass(`${classes.highlight}`);
            $("tr[id^='tr'] td").removeClass(`${classes.highlightIcon}`);
            tempRowId = String(event.target.parentNode.parentNode.id);
            tempRowId = tempRowId.replace('tr', '');
            if (tempRowId == '') {
              /*this case comes when click is done outside the model icon but within the cell */
            tempRowId = String(event.target.parentNode.id);
              $(`#${tempRowId}`).toggleClass(`${classes.highlight}`);
              $(event.target).toggleClass(`${classes.highlightIcon}`);
            tempRowId = tempRowId.replace('tr', '');
            } else {
              var tempZz = String(event.target.parentNode.parentNode.id);
              $(`#${tempZz}`).toggleClass(`${classes.highlight}`);
              $(event.target.parentNode).toggleClass(
                `${classes.highlightIcon}`
              );
            }
            var offsetTop = Math.abs($(`#tr${tempRowId}`).offset().top-850 );   // -850
            console.log('shi_offsetTop',offsetTop)
            let entDetails = {
              field: 'ENTID',
              text: data[tempRowId].ENTTX,
              value: data[tempRowId].ENTID,
              yPos:offsetTop,
            };
            setDMDData(entDetails);
          } else if (i === 4) {
            $("tr[id^='tr']").removeClass(`${classes.highlight}`);
            $("tr[id^='tr'] td").removeClass(`${classes.highlightIcon}`);
            $("tr[id^='tr'] td:nth-child(5)").text('>');
            tempRowId = String(event.target.parentNode.id);
            $(`#${tempRowId}`).toggleClass(`${classes.highlight}`);
            $(event.target).toggleClass(`${classes.highlightIcon}`);
            $(event.target).text('-');
            tempRowId = tempRowId.replace('tr', '');
            rowId = tempRowId;
            console.log('rowId kya hai', rowId);
            let progDetails = {
              field: 'ENTID',
              code: data[tempRowId].ENTID.trim(),
              text: data[tempRowId].ENTTX.trim(),
              value: data[tempRowId].ENTID.trim(),
            };
            d3.select("#dudfiletable").select('#grpmain').remove() //remove dmd if present
            setDMDData({   value: 'default', text: '',}) //SA_DEMO
            props.setDataUsageFile(progDetails, props);
            props.setSourceBrowser(progDetails)
          }
        })
        .html((d, i) => {
          
          if (i === 0) {
            if(d == '+')
            return '<i class="fas fa-project-diagram"></i>';
            else
             return ""
          }
          return d;
      });

      
      //fixes start
      //document.body.scrollTop = 0; // For Safari
      //document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  console.log('yahan aaya')
      $('html , body').animate(
        { scrollTop: 850 },   //850
        {
          duration: 1000,
          complete: () => {
          },
        }
      );
      }
      /*if(params.hasOwnProperty('entid')){
      //handling for param in route 
      var arrind = props.dataUsageFileList.findIndex(
        (row) => row.ENTID.trim() === params.entid.toUpperCase().trim()
      );
      rowId = arrind; //store in global var

      var selectedRow = document.getElementById(`tr${rowId}`);

      if (selectedRow !== null) {
        console.log('checking', selectedRow);
        $('#tr' + rowId)[0].scrollIntoView({
          behavior: 'auto',
          block: 'center',
          //inline: 'center',
        });
      }

      let prog = props.dataUsageFileList.find(o => o.ENTID.trim() == params.entid.toUpperCase().trim())
      let enttx = '';
      console.log('check_prog',prog)
      if(prog !=undefined)
       enttx = prog.ENTTX;
      let progDetails ={
          field: "ENTID",
          code: params.entid.toUpperCase().trim(),  
          text:  enttx,  //d.ENTTX.trim(),
          value: params.entid.toUpperCase().trim(), 
        }
        props.setDataUsageFile(progDetails,props);
      }
      
  },[props.dataUsageFileList]); //empty means will be called only once*/
  if (params.hasOwnProperty('entid')) {
    //handling for param in route
    var arrind = props.dataUsageFileList.dataUsageFileList.findIndex(

      (row) => row.ENTID.trim() === params.entid.toUpperCase().trim()
    );
    console.log('arrind',arrind)
    rowId = arrind; //store in global var
    var selectedRow = document.getElementById(`tr${rowId}`);

    if (selectedRow !== null) {
      console.log('checking', selectedRow);
      $('#tr' + rowId)[0].scrollIntoView({
        behavior: 'auto',
        block: 'center',
        //inline: 'center',
      });
    }
    let prog = props.dataUsageFileList.find(
      (o) => o.ENTID.trim() == params.entid.toUpperCase().trim()
    );
    let enttx = '';
    console.log('check_prog', prog);
    if (prog != undefined) enttx = prog.ENTTX;
    let progDetails = {
      field: 'ENTID',
      code: params.entid.toUpperCase().trim(),
      text: enttx, //d.ENTTX.trim(),
      value: params.entid.toUpperCase().trim(),
    };
    props.setDataUsageFile(progDetails, props);
  }
}, [props.dataUsageFileList.dataUsageFileList]); //empty means will be called only once

  useEffect(() => {
    console.log('in second', props.DUDFileData.DUDFileData.ID)
    if(props.DUDFileData.DUDFileData.ID!='default' && props.DUDFileData.DUDFileData.ID!=undefined ){
      console.log('check rowid',rowId)
      setLoad({linenum:"", value:"", text:"", shortnm:""})
      //d3.select('#dudfiletable').attr('transform','translate(0,100)')
      drawDFD1()
      //now call update

    }
    
  },[props.DUDFileData.DUDFileData]);  //this will be called every time new row is clicked in table

  
  function drawDFD1() {
    console.log('drawdfd1 called ');
    var rootxPos;
    var rootyPos;
    if (
      props.hasOwnProperty('datausgfile') &&
      props.datausgfile.value != 'default' &&
      props.datausgfile.type == 'schema click'
    ) {
      console.log('Draw DFD Schema Called');
      var firstChildernIndex, tempArray, propsId, propsText;
      propsId = props.datausgfile.value;
      propsText = props.datausgfile.text;
      tempArray = props.DUDFileData.DUDFileData.children;
      for (var i = 0; i < tempArray.length; i++) {
        if (
          tempArray[i].HEADID == propsId &&
          tempArray[i].HEADTEXT == propsText
        ) {
          firstChildernIndex = i;
          break;
        }
      }
      console.log('index', firstChildernIndex);
      var treeData = {
        ID: propsId,
        TEXT: propsText,
        children: [
          props.DUDFileData.DUDFileData.children[firstChildernIndex]
            .children[0],
        ],
      };
    } else var treeData = props.DUDFileData.DUDFileData;

    // Set the dimensions and margins of the diagram
    //var margin = { top: 20, right: 90, bottom: 30, left: 0 },
    var margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = 5000 - margin.left - margin.right,
      height;


    //delete any existing rightsvg
    if (d3.select("foreignObject[id^='rightSvg']")["_groups"][0] !== null)
    d3.select("foreignObject[id^='rightSvg']").remove();
    d3.select('#helperGroup').remove();

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
    /*var subRtFocus = document.getElementById(`tr` + rowId);
    console.log('subRtFocus.getBoundingClientRect()',subRtFocus.getBoundingClientRect())
    var x = subRtFocus.getBoundingClientRect().x
    var y = subRtFocus.getBoundingClientRect().y
    console.log('check rowid clicked', rowId);
    console.log('check offset top clicked',$(`#tr${rowId}`).offset().top );*/

    //case for structure chart integration

    var rightSvg;
    var treegrp;
    if (
      props.hasOwnProperty('datausgfile') &&
      props.datausgfile.value != 'default' &&
      props.datausgfile.type == 'program click'
    ) {
      var grptrans = d3
        .select(`#${props.datausgfile.tgtgrpid}`)
        .attr('transform');
      var tempCoords = grptrans.substring(10, grptrans.length - 1);
      var x = parseFloat(tempCoords.split(',')[0]) + 1000.0;    //610->1000
      var y = parseFloat(tempCoords.split(',')[1]);
      factor = height / 2;
      var forObjectYPos1 = y - (height / 2) * 4 + 50;
    /* if number of childern are even  add +15 in forgn object for alignemnt*/
      console.log('shilpi check num', num, height);
      if (num % 2 !== 0) {
        forObjectYPos1 = forObjectYPos1 - 80;
       }

      rightSvg = d3
        .select(`#grpmain`)
        .append('g')
        .attr('id', 'helperGroup')
        .attr('transform', `translate(0,${props.datausgfile.yPos})`)
        .append('foreignObject')
        .attr('id', `rightSvgDusgF${props.datausgfile.tgtgrpid}`)
        //.attr('height', svgHeight)
        .attr('width', width*10)
      //  .attr('height', svgHeight + margin.top + margin.bottom)
      .attr('height', height*4+100)
        .attr('x', x)
        .attr('y', forObjectYPos1)
        //.attr('style', 'background-color:white')
        .attr('style', 'background-color: rgba(255, 255, 255, 0.5); ')
        .append('svg')
        .attr('id', 'rightSvg')
        .attr('x','400px')
        .attr('width', '100%') //width
        .attr('height', '100%');  //svgHeight
        
        
        //.attr('transform', ' scale(4)');
      treegrp = rightSvg
        .append('g')
        .attr('transform', `translate(0, 20) scale(4)`); // 20 is margin.top
    } else if (
      props.hasOwnProperty('datausgfile') &&
      props.datausgfile.value != 'default' &&
      props.datausgfile.type == 'schema click'
    ) {
      console.log('testing');
      var grptrans = d3
        .select(`#${props.datausgfile.tgtgrpid}`)
        .attr('transform');
      var tempCoords = grptrans.substring(10, grptrans.length - 1);
      var x = parseFloat(tempCoords.split(',')[0]) + 1000.0; //610->1000
      var y = parseFloat(tempCoords.split(',')[1]);
      factor = height / 2;
      var forObjectYPos1 = y - (height / 2) * 4 + 50;
      console.log('shilpi check num', num, height);
      if (num % 2 !== 0) {
        forObjectYPos1 = forObjectYPos1 - 80;
      }
      rightSvg = d3
        .select(`#grpmain`)
        .append('g')
        .attr('id', 'helperGroup')
        .attr('transform', `translate(0,${props.datausgfile.yPos})`)
        .append('foreignObject')
        .attr('id', `rightSvgDusgF${props.datausgfile.tgtgrpid}`)
        .attr('width', width * 10)
        .attr('height', height * 20 + 100)
        .attr('x', x)
        .attr('y', forObjectYPos1)
        // .attr(
        //   'style',
        //   'background-color:white;border:1px black solid;overflow:auto;height:2000px'
        // )
        .attr('style', 'background-color: rgba(255, 255, 255, 0.5); ')
        .append('svg')
        .attr('id', 'rightSvg')
        .attr('x', '400px')
        .attr('width', '100%') //width
        .attr('height', '4000000px'); //svgHeight
      treegrp = rightSvg
        .append('g')
        .attr('transform', `translate(0, 20) scale(4)`); // 20 is margin.top
    } else {
      console.log('svgheight', svgHeight);
       /* only datausage file case */ 
   console.log('show top rowid',$(`#tr${rowId}`).offset().top, rowId)
    var offsetTop = Math.abs($(`#tr${rowId}`).offset().top - 850);  //850
    console.log('rowid,x,y',rowId, x, y)
    var forObjectYPos = offsetTop - (42*2)-7 - ( height/2)
    /* if number of childern are even  add +15 in forgn object for alignemnt*/
    if(num %2 == 0){
      forObjectYPos = forObjectYPos + 22
    }

   //append foreign object
    rightSvg = d3
   .select(`#dudfiletable`)
   .append('foreignObject')
   .attr('id', 'rightSvgFO')
   //.attr('height', svgHeight)
   .attr('width', width )
   .attr('height', svgHeight + margin.top + margin.bottom )  // calculate height as per tree
   .attr('x', 300) // width of left table  //SA_WID 200-->250
   .attr('y',forObjectYPos )   //-52
   .attr('style', 'background-color:white')
   .append('svg')
   .attr('id','rightSvg')
   .attr('width', '100%')
   .attr('height', '100%');
    treegrp = rightSvg.append('g').attr('transform', `translate(0, 20)`); // 20 is margin.top
  }

   
   var treemap = d3.tree().size([height, width]);
   console.log('height',height)
    root.x0 = height / 2;
    //root.x0 = 950;
    root.y0 = 0;
    //console.log('showroot',root)
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
      var newHeight;
      // Assigns the x and y position for the nodes
      if (source == root) {
        pathTransitionFlag = 1;
      } else if (source != root) {
        pathTransitionFlag = 0;
        console.log('not come here');
         k=0;
        ///// compute additional height
        root.children.forEach(function(d){
          if(d.children && d.children.length > 0)
          k++;
        })
      }
      console.log('shi_k',k)
 
  if(k>1)
  {
  treemap = d3.tree().size([height+(k-1)*120, width])
 
            .separation(function(a, b) {
              return a.parent == b.parent ? 1 : sep   //5
            });
            newHeight = height+(k-1)*120
    }
    else{
      treemap = d3.tree().size([height, width])
  
            .separation(function(a, b) {
              return a.parent == b.parent ? 1 : sep   //5
            });
            newHeight = height
    }
      var treeData = treemap(root);
      /* for SCD only */
      if (
        props.hasOwnProperty('datausgfile') &&
        props.datausgfile.value != 'default' &&
        props.datausgfile.type == 'program click'
      ){
        var elem = d3.select(`#rightSvgDusgF${props.datausgfile.tgtgrpid}`);
      if(elem){  
          console.log('elem', elem);
          if (num == 2) elem.attr('height', newHeight * 12 + 100);
          else if (num == 3) elem.attr('height', newHeight * 6.5 + 300);
          else elem.attr('height', newHeight * 6.5 + 200);
      }
    }

      // Compute the new tree layout.
      var nodes = treeData.descendants();
       // links = treeData.descendants().slice(1);
      var links = treeData.descendants();
      var totNodes = nodes.length;
      console.log('totnodes',totNodes)
      totNodes = totNodes -1
      var midIndex;
      console.log("nodes====", nodes);
      console.log("links====", links);
      console.log('gsrcb',gsrcb)
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
        rootyPos = links[midIndex].y;
        console.log('rootxPos',rootxPos,rootyPos,links[midIndex])
      } 
      var srcbLinks;
       srcbLinks = links.filter((obj) => obj.data.ID =='SRCB' );
      console.log('srcbLinks',srcbLinks)
      if(srcbLinks.length > 1){
      srcbLinks =  srcbLinks.filter((obj)=>obj.parent.parent.data.HEADID != gsrcb.PGMID)
      console.log('after filter',srcbLinks)

      var startIndex = links.findIndex(
        (row) => row.id == srcbLinks[0].id )
        console.log('startIndex',startIndex)
      console.log('gsrcb now',gsrcb.PGMID)
      links.splice(startIndex,1)  //SA_TEMP

       
      }
      

      if(srcbLinks.length > 1){
        //console.log('check this',srcbLinks[0].parent.parent.data.HEADID )
        var startIndex = links.findIndex(
          (row) => row.data.ID == 'SRCB' )
        //console.log('startIndex',startIndex)  
          //links.splice(startIndex,srcbLinks.length-1)  //SA_TEMP


      }
      console.log('links new',links)
      /* shi_check
      if(links.length == 9){
       // list.splice(0, 2); 
        links.splice(7,1)
        console.log('after splice', links)
      }*/
      var x3 = nodes[num].x;
      var tempXSchema = 0;
      var tempXCode = 0;
      var gap = 0;
      if (
        props.hasOwnProperty('datausgfile') &&
        props.datausgfile.value != 'default' &&
        props.datausgfile.type == 'schema click'
      ) {
        tempXSchema = 0;
        tempXCode = 300;
        gap = 150
      } else {
        tempXSchema = 500;
        tempXCode = 850;
        gap = 500
      }

      // Normalize for fixed-depth.
      nodes.forEach(function (d) {
        //console.log('shilpi_DU data', d)
      if ((d.data.TEXT === d.data.ID) & (d.data.ID==='Program')) {
 //d.y = d.depth * 50; //hit and trial change
        if (props.mainWindowState === "PGMSC_DU_FILE")  
         d.y = d.depth * 50; //hit and trial change
       else
        d.y = d.depth * 50;
          
      }
      else if((d.data.TEXT === d.data.ID) & (d.data.ID==='Schema' || d.data.ID =='Brule'))
if (props.mainWindowState === 'PGMSC_DU_FILE')
            //d.y = d.depth * 300 +100;
            d.y = d.depth * 50 + tempXSchema;
          //hit and trial change
          else d.y = d.depth * 50 + tempXSchema;
      else if((d.data.TEXT === d.data.ID) & (d.data.ID==='CODE'))
          if (props.mainWindowState === 'PGMSC_DU_FILE')
            d.y = d.depth * 50 + tempXCode;
          //hit and trial change
          else d.y = d.depth * 50 + tempXCode;
        //hit and trial change
         else if((d.data.TEXT === d.data.ID) & (d.data.ID==='SRCB'))  
            d.y = d.depth * 50 + 1000;
        else d.y = d.depth * 75;
        //d.y = d.depth*150;
      });
      var chldHeight = 30;
      console.log('chldHeight', chldHeight)

      // ****************** Nodes section ***************************

      // Update the nodes...
      var node = treegrp.selectAll("g.node").data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });

    //  console.log(' show now node',node)
     

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d, x) {
           if (d.data.TEXT === d.data.ID && (d.data.ID==='Schema' || d.data.ID=='Brule')) {
            //console.log("transform===", source.y0 + 100, source.x0 - 50, x);
             return (
              "translate(" + (source.y0 + tempXSchema) + "," + (source.x0 ) + ")"   //500
             );
           }
           else if (d.data.TEXT === d.data.ID && d.data.ID==='CODE') {
            //console.log("transform===", source.y0 + 100, source.x0 - 50, x);
             return (
              "translate(" + (source.y0 + 350) + "," + (source.x0 ) + ")"  //250->350
             );
           }
           else if (d.data.TEXT === d.data.ID && d.data.ID==='SRCB') {
            //console.log("transform===", source.y0 + 100, source.x0 - 50, x);
             return (
              "translate(" + (source.y0 + 250) + "," + (source.x0 ) + ")"
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
          else if(d.data.TEXT === d.data.ID && d.data.ID=='Program')
             return  `nodex${i}`
          })
        .attr("class","noder")
        .attr("width", function (d, index) {
          if (d.data.TEXT === d.data.ID && d.data.ID=='Program') return 500;
            //SA_CHANGE
         // else if(d.data.TEXT === d.data.ID && (d.data.ID=='Schema' || d.data.ID=='CODE')) //SA_DEMO
         else if(d.data.TEXT === d.data.ID && (d.data.ID=='Schema' || d.data.ID =='Brule'))
             return 350  //250->350
          else if(d.data.TEXT === d.data.ID && d.data.ID=='CODE')
             return 350   
          else{
            if(props.mainWindowState != 'PGMSC_DU_FILE')
            return 200;
            else
             return 0;
          
          } 
          //return 150;
        })
        .attr("height", function (d, index) {
          if (d.data.TEXT === d.data.ID && d.data.ID=='Program') 
          return chldHeight; //just half 150-->75
          else if(d.data.TEXT === d.data.ID && (d.data.ID=='Schema' || d.data.ID=='CODE' || d.data.ID =='Brule'))
           return 150
          else {
            if(props.mainWindowState != 'PGMSC_DU_FILE')
            return 0;
            else
              return 0;
          } // hit and trial
          
        })
        .attr('style', (d,i)=>{
          
         // if (d.data.ID == 'CODE')
           // return 'background:#262626;border: 1px solid ;font-size:12px';
          return 'background:whitesmoke;border: 1px solid ;font-size:12px';
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
            console.log('whatis d',d)
            return `tblcode${d.parent.data.HEADID}`
          }
          if(d.data.ID === 'Schema' || d.data.ID =='Brule'){
            console.log('whatis d',d)
            return `tblsch${d.data.HEADID}`
          }
          if(d.data.ID === 'Program'){
            // console.log('whatis d',d)
             return `tblpgm${d.data.HEADID}`
           }

        })
        .attr('rules', 'none'); //NA_CH

     //Adding small circle for root node 
     nodeEnter
     .append("circle")
     .attr("class", "node")
     .attr("r", function (d, index) {
      if (d.data.TEXT === d.data.ID && d.data.ID=='Program' && d.data.WHFUSG >= 4) return 2.5;
       //if (d.data.TEXT === d.data.ID) return 0;
       //else return 1e-0;
       else return 0
     })
     .attr("cx", function(d){
      return 7})
    .attr("cy", function(d){
      return 14})

     .style("stroke", function (d, index) {
      // if (d.data.TEXT === d.data.ID) return 0;
      if (d.data.TEXT === d.data.ID && d.data.ID=='Program' && d.data.WHFUSG >= 4) return 'red';
       return "steelblue";
     }) // colour the path
     .style("fill", function (d, index) {
      // if (d.data.TEXT === d.data.ID) return 0;
      if (d.data.TEXT === d.data.ID && d.data.ID=='Program' && d.data.WHFUSG >= 4) return 'red';
       return "#fff";
     })

     .style("stroke-width", function (d, index) {
      // if (d.data.TEXT === d.data.ID) return 0;
       return "1px";
     });
  
     nodeFo
        .append('thead')
        .append('tr')
        .attr("id", function (d,i){  
          return `trowpgm${i}`
       })
        .attr("style", function(d){ 
          if(d.data.ID=='Schema' || d.data.ID=='CODE' || d.data.ID =='Brule')
            return "background:whitesmoke;text: white;cursor:pointer;font-weight:bold;border-bottom:1px solid "
          else if(d.data.ID == 'SRCB'){
            console.log('found')
            return 'background: none !important'
          }  
          else
             return "background:whitesmoke;text: white;cursor:pointer;"   //font-weight:bold "
            
        })
       // .attr('style', 'background:darkgrey;text: white;cursor:pointer;font-weight:bold ')
        .style('background', function (d, idx) {
          if (
            d.data.ID === 'Program' &&
            d.data.HEADID == props.DUDFileData.DUDFileData.ID
          ) {
            mainIndex = idx+1;
            console.log('now check idx', mainIndex);
            return 'lightblue';
          } /*else {
            return 'darkgrey';
          }*/
          if(d.data.ID === 'Program')
          return 'whitesmoke'
         else if(d.data.ID == 'SRCB')
           return 'none'
         else{
           return  'rgba(0,0,0,0.08)' //SA_JUL
         }
        })
        .attr('class', classes.fotable2)
        ///ends adding context menu on head 
       /* .on("click",function(d){
          console.log('check d',d)
          props.DUDFileData.DUDFileData['CurrentClicked']=d.data.HEADID
          props.DUDFileData.DUDFileData.children.map((de,index)=>{
            if (de.HEADID==d.data.HEADID)
            props.DUDFileData.DUDFileData['CurrentClickedIndex']=index
          })
          if ((d.data.ID === d.data.TEXT) && d.data.ID==='Program')
          {
            foClick1(d)
          }
        })*/
        .selectAll('td')
        .data((d) => {
          if(d.data.ID == 'Program'){
            return [{'type':'Program','val':d.data.HEADID}, ':', {'type':'Program','val':d.data.HEADTEXT},{'data':d,'val':'B'},{'data':d,'val':'>'}]
          }
          else if(d.data.ID == 'SRCB'){
            console.log('showme d',d)
            return [{'type':'SRCB','val':'SRCB'}];
          }
          return [{'type':'NotProgram','val':d.data.HEADID}, ':', {'type':'NotProgram','val':d.data.HEADTEXT}];
        })
          //return [d.data.HEADID, ':', d.data.HEADTEXT];
        //})
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
        /*.attr('style', (x, i) => {
          if (i == 1) return 'width:10px';
          else if (i == 2)
            return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:200px;';
          return 'width:100px;padding:5px';
        })*/
        .attr('style', (x, i) => {
          if (i == 1) return 'width:10px';
          else if (i == 2)
            return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:200px;';
          else if(i == 3)
             return 'width:15px; box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.08);background-color:lightgrey;border-left:1px solid black ;font-weight:bold;border-right:1px solid black'
          else if( i == 4)
             return 'width:15px;box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.08);background-color:lightgrey;font-weight:bold' 
           else if(i == 0 && x.type == 'SRCB')
            return ''      
          return 'width:100px;padding:5px;padding-left:14px';
        })
        /*.attr('title', (x) => {
          if (x !== ':') return x;
        })*/
        .attr('title', (x,i) => {
          if(i == 3)
          return 'Business Rules'
          if(i == 4)
          return 'Schema'
          if(i == 0 || i == 2){
            console.log('whats x',x)
            if(x.type == 'NotProgram')
            return x.val
          }    
          
        })
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
       /* .text((d,i) => {
          if(i == 1)
          return d;
          else
           return d.val;
        }) *//////ends making making heading
        /*.on('click',(d,i)=>{
          var tempRowId = String(event.target.parentNode.id);
          console.log('rowid check', tempRowId)
          console.log('check now',$(`#${tempRowId} td:nth-child(2)`))
          /* if row is highlighted, unhighlight row and icon 
          if($(`#${tempRowId} td:nth-child(2)`).hasClass(`${classes.highlightsch}`)){
            $(`#${tempRowId} td:nth-child(4)`).removeClass(`${classes.highlightIcon}`)
            $(`#${tempRowId} td:nth-child(3)`).removeClass(`${classes.highlightsch}`)
            $(`#${tempRowId} td:nth-child(2)`).removeClass(`${classes.highlightsch}`)
            $(`#${tempRowId} td:nth-child(1)`).removeClass(`${classes.highlightsch}`)

          }
          else{
            $(`#${tempRowId} td:nth-child(4)`).addClass(`${classes.highlightIcon}`)
            $(`#${tempRowId} td:nth-child(3)`).addClass(`${classes.highlightsch}`)
            $(`#${tempRowId} td:nth-child(2)`).addClass(`${classes.highlightsch}`)
            $(`#${tempRowId} td:nth-child(1)`).addClass(`${classes.highlightsch}`)
          }
            foClick1(d.data)
        });*/
       
       .on('click',(d,i)=>{
          
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
      
          console.log('showme1',d.data)

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
       
      // var nodeFo1 = treegrp.selectAll('#table2').append("tbody");
      var nodeFo1 = nodeFo.append("tbody") //SA_FIX added style
      var oldpgmid = '';
      var arr = [];
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
      nodeFo3
        .selectAll('foreignObject.noder')
        .data(function (d,i) {
         // console.log('check i',i)
         
          
          if (d.data.ID === d.data.TEXT && d.data.ID === "Schema")
            return d.data.SCHMADATA;
          else if (d.data.ID === d.data.TEXT && d.data.ID === "CODE")
            return d.data.DATA;
          else if (d.data.ID === d.data.TEXT && d.data.ID === "Brule" )
            return d.data.BRULEDATA;   
          else return [];
        })
        .enter()
        .append("tr")
        .attr('style', 'display:table-row')
        .attr('style', (d) => {
          if (d.PGMID === d.ID)
            return 'font-weight:bolder;border:1px solid white';
        })
        .attr('id', function (d, i) {
          console.log('check row x', d);
          if(d.hasOwnProperty("SVAR1"))
          return `trowcode${d.PGMID}${d.SVAR1}${i}`;
          else
          return `trowsch${d.PGMID}${i}`;
        })
        .attr('class', (d,i)=>{
          if (d.hasOwnProperty('FILENM')){
              if(d.PGMID == d.ID)
              return classes.testingClassHead
              else
              //return classes.testingClass
              return classes.fotablenew
          }
          return classes.fotablenew
        }) //SA_UPD
        /*.attr('style', (d) => {
         // console.log('shi_d',d)
          if (d.hasOwnProperty('UPD') && d.UPD > 0){
            //console.log('UPD found')
            return 'border-bottom:1px solid red';
          }
        })*/

        .on('click', function (e, i) {
          console.log('eval show',e)
          if (e.hasOwnProperty('SVAR1') && (e.PGMID != e.ID)) {
           
            var selectedrows= $("table[id^='tblcode'] tr[id^='trowcode']").not(`#tblcode${e.SCHMHEAD} tr[id^='trowcode']`);
            
            selectedrows.removeClass(`${classes.highlightwu}`)
            var table = document.getElementById(`tblcode${e.SCHMHEAD}`)
            var rows = table.getElementsByClassName(`${classes.highlightwu}`);

            console.log('show rows',rows)
            console.log('all rows',table.getElementsByTagName('tr'))
            if(rows.length == 0){
              
              var htmlTrSelection = document.getElementById(`trowcode${e.PGMID}${e.SVAR1}${i}`);
              console.log('now check htmlTrSelection',htmlTrSelection)
              htmlTrSelection.classList.add(`${classes.highlightwu}`);
           }
            else{ 
              rows[0].classList.remove(`${classes.highlightwu}`)
            }
            foCodeClick(e, i);
          }
        
          else if (e.hasOwnProperty("UPD")) {
          
            var table = document.getElementById(`tblsch${e.PGMID}`)
            var rows = table.getElementsByClassName(`${classes.highlightsch}`);

            console.log('show rows',rows)
            console.log('all rows',table.getElementsByTagName('tr'))
            if(rows.length == 0){
              
              var htmlTrSelection = document.getElementById(`trowsch${e.PGMID}${i}`);
              htmlTrSelection.classList.add(`${classes.highlightsch}`);

           }
            else{
              
              rows[0].classList.remove(`${classes.highlightsch}`)
            }
            foClick(e, i);
          }
          else{
            console.log('e val',e)
            var table = document.getElementById(`tblsch${e.PGMID}`)
            var rows = table.getElementsByClassName(`${classes.highlightsch}`);

            if(rows.length == 0){
              var htmlTrSelection = document.getElementById(`trowsch${e.PGMID}${i}`);
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

            var obj = props.DUDFileData.DUDFileData.BRULE.find((obj)=>obj.ID == begruleId )
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
            console.log('after filter',clonedArray)
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
        })
        .selectAll('td')
        .data((d) => {
          if (d.hasOwnProperty('FILENM')){
            return ['no',d.ID, '', d.TEXT];
          }
          else if(d.hasOwnProperty('UPD') && d.UPD > 0 )
          return [{'id':'yes','val':d.UPD}, d.ID, ':', d.TEXT]
          else return ['no',d.ID, ':', d.TEXT];
        })
        .enter()
        .append('td')
        .attr('style', (d, i) => {
          if(i==0){
            if(d.hasOwnProperty('id')) return 'width:10px';
            else
              return 'width:0px';
          }
          if(i ==2) return 'width:10px';
          if(i == 3)
          return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:200px;';
          if(i ==1)  return 'width:107px;';
         /* if (i == 1) return 'width:10px';
          else if (i == 2)
            return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:200px;';
          return 'width:107px;';*/
          
        })
        .attr('title', (d, i) => {
         //if (d !== ':') {
           if(i == 3){
            return d;
          }
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
        /*.text(function (e,i) {
        
          return e;
        });*/

        

      function foCodeClick(node,i) {
      console.log('in focodeclick selentity',SELENTITY)
      console.log('focodeclick node',node,i, `trowcode${i}${node.ID}`)
     // console.log('getelement',document.getElementById('trow3INAUDUSR'))
     console.log('clickcode selentity',SELENTITY)
      clickCode(SELENTITY,node)
     //var offsetTop = Math.abs($(`#trow${i}${node.ID}`).offset().top - 190 );
    //  console.log('offsetTop', offsetTop)
      
       
   
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
              value:node.PGMID,
              shortnm:node.SVAR1,
              offset: 850
          };
            console.log("whats in item====", item)
       // props.setSourceBrowser(item);
       setLoad(item)
     
        }
        
      function foClick1(node) {
        console.log('foclick1 clicked node ',node);
        //props.setSourceBrowser({field:"", value:"", text:"", shortnm:""}); //commented on route change
        //setLoad({linenum:"", value:"", text:"", shortnm:""})
       console.log('show srcbpgm.', gsrcb)
       if(node.data.HEADID == gsrcb.PGMID){
         console.log("*****yes")
         setLoad({linenum:"", value:"", text:"", shortnm:""})

       }
        click(node)
      }
      function foClick(node,i) {
        console.log('foclick what is selentity',SELENTITY)
        console.log('what is node ',node)
        if(node.PGMID == props.DUDFileData.DUDFileData.ID ){
          console.log('yes')
          PGMCODE = props.DUDFileData.pgmcodeentity.filter(
            //  (pcode) => (pcode.MVARDB === node.ID || pcode.SVAR1 === node.ID || pcode.SVAR2 === node.ID || pcode.SVAR3 === node.ID || pcode.SVAR4 === node.ID 
            (pcode) =>  (pcode.SVAR1 === node.ID 
            ));  //in query sva1db is renamed as svar1
         
        }

        else{
        console.log('shi_sel',SELENTITY)  
        console.log('shi_node',node)
        PGMCODE = SELENTITY.data.CODEDATA.filter(
        //  (pcode) => (pcode.MVARDB === node.ID || pcode.SVAR1 === node.ID || pcode.SVAR2 === node.ID || pcode.SVAR3 === node.ID || pcode.SVAR4 === node.ID 
        (pcode) =>  (pcode.SVAR1 === node.ID && pcode.PGMID === node.PGMNM
        ));  //in query sva1db is renamed as svar1
        }
        var tempArray = [];
        var tempString = '';
        PGMCODE.map((d) => {
          var tempObj = {
            PGMID: d.PGMID,
            FILENM: d.FILENM,
            SVAR1: d.SVAR1,
            TEXT: d.TEXT,
            SCHMHEAD: node.PGMID
          };
          if (tempString !== d.PGMID) {
            console.log('now show d',d)
            tempObj.ID = d.PGMID;
            /* for pgmtext on heading with pgmname*/
            let obj = props.DUDFileData.DUDFileData.children.find(o => o.HEADID.trim() == d.PGMID)
            tempObj.TEXT = obj.HEADTEXT
            tempArray.push(tempObj);
          }
          tempObj = {
            PGMID: d.PGMID,
            FILENM: d.FILENM,
            SVAR1: d.SVAR1,
            TEXT: d.TEXT,
            SCHMHEAD: node.PGMID
          };
          tempObj.ID = d.ID;
          tempArray.push(tempObj);
          tempString = d.PGMID;
        });
        PGMCODE = tempArray;
        console.log('kya padha pgmcode', PGMCODE, tempArray);
        SELENTITY.data.children[0].DATA = PGMCODE;
        SELENTITY.data.children[0].HEADTEXT = node.TEXT;
        SELENTITY.data.children[0].HEADID = node.ID;
        console.log("inside foclick click===", SELENTITY);
        if(SELENTITY.data.HEADID == gsrcb.PGMID)
        setLoad({linenum:"", value:"", text:"", shortnm:""})
        click(SELENTITY);
        
        ////added by seema for global where used
        console.log("on karna chahte hai ham")
        /*var offsetTop = Math.abs($(`#trow${i}${node.ID}`).offset().top - 190 );   //190
           
        var item = 
        {
              field: "PGMID",
              text: "",
              value:"",
              shortnm:node.ID,
              offset: offsetTop
          };
            console.log("whats in item====", item)
       // props.setSourceBrowser(item);
       setLoad(item)*/
       
        
        ////added for global where used ends here
        //console.log('foclick node',SELENTITY.data.CODEDATA, node)
        
      }

      function handleMouseOver(selEntity) {
        SELENTITY = selEntity;
       // console.log('selentity',SELENTITY)
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
            return "translate(" + (source.y+350) + "," + (source.x) + ")"; //250->350
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
      var linkEnter = link
        .enter()
        .insert("path", "g")
        //seema changes
        .style('stroke', (d) => {
          if (d.data.ID == 'Program' && !props.hasOwnProperty('datausgfile')) {
            return 'white';
          } else return 'black';
        }) // colour the path
        .style('fill', 'none')

        .style("vector-effect", "non-scaling-stroke")
        //seema ends
        .attr("class", "link")
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };

          return drawLine(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);
      console.log('linkUpdate',linkUpdate)

      // Transition back to the parent element position
      var pathLengthArray = [];
      linkUpdate
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          //console.log('d in link',d)
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
        .attr("d", function (d) {
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
          console.log('root pos',rootxPos, rootyPos)
          var x1 = rootxPos+15
          var y1 = 0      //s.y
          var x2 = x1
          var y2 = 25   //y1+25
          let path =`M ${y1} ${x1} L ${y2} ${x2}`
         //let path =`M ${y2} ${x2} L ${y1} ${x1}`
          return path
        }
        if(s.depth ==1){
          let path;
         // console.log("source/des==", s);
          var x1 = s.x+15;
          var y1 = s.y;
          var x2 = x1;
          var diff = 25; //random
          var y2 = s.y-diff;
          if(s.id == 2){
            // draw horizontal + vertical line connecting first and last entity
            if(s.data.HEADID == props.DUDFileData.DUDFileData.ID){
              //path =`M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15} M ${y2} ${x2} L ${y2-50} ${x2}`
              //path =`M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15}`
              path =`M ${y2} ${x2} L ${y2} ${x3+15} M ${y2} ${x2} L ${y1} ${x1}`
            }
            else{
             path = `M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15}`
            }
            /* if(mainIndex == 1){
               console.log('in check');
              path =`M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15} M ${y2} ${x2} L ${y2-50} ${x2}`
             }*/
         }
          /* else if(s.data.HEADID == props.DUDFileData.DUDFileData.ID){
            path = `M ${y1} ${x1} L ${y2} ${x2} L ${y2} ${x3+15} M ${y2} ${x2} L ${y2-50} ${x2}`
          }*/
          else
           path = `M ${y2} ${x2} L ${y1} ${x1} `;
          
              

        return path;
          
        }
        if(s.depth ==2){
          var x1 = d.x+15;
          var y1 = s.y;
          var x2 = x1;
          var diff = s.y -(d.y+gap);   //500
          var y2 = s.y-diff;
          let path = `M ${y1} ${x1} L ${y2} ${x2} `;
              

        return path;
          
        }
      //  if(s.depth ==3 || s.depth == 4){
        if(s.depth ==3 ){
          var x1 = d.x+15;
          var y1 = s.y;
          var x2 = x1;
          var diff = s.y -(d.y+350); //250
          var y2 = s.y-diff;
          let path = `M ${y1} ${x1} L ${y2} ${x2} `;
          return path;
        }
        if(s.depth ==4 ){
          var x1 = d.x+15;
          var y1 = s.y;
          var x2 = x1;
          var diff = s.y -(d.y+400); //250
          var y2 = s.y-diff;
          let path = `M ${y1} ${x1} L ${y2} ${x2} `;
          return path;
        }

      }

      // Toggle children on click.
      function click(d) {
       // console.log('show d',d)
        /*SA_FIX start 
         if(d.data.ID == 'Schema'){
          d.children = d._children
             update(d)
          
       
           return;
         }
        /*SA_FIX end */
       
        if (d.children) {
          d._children = d.children;
          /*SA_FIX start -  to collapse previoulsy opened children at further levels */
          d.children.forEach(collapse);
          /* SA_FIX end */
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
      function clickCode(d,node) {
       // console.log('show d',d.parent.data.HEADID)
        console.log('clickcode show node',node)
        console.log('showd in clickcode',d)
       
       var exp = 0;
       var id;
       var offset;
        if (d.children) {
          d._children = d.children;
          /*SA_FIX start -  to collapse previoulsy opened children at further levels */
          d.children.forEach(collapse);
          /* SA_FIX end */
          d.children = null;
          exp = 0;
        } else {
          d.children = d._children;
          d._children = null;
          exp = 1;
        }
        //update(d);
        if(exp == 1){
          
          console.log('gsrcb',gsrcb)
          if(gsrcb.linenum!=''){
            console.log('shi_case hit',gsrcb)
            setLoad({linenum:"", value:"", text:"", shortnm:""})
          }  
          
          id = d.parent.data.HEADID
          //console.log('check karo', d.parent.data.HEADID,node.SVAR1)
          offset = $(`#tblcode${id}`).offset() ;
          var item = 
       {
            linenum: node.ID,
            text: "",
            value:node.PGMID,
            shortnm:node.SVAR1,
            offsetTop: Math.abs(offset.top)-175,
            offsetLeft: offset.left+350+25  //SA_DEMO
        };
          console.log("whats in item====", item)
          gsrcb['linenum'] = node.ID
          gsrcb['text'] = ''
          gsrcb['value'] = node.PGMID
          gsrcb['shortnm'] = node.SVAR1 
          gsrcb['offset'] = 850
          gsrcb['PGMID'] = d.parent.data.HEADID
     // props.setSourceBrowser(item);
     setLoad(item)
     update(d);

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
          update(d);
        }
   //     gsrcb = {}
      }
      if (pathTransitionFlag == 1 && !props.hasOwnProperty('datausgfile')) {
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
          .attr('stroke-dashoffset', 0)
          .on('end', () => {
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
                .attr('stroke-dashoffset', 0)
                .on('end', () => {
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
                });
          });
      } else {
        var zz = d3.selectAll('path.link').attr('stroke-dasharray', 0);
      }
    }
    /*if(document.getElementById('rightSvgundefined')!=null)
    document.getElementById('rightSvgundefined').scrollTop = 4000+(44*2);*/
    //document.body.scrollTop = 0; // For Safari
   //document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  
  }

  
  function handleCloseClick()
    {
        console.log("clicking close", d3.select("foreignObject[id^='rightSvg']"));
    $("foreignObject[id^='rightSvg']").fadeOut(400, () => {
        d3.select("foreignObject[id^='rightSvg']").remove();
    });
    }
  //console.log("FTXT===", FTXT);
  return  props.DUDFileData.DUDFileData==""?null: props.mainWindowState==="PGMSC_DU_FILE" ? null : props.datausgfile?(<div id="dudfilemaincontainer"><CodeEditor srcbpgm={srcbpgm} {...props}/></div>): (
    <div id="dudfilemaincontainer" style={{position:"relative"}}>
   
      <div id="dudfilecontainerTree">
      
      </div>
      {dmddata.value == 'default'?(<CodeEditor srcbpgm={srcbpgm} {...props}/>):null}  
      {/*<CodeEditor srcbpgm={srcbpgm} {...props}/> SA_DEMO*/}
      {dmddata.value != 'default' ? (
        <DMDChart dmddata={dmddata} {...props} />
      ) : null}
    </div>
  );
  
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DataUsageDiagramFile
);