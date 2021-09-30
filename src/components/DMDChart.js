import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { connect } from "react-redux";
import { setDMDChart } from "../actions/DMD/DMDDataAction.js";
import { setEntityData } from "../actions/EntityDataActions";
import _, { functionsIn } from 'lodash';
import { savePositions } from "./DMDSave.js";
import positionNodes from "../actions/DMD/EntRelDiagrams/EntPosAlgo"
import $ from 'jquery';

const mapStateToProps = (state) => {

    return {
        entityList: state.fetchentitiesReducer.entityList,
       entRelsDMD: state.fetchentitiesReducer.entRelsDMD,
       dataUsageFileList: state.fetchDataUsageFilesReducer,
        DMDModelData: state.fetchDMDModelReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    // console.log('shilpi dmd mapdispatch mapStateToProps');
    let ent = { value: '', text: '' };

    return {
        setEntityData: async () => {
            await dispatch(setEntityData());
        },
        setDMDChart: (ent) => {
            Promise.resolve(dispatch(setDMDChart(ent)));
        },
    };
};

function DMDChart(props) {
    const { classes } = props;
    console.log('props in DMD',props)
    DBNAME = props.authDetails.dbName;
    SERVERADDR = 'https://' + props.authDetails.ipAddr + ':' + props.authDetails.port;
    useEffect(() => {
        // console.log(' calling setEntityData');
        props.setEntityData();
    }, []); //empty means will be called only once

    useEffect(() => {
        // console.log('case hit DMD')
        props.setDMDChart(props.dmddata);
    }, [props.entityList, props.dmddata]);  //dmddata

    useEffect(() => {
        // console.log("props in DMD ==", props);
        //console.log("kab yahan aata hai", LoadAgain);

        drawDMDChart();
    }, [props.entityList, props.DMDModelData]);

   /* useEffect(() => {
    console.log('case hit DMD')
    props.setDMDChart(props.dmddata);
    },[props.dmddata]);  //dmddata
 
   useEffect(() => {
    console.log("props in DMD ==", props);
        //console.log("kab yahan aata hai", LoadAgain);

        drawDMDChart();
    }, [props.DMDModelData]);*/

function drawDMDChart() {
    d3.select("#containerTree").selectAll("svg").remove();
    const plusbut = classes.plusDMDbut;
    const title1 = "DataModel"
    const title2 = "DataUsage"
    const id1 = "DM"
    //var func = {}
   var svgMain;
   var parsvg;
   var svg2;
   var tfy=0;
   svgMain = d3
   .select("#containerTree")
   .append("svg")
   .attr("id", "svgmain")
   .attr("width", 100000)
   .attr("height", 100000)

  if(props.hasOwnProperty('dmddata') && props.dmddata.value!='default'){
        //integration with DataUsage File case
      (d3.select("foreignObject[id^='rightSvg']")["_groups"][0] !== null)
    d3.select("foreignObject[id^='rightSvg']").remove();
     //append foreign object
     svgMain = d3
     .select(`#dudfiletable`)
     .append('foreignObject')
    // .attr('id', 'rightSvgFO')   SA_CH
    .attr('id', 'rightSvgFO') 
     .attr('width', 20000 )
    // .attr('height', svgHeight + margin.top + margin.bottom )  // calculate height as per tree
    .attr('height', 3000 )
     .attr('x', 300) // width of left table
     .attr('y',props.dmddata.yPos -100 )   //-52  
     .attr('style', 'background-color:white')
     .append('svg')
     .attr('id','rightSvg')
     .attr('width', '100%')
     .attr('height', '100%');
     tfy = 200;
     console.log('check ypos',props.dmddata.yPos-100)
    // .call(drag);
     // grpmain = svg.append('g').attr('id','grpmain').attr('transform', 'translate(' + tfx + ',' + tfy + ') scale(' + initialScale + ')'); // 20 is margin.top
   /* if(d3.select("#rightSvg")["_groups"][0][0] ==null){
      console.log('no diag')
      parsvg = d3.select("#dudfiletable");
      parsvg.select('#grpmain').remove()

    }
    else{
     d3.select("#rightSvg").select('g').remove()
     parsvg = d3.select("#rightSvg");
    }

    svgMain = parsvg*/
    
}

    /* if(!props.hasOwnProperty('dmddata')){
     svg2 = svgMain
        // .select("#svgmain")
        .append("g")
        .attr("id", "grpmain2")
        .attr('width', 200)
        .attr('height', 1100)
        .attr(
            "transform",
            "translate(" +
            0 +
            "," +
            0 +
            ")"
        );
     }*/ //SA_DMD
       
    const svg = svgMain.append("g")
        .attr("id", "grpmain")
        //.attr('width', 1000)
        //.attr('height', 100)
        .attr(
            "transform",
            "translate(" +
            0 +  //250-->300
            "," +
            175 +
            ") scale(" +
            1 +
            "," +
            1 +
            ") "
        );
        


        $('html, body').animate({
            scrollTop: props.dmddata.yPos+850-276,
            //.scrollTop: 850,
          });
    //adding table for list of entities
    //let fo1 = d3
    //  .select("#grpmain2")
    if(!props.hasOwnProperty('dmddata')){
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
        .append("table")
        .attr("class", classes.tableDMD)
        .style('border-spacing', 'unset')
   
    /////ends making making heading

    var nodeFo1 = fo1.append("tbody");
    var rows = nodeFo1
        .selectAll("foreignObject.noder")

        .data(function (d) {

            //newList = processList(props.programList)
            return props.entityList;
        })
        .enter()
        .append("tr")
        .attr("class", classes.fotable)
        .attr('id', (d, i) => `tr${i}`);

    rows
        .selectAll('td')
        .data(d => [d.ENTID.trim(), ':', d.ENTTX.trim()])
        .enter()
        .append("td")
        .attr("class", classes.focell)
        .attr('style', (x, i) => {
            if (i == 1) return 'width:10px'
            else
                if (i == 2) return 'max-width:40px'
                else
                    return 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden;cursor:pointer;text-align:left;max-width:40px;';
        })
        // .html(function (e) {
        //   return(`
        //     <div class=${classes.focell} style="display:-webkit-inline-box;width:44%">${e.ENTID}</div>
        //     <div class=${classes.focell} style="display:-webkit-inline-box;width:8%">:</div>
        //     <div class=${classes.focell} style="display:-webkit-inline-box;width:44%">${e.ENTTX}</div>
        //   `)
        // })
        .attr('title', (x) => {
            if (x !== ':') return x;
        })
        .text(function (e) {
            return e;
        })
    //  console.log('come here')
    rows.append("td")
        .style('width', '25px')
        //.html(function(d){return ("<button  title= "+ title1 + " class= "+ plusbut +  ">"+"+</button>" + "<button  title= "+ title2 + " class= "+ plusbut + " onclick="+handleDataUsage(d)+">"+"+</button>" )})
        .html(function (d) { return ("<button  id = " + id1 + " title= " + title1 + " class= " + plusbut + ">" + "+</button>" + "<button title= " + title2 + " class= " + plusbut + ">" + "+</button>") })
       

        .on("click", function (e) {
            // console.log("shilpi_du row clicked",e);
            let entDetails = {
                field: "ENTID",
                //code: e.PGMID,
                text: e.ENTTX,
                value: e.ENTID,
            };

            props.setDMDChart(entDetails)

        });
    }
    if (props.DMDModelData.diagData.length == 0)
        return;

    /////////////////////////////// 
    //     Fixing arrows         //  
    ///////////////////////////////

        // console.log('Props', props);
    const graph = props.DMDModelData.diagData[0].data;
        var Links = graph.links
        var Nodes = graph.nodes
        const pList = graph.pList
        const rParents = graph.relation.parents
        const rChildren = graph.relation.children
        const currentEntity = graph.relation.mainEntity
        const otherRels = graph.relation.otherRels
    const linkRules = props.DMDModelData.diagData[0].DMDEntjrules;
        const nodePositions = props.DMDModelData.diagData[0].data.nodePosition
        console.log("00000", graph);
/*
        async function fixLinks(links, rules) {
            return new Promise((resolve, reject) => {
                for (var i in links) {
                    const child = links[i].source.name;
                    const parent = links[i].target.name;
                    const childIndex = links[i].source.index;
                    const parentIndex = links[i].target.index;

                for (var j in rules) {
                    if (child === rules[j].parent && parent === rules[j].child) {
                        links[i].source.name = parent
                        links[i].target.name = child
                        links[i].source.index = parentIndex
                        links[i].target.index = childIndex
                    }
                }
            }
            resolve(links)
        })
    }

        function getLinkRules(rules) {
            return new Promise((resolve, reject) => {
                resolve(rules.map(data => {
                    return {
                        "child": data.CHLD,
                        "parent": data.PAR
                    }
                }))
            })
        }

        (async () => {
            const b = await getLinkRules(linkRules);
            await fixLinks(Links, b);
        })(); */
    ///////////////////////////////

    const entitySchema = props.DMDModelData.diagData[0].DMDEntities;
    const entjrules = props.DMDModelData.diagData[0].DMDEntjrules;

        const higherLength = rParents.length >= rChildren.length ? rParents.length : rChildren.length
        var width = higherLength * 270
        if (higherLength <= 3 ) 
            width = 1000
    // const width = 960;
    // const height = 500;
        // const width = d3.select('#grpmain').attr('width')
    const height = d3.select('#grpmain').attr('height')

        const rWidth = 135
        const rHeight = 135
        const hRWidth = rWidth / 2
        const hRHeight = rHeight / 2
    const arrowWidth = 4
    const arrowHeight = 6

        // const linkG = svg.append("g");
        // const nodeG = svg.append("g");
        // svg
        //     .append("defs")
        //     .append("marker")
        //     .attr("id", "arrow")
        //     .attr("orient", "auto")
        //     .attr("preserveAspectRatio", "none")
        //     .attr("viewBox", "0 -5 10 10")
        //     .attr("refX", 8)
        //     .attr("refY", 0)
        //     .attr("markerWidth", arrowHeight)
        //     .attr("markerHeight", arrowWidth)
        //     .append("path")
        //     .attr("d", "M0,-5L10,0L0,5")
        //     .style("fill", "black");


    ///////////////////////////////////
    // Extraxting parents and children
    ///////////////////////////////////

        // const currentEntity = props.DMDModelData.diagData[0].name
        // const parents = new Set()
        // const children = new Set()

        // Links.forEach(link => {
        //     if (link.target.name !== currentEntity)
        //         parents.add(link.target.name)

        //     if (link.source.name !== currentEntity)
        //         children.add(link.source.name)
        // });

    ///////////////////////////////////
    // Defining forces
    ///////////////////////////////////

        var simulation = d3.forceSimulation(Nodes)
            //     .force('x', d3.forceX().x(width / 2).strength(0))
            //     .force('y', d3.forceY().y(height / 2).strength(0))
            //     .force("center", d3.forceCenter().x(width / 2).y(height / 2))
            //     .force("charge", d3.forceManyBody().strength(-300))
            //     .force('collide', d3.forceCollide().radius(100).strength(1))
        .force('link', d3.forceLink().links(Links).distance(300))
            .alphaDecay(1)
        {
            // simulation.alphaDecay(1)
        // setTimeout(() => {
        //     simulation
        //         .force('x', d3.forceX().x(0).strength(0))
        //         .force('y', d3.forceY().y(0).strength(0))
        //         .force("charge", d3.forceManyBody().strength(0))
        //         .force('collide', d3.forceCollide().radius(0).strength(0))


            // const xPosScaleParent = d3.scaleLinear()
            //     .domain([0, rParents.length-1])
            //     .range([rWidth, width - rWidth])
            // const entityPos = d3.scaleLinear()
            //     .domain([0,rParents.length-1])
            //     .range([width/2, width])
            // const yPosScale = d3.scaleLinear()
            //     .domain([0, 4])
            //     .range([0, 999])
            // const xPosScaleChildren = d3.scaleLinear()
            // .domain([0, rChildren.length - 1])
            // .range([rWidth, width - rWidth]);
            // const yPosScaleChildren = d3.scaleLinear()
            //     .domain([0, rChildren.length - 1])
            //     .range([(height / 2) + hRHeight, height - hRHeight])
            // const xPosScaleOnePointFive = d3.scaleLinear()
            //     .domain([0, otherRels.size])
            //     .range([rWidth * 2, width - (rWidth * 2)])
            // const superParents =  rParents.filter(item => !otherRels.has(item.name))
            // const superChildren =  rChildren.filter(item => !otherRels.has(item.name))
            // const parents = rParents.filter(item => otherRels.has(item.name))
            // const children = rChildren.filter(item => otherRels.has(item.name))
            // function isParent(name) {
            //     if (rParents.length !== 0) {
            //         const result = rParents.find(element => element.name === name)
            //         return result ? true : false
            //     }
            //     else return false
            // }

            // function isChildren(name) {
            //     if (rChildren.length !== 0) {
            //         const result = rChildren.find(element => element.name === name)
            //         return result ? true : false
            //     }
            //     else return false

            // function isMember(name, group) {
            //     if(group.length !== 0) {
            //         let res = group.find(item => item.name === name)
            //         return res ? true : false
            //     } else return false
        }
        positionNodes(graph, width, rWidth, rHeight)
        {
            // for (let i = 0, childCounter = -1, parentCounter = -1; i <= Nodes.length - 1; ++i) {
            //     let relation = '';
            //     if (isParent(Nodes[i].name)) {
            //         relation = 'parent'
            //         ++parentCounter;
                    // console.log('parent', parentCounter, Nodes[i].name);
            //     }
            //     else
            //         if (isChildren(Nodes[i].name)) {
            //             relation = 'child'
            //             ++childCounter;
                        // console.log('child', childCounter, Nodes[i].name);

            //     const distBetweenNodes = 50
            //     switch (relation) {
            //         case 'parent':
            //             Nodes[i].x = xPosScaleParent(parentCounter)
            //             if (otherRels.has(Nodes[i].name)) {
            //                 if(superParents.length) {
            //                     Nodes[i].y = hRHeight + distBetweenNodes 
            //                 } else {
            //                     Nodes[i].y = 0
            //                 }
            //             } else {
            //                 Nodes[i].y = 0//rHeight + hRHeight // 0

            //     const entityXPos = rParents.length / 2 === 0 ? width / 2 : width/2 - rWidth;
            //     if(superParents.length !== 0 && parents.length !== 0) { //Both are present
            //         // Nodes[Nodes.length - 1].x = width / 2 
            //     } else if (superParents.length === 0 && parents.length === 0) { // Both are absent
            //         // Nodes[Nodes.length -1].y = 0
            //         Nodes[i].y = 0
            //     if(superParents.length !== 0 && parents.length === 0) { //s present 
            //         // Nodes[Nodes.length-1].y = rHeight + distBetweenNodes
            //         Nodes[i].y = rHeight + distBetweenNodes
            //     if(superParents.length === 0 && parents.length !== 0){
            //         // Nodes[Nodes.length-1].y = rHeight + distBetweenNodes

            //     // Nodes[Nodes.length -1].x = entityXPos


            //             Nodes[i].x = xPosScaleChildren(childCounter)
            //             if(superParents.length !== 0 && parents.length !== 0) { //Both are present
            //                 Nodes[i].y = rHeight + 1.5*distBetweenNodes
            //             } //else if(superParents.length !== 0 && parents.length)


            //                 Nodes[i].y = 2 * rHeight + 2 * distBetweenNodes

            //             if (otherRels.has(Nodes[i].name)) {
            //                 if (children.length === 0) {

            //             break;






            }
        if (nodePositions) {
            for(let i=0; i<nodePositions.length; ++i) {
                let index = Nodes.findIndex(item => item.name === nodePositions[i].ENTID)
                if(index !== -1) {
                    Nodes[index].x = parseInt(nodePositions[i].XPOS)
                    Nodes[index].y = parseInt(nodePositions[i].YPOS)
                }
            }
        }
        const originalPos = JSON.parse(JSON.stringify(Nodes))
        function handleSaveButtonClick() {
            const positions = isPositionChanged()
            if(positions){
                savePositions(currentEntity, positions)
            }
        }
        const oldButtonElement = document.getElementById('DMDSaveButton')
        const newButtonElement = oldButtonElement.cloneNode(true)
        oldButtonElement.parentNode.replaceChild(newButtonElement, oldButtonElement)
        newButtonElement.addEventListener('click', handleSaveButtonClick);
        function isPositionChanged() {
            const newPositions = []
            for(let i=0; i<Nodes.length; ++i) {
                if(Nodes[i].x != originalPos[i].x) {
                    newPositions.push(Nodes[i])
                }
            }
            if(newPositions.length !== 0) {
                return newPositions.map((item) => {
                    return {
                        name: item.name,
                        x: item.x,
                        y: item.y
                    }
                })
            }
            else
                return false 
        }

    // Adding index to link source and target
    Links.forEach(link => {

        link.source.index = getNode(Nodes, link.source.name).index
        link.target.index = getNode(Nodes, link.target.name).index
    })






    const getfullName = (shortName, entities) => {
        const finalEnt = entities.filter((ent) => ent.ENTID.trim() === shortName);
        if (finalEnt.length > 0) {
            if (finalEnt[0].ENTTX) {
                return finalEnt[0].ENTTX.trim();
            }
        } else return "";
    }

    function handleDataModel(d) {
        //console.log('clicked me',d)
        let entDetails = {
            field: "ENTID",
            //code: e.PGMID,
            text: d.ENTTX,
            value: d.ENTID,
        };

        props.setDMDChart(entDetails)
    }

    function handleDataUsage(d) {
        // console.log('clicked me',d)
        let entDetails = {
            field: "ENTID",
            //code: e.PGMID,
            text: d.ENTTX,
            value: d.ENTID,
        };

        //props.setDMDChart(entDetails)
    }

    function render(graph) {

        function getPathLine(d, i) {

            const X1 = Nodes[d.target.index].x,
                Y1 = Nodes[d.target.index].y,
                X2 = Nodes[d.source.index].x,
                    Y2 = Nodes[d.source.index].y,
                    entName = Nodes[d.target.index].name;

                // const hRWidth = rWidth / 2
                // const hRHeight = rHeight / 2

            const xScale = d3.scaleLinear()
                .domain([0, Links.length + 1])
                .range([0, rWidth])

            const yScale = d3.scaleLinear()
                .domain([0, Links.length + 1])
                .range([0, rHeight])

            const midScaleX = d3.scaleLinear()
                .domain([-2, Links.length + 2])
                .range([X1, X2])

            const midScaleY = d3.scaleLinear()
                .domain([-2, Links.length + 2])
                .range([Y1, Y2])

            const lowerBoundX1 = X1 - hRWidth
            const upperBoundX1 = X1 + hRWidth
            const lowerBoundX2 = X2 - hRWidth
            const upperBoundX2 = X2 + hRWidth

            const lowerBoundY1 = Y1 - hRHeight
            const upperBoundY1 = Y1 + hRHeight
            const lowerBoundY2 = Y2 - hRHeight
            const upperBoundY2 = Y2 + hRHeight

            // ---------------------------------------------------------
            const randX = xScale(i + 1) - hRWidth
            const randY = yScale(i + 1) - hRHeight
                const invertedYScale = d3.scaleLinear()
                    .domain([0, Links.length +2])
                    .range([rHeight, 0])
                const invertRandY = invertedYScale(i+1) - hRHeight

            if (upperBoundX2 >= lowerBoundX1 && lowerBoundX2 <= upperBoundX1) {
                const rand = xScale(i + 1) - hRWidth

                if (Y2 > Y1) {//Y1 is above Y2

                    return `M ${X1}, ${Y1 + randY}
                L ${X2 + rand}, ${Y1 + randY}
                M ${X2 + rand}, ${Y1 + randY}
                L ${X2 + rand}, ${Y2 - hRHeight}`

                }
                if (Y1 > Y2) {//Y1 is below Y2

                    return `M ${X1}, ${Y1 + randY}
                L ${X2 + rand}, ${Y1 + randY}
                M ${X2 + rand}, ${Y1 + randY}
                L ${X2 + rand}, ${Y2 + hRHeight}`
                }
            }
            else
                if (upperBoundY2 >= lowerBoundY1 && lowerBoundY2 <= upperBoundY1) {
                    const rand = yScale(i + 1) - hRHeight

                    if (X2 > X1) //X1 is on left side of X2
                        return `M ${X1 + randX}, ${Y1}
                L ${X1 + randX}, ${Y2 + rand}
                M ${X1 + randX}, ${Y2 + rand}
                L ${X2 - hRWidth}, ${Y2 + rand}`

                    if (X1 > X2) //X1 is on right side of X2

                        return `M ${X1 + randX}, ${Y1}
                L ${X1 + randX}, ${Y2 + rand}
                M ${X1 + randX}, ${Y2 + rand}
                L ${X2 + hRWidth}, ${Y2 + rand}`
                }
                else
                        // if (upperBoundX2 >= lowerBoundX1 - rWidth && lowerBoundX2 <= upperBoundX1 + rWidth) {
                        // let offsetX, offsetY
                        // const randY = -hRHeight + yScale(i + 1)
                        // const randX = -hRWidth + xScale(i + 1)

                        // if (upperBoundX2 <= lowerBoundX1) offsetX = -hRWidth
                        // if (lowerBoundX2 >= upperBoundX1) offsetX = hRWidth
                        // if (Y2 > Y1) offsetY = -hRHeight
                        // if (Y1 > Y2) offsetY = hRHeight

                        // return `M ${X1 + offsetX}, ${Y1 + randY}
                        // L ${X2 + randX}, ${Y1 + randY}
                        // M ${X2 + randX}, ${Y1 + randY}
                        // L ${X2 + randX}, ${Y2 + offsetY}`

                        // }
                        // else
                        // if (upperBoundY2 >= lowerBoundY1 - rHeight && lowerBoundY2 <= upperBoundY1 + rHeight) {
                        // let offsetX, offsetY
                        // const randX = -hRWidth + xScale(i + 1)
                        // const randY = -hRHeight + yScale(i + 1)

                        // if (lowerBoundY1 >= upperBoundY2) offsetY = hRHeight
                        // if (upperBoundY1 <= lowerBoundY2) offsetY = -hRHeight
                        // if (X1 > X2) offsetX = hRWidth //X1 is on right side of X2
                        // if (X1 < X2) offsetX = -hRWidth //X1 is on left side of X2

                        // return `M ${X1 + randX}, ${Y1 - offsetY}
                        // L ${X1 + randX}, ${Y2 + randY}
                        // M ${X1 + randX}, ${Y2 + randY}
                        // L ${X2 + offsetX}, ${Y2 + randY}`


                        // }
                        // else
                            // Bottop-Right
                            if (X1 < X2 && Y1 < Y2) {
                            // if (currentEntity === entName) //(rParents.filter(name => name === entName)) // if main entity
                            return `M ${X1 + hRWidth}, ${Y1 + invertRandY}
                                    L ${X2 + randX}, ${Y1 + invertRandY}
                                    M ${X2 + randX}, ${Y1 + invertRandY}
                                L ${X2 + randX}, ${Y2 - hRHeight }`;

                            }
                            else
                                // Bottom-Left
                                if (X1 > X2 && Y1 < Y2) {
                        //         if (currentEntity === entName)
                        return `M ${X1 - hRWidth}, ${Y1 + randY}
                            L ${X2 + randX}, ${Y1 + randY}
                            M ${X2 + randX}, ${Y1 + randY}
                            L ${X2 + randX}, ${Y2 - hRHeight}`;

                                }
                                else
                                    // Top-Right
                                    if (X1 < X2 && Y1 > Y2) {

                                        return `M ${X1 + randX}, ${Y1 - hRHeight}
                L ${X1 + randX}, ${Y2 + randY}
                M ${X1 + randX}, ${Y2 + randY}
                L ${X2 - hRWidth}, ${Y2 + randY}`
                                    }
                                    else
                                        // Top-Left
                                        if (X2 < X1 && Y2 < Y1) {

                                            return `
                M ${X1 + randX}, ${Y1 - hRHeight}
                L ${X1 + randX}, ${Y2 + randY}
                M ${X1 + randX}, ${Y2 + randY}
                L ${X2 + hRWidth}, ${Y2 + randY}`
                                        }

            }
    d3.select('#grpmain').remove()

            const svg = svgMain.append("g")
            .attr("id", "grpmain")
            .attr('width', 1000)
            .attr('height', 1000)
            .attr(
                "transform",
                "translate(" +
                0 +  //250-->300   
                "," +
                //tfy
                175       //200
                +
                ") scale(" +
                1 +
                "," +
                1 +
                ") "
            );

        const linkG = svg.append("g");
        const nodeG = svg.append("g");
        svg
            .append("defs")
            .append("marker")
            .attr("id", "arrow")
            .attr("orient", "auto")
            .attr("preserveAspectRatio", "none")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", arrowHeight)
            .attr("markerHeight", arrowWidth)
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .style("fill", "black");
            // console.log(graph);
            var drag = d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.1).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }
            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
        }

        var link = linkG.selectAll(".linkline").data(Links);
        var linkEnter = link
            .enter().append('path')
            .attr("class", classes.linkline)
            .attr("stroke", 'black')
            .attr("stroke-width", 1.5)
            .attr('marker-end', 'url(#arrow)')
                .attr('id',(d,i)=>`link${i}`)

        link.exit().remove();
        link = link.merge(linkEnter);

        const circles = linkG.selectAll("g")
            .data(Links)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr('fill', 'grey')
                .attr('id', (d, i) => `circle-${i}`)
            .style('cursor', 'pointer')
            .on('click', (d, i) => showOverlayOnCircle(d, i))

        function showOverlayOnCircle(data, i) {
                const id = `circle-${i}`

                let color = '';
                color = d3.select(`#${id}`).attr('fill');
                // d3.select('#circleOverlay').remove()
                // const fo = d3.select('#grpmain')
                //     .append('foreignObject')
                //     .attr('id', 'circleOverlay')
                //     .attr('x', () => {
                //         const path = getPathLine(data, i)
                //         const coords = getCircleCoords(path)
                //         return (coords.x - 35)//52
                //     })
                //     .attr('y', () => {
                //         const path = getPathLine(data, i)
                //         const coords = getCircleCoords(path)
                //         return (coords.y - 32)//52
                //     })
                //     .attr('width', 65)//130
                //     .attr('height', 45)//90
                //     .attr('style', `opacity:1;
                //     border-radius:10%;
                //     box-shadow: rgba(0,0,0,0.8) 0 0 5px;`)

                // const Box = fo.append('xhtml:div')
                //     .attr('class', classes.DmdOverlayBox)
                //     .attr('style', 'width:61px;height:41px;border-radius:10%')//126w 86h

                // Box.append('xhtml:div')
                //     .attr('class', classes.DmdOverlayCircleClose)
                //     .append("span")
                //     .attr('class', classes.DmdOverlayCircleCloseBtn)
                //     .on('click', () => {
                //         fo.style('opacity', 0).remove()
                //         highlightKeys(fieldOne[0], fieldTwo[0], false)
                //     })
                //     .html('X');

            ////////////////////////////////////

            const RLNID = data.target.name.toUpperCase() + ':' + data.source.name.toUpperCase();
                // // console.log("RLNID",RLNID);
            const field = entjrules.filter(jrule => jrule.RLNID === RLNID)
                // // console.log("Field:",field)
                const PARFLD = field[0].PARFLD.trim()
                // // console.log('PARFLD:',PARFLD);
                const CHLDFLD = field[0].CHLDFLD.trim()
                // console.log('CHLDFLD:',CHLDFLD);

            const fieldOne = entitySchema.filter(schema => schema.ENTID === data.target.name && schema.SHORTNM === PARFLD)
                // console.log("fieldOne:",fieldOne)
            const fieldTwo = entitySchema.filter(schema => schema.ENTID === data.source.name && schema.SHORTNM === CHLDFLD)
                // console.log("fieldTwo:",fieldTwo)

                if (color === 'grey') {
                    d3.select(`#${id}`).attr('fill', 'maroon');
                highlightKeys(fieldOne[0], fieldTwo[0], true)
                } else
                    if (color === 'maroon') {
                        d3.select(`#${id}`).attr('fill', 'grey')
                        highlightKeys(fieldOne[0], fieldTwo[0], false)
                    }

                // Box.append("xhtml:div")
                //     .attr('id', 'overlayBoxData')
                //     .attr('class', classes.DmdOverlayCircleData)
                //     .html(() => {
                /*return (`
        <div class=${classes.OverlayCircleRlnid}>
        ${RLNID}
        </div>
        <div class=${classes.EntitySchema}>
            <div class=${classes.OverlayCircleColumn}>${fieldOne[0].SHORTNM}</div>
            <div class=${classes.OverlayCircleColumn}>${fieldOne[0].FTXT}</div>
            <div class='${classes.RowClear}'></div> 
        </div>
        <div class=${classes.EntitySchema}>
            <div class=${classes.OverlayCircleColumn}>${fieldTwo[0].SHORTNM}</div>
            <div class=${classes.OverlayCircleColumn}>${fieldTwo[0].FTXT}</div>
            <div class='${classes.RowClear}'></div> 
        </div>
        `);*/
             //   })

            }

        function getCircleCoords(path) {

            var arrayOfPath = path.split('\n');
            for (var i in arrayOfPath) {
                arrayOfPath[i] = arrayOfPath[i].trim()
                arrayOfPath[i] = {
                    'x': arrayOfPath[i].slice(2, arrayOfPath[i].indexOf(',')),
                    'y': arrayOfPath[i].slice(arrayOfPath[i].indexOf(',') + 2)
                }
            }

            const X1 = parseFloat(arrayOfPath[2].x)
            const Y1 = parseFloat(arrayOfPath[2].y)
            const X2 = parseFloat(arrayOfPath[3].x)
            const Y2 = parseFloat(arrayOfPath[3].y)

            const midX = (X1 + X2) * 0.5
            const midY = (Y1 + Y2) * 0.5

            return {
                'x': midX,
                'y': midY
            }

        }

            function highlightKeys(f1, f2, FLAG) {
                let id1 = f1.SHORTNM.trim().replace('#','_');
                let id2 = f2.SHORTNM.trim().replace('#','_');
               // console.log(id1, id2)
                if (FLAG) {
                    d3.select(`#${id1}`).attr('style', 'color:RED; background-color:#c7c7c7; font-weight: bold; ')
                    d3.select(`#${id2}`).attr('style', 'color:RED; background-color:#c7c7c7; font-weight: bold; ')
                } else {
                    d3.select(`#${id1}`).attr('style', 'color:#000; background-color:#FFF; font-weight: normal; ')
                    d3.select(`#${id2}`).attr('style', 'color:#000; background-color:#FFF; font-weight: normal; ')
                }
            }
            var node = nodeG.selectAll("g").data(Nodes);
        var nodeEnter = node.enter().append("g").call(drag);


        node.exit().remove();

        nodeEnter
            .append("foreignObject")
            .attr('id', d => `FO-${d.name.toLowerCase()}`)
            .attr("width", rWidth)
            .attr("height", rHeight)
                // .style('cursor', 'pointer')
            .append("xhtml:div")
            .attr("class", classes.DMDSchemaBox)
            .html(function (d) {
                const shortName = d.name;
                    const fullName = getfullName(shortName,  props.dataUsageFileList.dataUsageFileList); //   props.entityList);
                const entSchema = filterSchemaEntity(shortName, entitySchema);
                const wrapped = wrapEntityInDiv(entSchema);
                    // console.log();
                return (`
    <div class=${classes.EntityShortName}>
        ${shortName}
        </div>
        <div class=${classes.EntityFullName}>
        ${fullName}
        </div>
        <div class=${classes.EntitySchemaGroup}>
        ${wrapped}
        </div>
                        `)
            })


        function filterSchemaEntity(name, schemas) {
            return schemas.filter((schema) => schema.ENTID.trim() === name)
        }

        function wrapEntityInDiv(schemas) { //entities
            const resultant = schemas.map(schema => {
                    let id = schema.SHORTNM.replace('#', '_');
                       // console.log('id', id)
                return (`
                <div id=${id} class=${classes.EntitySchema}>
                    <div class=${classes.EntitySchemaElementColumn}>${schema.SHORTNM}</div>
                    <div class=${classes.EntitySchemaElementData}> ${schema.FTXT}</div>
                    <div class='${classes.RowClear}'></div> 
                </div>
    `)
            })
            return resultant.join('');
        }

        function releasenode(d) {
            d.fx = null;
            d.fy = null;
        }


        node = node.merge(nodeEnter);

        simulation.on("tick", ticked);


        function ticked() {

            link.attr("d", (d, i) => getPathLine(d, i));


            circles.attr("cx", (d, i) => {
                const path = getPathLine(d, i);
                const coords = getCircleCoords(path)
                return (coords.x)
                })
                .attr("cy", (d, i) => {
                    const path = getPathLine(d, i);
                    const coords = getCircleCoords(path)
                    return (coords.y)
                })

            node.attr("transform", function (d) {
                const X = d.x - rWidth / 2;
                const Y = d.y - rHeight / 2;
                return "translate(" + X + "," + Y + ")"; //node lines to center of nodes
            })
        }
    }

    function getNode(nodes, name) {
            const filteredNode = nodes.find((node) => node.name === name);
        return filteredNode;
    }

        function pListTable(data) {
            function name(params) {
                console.log('hello');
            }
            let rows = ''
            data.forEach(item => {
                rows += `<tr>
                        <td>${item.source.name}</td>
                        <td>${item.target.name}</td>
                        <td><button onclick=${name}>+</button></td>
                        </tr>`
            })
            return `<table style="width:100%; text-align:center; margin:0; padding:0">
                <thead><tr>
                    <th>DGMENT</th>
                    <th>NEWENT</th>
                </tr></thead>
                <tbody>
                ${rows}
                </tbody>
            </table>`
        }
        function addRelation(rel) {
            let index
            index = Nodes.length
            Nodes.push({
                name: rel.source.name,
                index
            })
            const indexes = Nodes.filter(node => node.name === rel.source.name || node.name === rel.target.name)
            index = Links.length
            Links.push({
                index,
                source: {
                    name: 'CONTRACT',
                    index: 3
                },
                target: {
                    name: 'CUSTOMER',
                    index: 2
                }
            })
            console.log(Nodes);
            console.log(Links);
            console.log(graph);
            positionNodes(graph, width, rWidth, rHeight)
            console.log(graph);
            render(graph)
    //SA_CH
    
    var offsetTop = Math.abs($(`#FO-${props.DMDModelData.entity.value.toLowerCase()} div`).offset().top );
    console.log('SA_CH offsettop', offsetTop)
   
   console.log('check y',d3.select('#rightSvgFO').attr('y') )
   var forobjY = d3.select('#rightSvgFO').attr('y')
   console.log('SA_CH forobj y',forobjY)
  // d3.select('#rightSvgFO').attr('y',forobjY-offsetTop+1100)
   //$('#grpmain')[0].getBoundingClientRect().height;
  // console.log('SA_CH grpmain',$('#rightSvg')[0].getBoundingClientRect().height)
  //console.log('grpheight',d3.select('#grpmain').attr('height'))
  //console.log('SA_CH height', d3.select('#rightSvg').select('g').getBBox());
 // var groupElement = document.querySelector('#grpmain').getBoundingClientRect();
 console.log('final height',document.getElementById("grpmain").getBBox().height)
 
 setTimeout(() => {
    var finalHeight = document.getElementById("grpmain").getBBox().height
    console.log('final height0',finalHeight);
    var forobjY = d3.select('#rightSvgFO').attr('y')
    d3.select('#rightSvgFO').attr('y',forobjY-(finalHeight/2))
}, 0);
  //console.log('whats',groupElement)

//var bboxGroup = groupElement.getBBox();
//console.log('bbox',bboxGroup)
  
   //d3.select('#rightSvgFO').attr('y',offsetTop-forobjY-850)
    
}

 function drawPListTable() {
            d3.select("#dPList").remove()
            const grpmainHeight = document.getElementById("grpmain").getBBox().height
            const grpmainWidth = document.getElementById("grpmain").getBBox().width
            const grpmainX = document.getElementById("grpmain").getBBox().x
            const grpmainY = document.getElementById("grpmain").getBBox().y
            const translate = document.getElementById("grpmain").attributes.transform.value

            const style = "border: 1px solid black"

            if (grpmainHeight != 140) {

                console.log('final height0', grpmainHeight, grpmainWidth, grpmainX, grpmainY, translate);
                const svg = d3.select("#dudfiletable")

                

                // svg.append("foreignObject")
                //     .attr("id", "dPList")
                //     .data(pList)
                //     .attr("style", style)
                //     .attr("width", 300)
                //     .attr("height", 400)
                //     .attr("x", grpmainX + grpmainWidth + hRWidth)
                //     .attr("y", grpmainY)
                //     .attr("transform", translate)
                    // .html(pListTable(pList))
                const column = ['DGMENT', 'NEWENT']
                
                const fo = svg.append("foreignObject")
                .attr("id", "dPList")
                    .attr('class','pFo')
                    .attr('width', 300)
                    .attr('height',400)
                    .attr("x", grpmainX + grpmainWidth + hRWidth)
                    .attr("y", grpmainY)
                    .attr("transform", translate)
                    .append('xhtml:body')
                    .attr("style", "margin: 1px ")

                const pTable = fo
                    .append('table')
                    .attr("style", style)
                    .attr('class', classes.tableDMD)
                    .style('border-spacing', 'unset')
                    .attr("style","width:100%; text-align:left; margin:0; padding:0")

                const thead = pTable
                    .append('thead')
                    
                thead.append('tr')
                    .selectAll('th')
                    .data(column).enter()
                    .append('th')
                    .text(d => d)

                const tbody = pTable
                    .append('tbody')

                const rows = tbody
                    .selectAll('foreignObject.pFo')
                    .data(() => pList)
                    .enter()
                    .append('tr')
                    .attr('id', (d, i) => `tRow${i}`)
                
                rows    
                    .selectAll('td')
                    .data(d => [d.source.name, d.target.name])
                    .enter()
                    .append('td')
                    .text(r => r)

                rows.append('td')
                    .attr("style","text-align:center;")
                    .html(d => `<button id="id00" title="title00" >+</button>`)
                    .on('click', (d) => addRelation(d))
            }

        }

        render(graph);
        setTimeout(()=>{
            if(graph.drawPlistTable) 
                drawPListTable()
            else
                d3.select("#dPList").remove()
        }, 0)
    }

    return (
        <div
            id="maincontainer"
            style={
                {
                    // position: "relative", //initially
                }
            }
        >
            <div className={classes.caption}>
                <span className={classes.span}>
                    Data Model Diagram {props.DMDModelData.entity == "" ? null : props.DMDModelData.entity.value}
                </span>
            </div>
            <div draggable="true"
                id="containerTree"
            // style={{
            //   left: "50px",
            //   top: "30px",
            //   position: "relative",
            // }}
            >
                {/* drawDMDChart() */}
            </div>

        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(DMDChart);
