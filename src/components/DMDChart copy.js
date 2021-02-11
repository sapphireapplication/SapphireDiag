import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { schemeAccent, schemeSet1 } from "d3";


export default function DMDChart(props) {
  const { classes } = props;
 
   useEffect(() => {
    console.log("props in DMD ==", props);
    //console.log("kab yahan aata hai", LoadAgain);

    drawDMDChart();
  },[props.DMDModelData]);

  function drawDMDChart() {

    d3.select("#containerTree").selectAll("svg").remove();
  
  const svg = d3
    .select("#containerTree")
    .append("svg")
    .attr("id", "svgmain")
    .attr("width", 100000)
    .attr("height", 100000) 
    .append("g")
    .attr("id", "grpmain")
    .attr(
      "transform",
      "translate(" +
        300 +    // changed from 600 to 300
        "," +
        300 +
        ") scale(" +
        1 +
        "," +
        1 +
        ") "
    );
    const svg2 = d3
    .select("#svgmain")
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

    //adding table for list of entities
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

      /*fo1
        .append("thead")
        .append("tr")
        .attr("style", "background:darkgrey;text: white")
        .append("td");*/
         /////ends making making heading

      var nodeFo1 = fo1.append("tbody");
      nodeFo1
        .selectAll("foreignObject.noder")

        .data(function (d) {
         
          //newList = processList(props.programList)
          return props.entityList;
        })
        .enter()
        .append("tr")
        .attr("class", classes.fotable)
        .on("click", function (e) {
          //console.log("shilpi_du row clicked",e);
          let entDetails = {
            field: "ENTID",
            //code: e.PGMID,
            text: e.ENTTX,
            value: e.ENTID, 
          };
         
          props.setDMDChart(entDetails)
          //props.pgmLinksHandler("pgmStrChart",progDetails);
          //props.setProgramStructureChart(progDetails);

          
        })
        /*.on("contextmenu", function (d) {
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
        })*/
        .append("td")
        .attr("class",classes.focell)
        /*.style("background",function(d){
          //console.log('sa_val',d)
          // if(d.PGMID == props.ForProgram[0].value){
            if(d.PGMID == props.PgmStrData.program.value){
            return "lightblue"
          }
        })*/
        .text(function (e) {
          return e.ENTID + ": " + e.ENTTX + ")";
        });
  if(props.DMDModelData.diagData.length == 0)
   return;
   let graph = props.DMDModelData.diagData[0].data;
   const entitySchema = props.DMDModelData.diagData[0].DMDEntities;
   //console.log('dmd graph',graph)
   
   const width = 960;
   const height = 500;
   const nodeSize = 20;
   const arrowWidth = 8;
   var fixed = undefined;
   var fixedNode = true;
        
  const linkG = svg.append("g");
  const nodeG = svg.append("g");
  // Arrows are separate from link lines so that their size
  // can be controlled independently from the link lines.
  const arrowG = svg.append("g");

  // Arrowhead setup.
  // Draws from Mobile Patent Suits example:
  // http://bl.ocks.org/mbostock/1153292
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("orient", "auto")
    .attr("preserveAspectRatio", "none")
    // See also http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute
    //.attr("viewBox", "0 -" + arrowWidth + " 10 " + (2 * arrowWidth))
    .attr("viewBox", "0 -5 10 10")
    // See also http://www.w3.org/TR/SVG/painting.html#MarkerElementRefXAttribute
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", arrowWidth)
    .append("path")
    .attr("d", "M0,-5L10,0L0,5");

/////////////////////////// mamta
/*
  var simulation = d3
    .forceSimulation()
    .force("link", d3.forceLink())
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

*/


/*
var simulation = d3
//    .forceSimulation()

    .forceSimulation()
//    .forceSimulation(nodeG)
//    .forceSimulation(nodeG, linkG)
    .force("charge", d3.forceManyBody().strength(-100))
//    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(180).strength(1))
//    .force('link', d3.forceLink().links(linkG))
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
//    .force("link", d3.forceLink().links(linkG))   
    .force('collide', d3.forceCollide(140 )) // change this value
    .force("center", d3.forceCenter(width / 2, height / 2));
//////////////////////////////

  


//  simulation.force("link").distance(140);
  

//////mamta
//////  simulation.force('link', d3.forceLink().links(links))
  
*/


var simulation = d3.forceSimulation()
    .force("forceX", d3.forceX().strength(.1).x(width * .5))
    .force("forceY", d3.forceY().strength(.1).y(height * .5))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody().strength(-100));
    // .alpha([0,100]); //ASHUTOSH: no alpha
   // .force('collide', d3.forceCollide(140 ));

   
  var drag = d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

  function dragstarted(d) {
    if (!fixed) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
  }

  function dragged(d) {
    if (!fixed) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
      fix_nodes(d, context);
    }
  }

  function dragended(d) {
    if (!fixed) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = d.x;
      d.fy = d.y;
    }
  }
  const getfullName = (shortName, entities) => {
    const finalEnt = entities.filter((ent) => ent.ENTID.trim() === shortName);
    if (finalEnt.length > 0) {
      if (finalEnt[0].ENTTX) {
        return finalEnt[0].ENTTX.trim();
      }
    } else return "";
  };

  function render(graph) {
    const getPathLine = (d) => {
      var tryRandom = 10 + (Math.random() * 2);
      var tryRandomOne = 130 + (Math.random() * 2);
      var tryRandomTwo = 60 + Math.random();
      if (!d.straight) {

        if (d.source.x < d.target.x && d.target.x < d.source.x + tryRandomOne) {
          
          if (d.target.y < d.source.y) 
          {
            return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.target.x + tryRandom},${d.source.y + tryRandom}`;
          }
          return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.target.x + tryRandom},${d.source.y + tryRandomOne}`;
        }


        if (d.source.y < d.target.y && d.target.y < d.source.y + tryRandomOne) {
        
          if (d.target.x > d.source.x) {
            return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandomOne},${d.target.y + tryRandom}`;
          }
          return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandom},${d.target.y + tryRandom}`;
        }


        if (
          d.source.x < d.target.x &&
          d.target.x < d.source.x + tryRandomOne &&
          d.source.y < d.target.y &&
          d.target.y < d.source.y + tryRandomOne
        ) {
          return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.target.x + tryRandom},${d.source.y + tryRandom}
            M ${d.target.x + tryRandom}, ${d.source.y + tryRandom}
            L ${d.source.x + tryRandom},${d.source.y + tryRandom}
            `;
        }

        
        if (d.source.x + tryRandomOne < d.target.x && d.source.y + tryRandomOne < d.target.y) {
          const xDifference = d.target.x - (d.source.x + tryRandomOne);
          const yDifference = d.target.y - (d.source.y + tryRandomOne);

          if (xDifference > yDifference) {
            return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
          L ${d.target.x + tryRandom},${d.source.y + tryRandomOne}
          M ${d.target.x + tryRandom}, ${d.source.y + tryRandomOne}
          L ${d.source.x + tryRandomOne},${d.source.y + tryRandomOne}`;
          }

          return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandomOne},${d.target.y + tryRandom}
            M ${d.source.x + tryRandomOne}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandomOne},${d.source.y + tryRandomOne}`;
        }

        
        if (d.source.x + tryRandomOne < d.target.x && d.source.y > d.target.y) {
          const xDifference = d.target.x - (d.source.x + tryRandomOne);
          const yDifference = d.source.y - d.target.y;

          if (xDifference > yDifference) {
            return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
          L ${d.target.x + tryRandom},${d.source.y + tryRandom}
          M ${d.target.x + tryRandom}, ${d.source.y + tryRandom}
          L ${d.source.x + tryRandomOne},${d.source.y + tryRandom}`;
          }

          return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandomOne},${d.target.y + tryRandom}
            M ${d.source.x + tryRandomOne}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandomOne},${d.source.y + tryRandom}`;
        }

        
        if (d.source.x > d.target.x && d.source.y + tryRandomOne < d.target.y) {
          const xDifference = d.source.x - d.target.x;
          const yDifference = d.target.y - (d.source.y + tryRandomOne);

          if (xDifference > yDifference) {
            return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.target.x + tryRandom},${d.source.y + tryRandomOne}
            M ${d.target.x + tryRandom}, ${d.source.y + tryRandomOne}
            L ${d.source.x + tryRandom},${d.source.y + tryRandomOne}`;
          }

          return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandom},${d.target.y + tryRandom}
            M ${d.source.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandom},${d.source.y + tryRandomOne}`;
        }

        if (d.source.x > d.target.x && d.source.y > d.target.y) {
          const xDifference = d.source.x - d.target.x;
          const yDifference = d.source.y - d.target.y;

          if (xDifference > yDifference) {
            return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
              L ${d.target.x + tryRandom},${d.source.y + tryRandom}
              M ${d.target.x + tryRandom}, ${d.source.y + tryRandom}
              L ${d.source.x + tryRandom},${d.source.y + tryRandom}`;
          }
          return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandom},${d.target.y + tryRandom}
            M ${d.source.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandom},${d.source.y + tryRandom}`;
        }


        if (d.source.x + tryRandomOne < d.target.x && d.source.y > d.target.y) {
          return `M ${d.target.x + tryRandom}, ${d.target.y - tryRandomTwo}
            L ${d.target.x + tryRandom},${d.source.y + tryRandom}
            M ${d.target.x + tryRandom}, ${d.source.y + tryRandom}
            L ${d.source.x + tryRandom},${d.source.y + tryRandom}`;
        }


        if (d.source.x > d.target.x && d.source.y + tryRandomOne < d.target.y) {
          return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandomTwo}
            L ${d.source.x + tryRandomOne},${d.target.y + tryRandomTwo}
            M ${d.source.x + tryRandomOne}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandomOne},${d.source.y + tryRandom}`;
        }


        if (d.source.x + tryRandomOne < d.target.x && d.source.y > d.target.y) {
          return `M ${d.target.x + tryRandom}, ${d.target.y - tryRandomTwo}
            L ${d.target.x + tryRandom},${d.source.y + tryRandom}
            M ${d.target.x + tryRandom}, ${d.source.y + tryRandom}
            L ${d.source.x + tryRandom},${d.source.y + tryRandom}
            `;
        }



        return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
            L ${d.source.x + tryRandom},${d.source.y + tryRandom}`;
      
      }
      else 
      {
        return `M ${d.target.x + tryRandom}, ${d.target.y + tryRandom}
          L ${d.source.x + tryRandom}, ${d.source.y + tryRandom}`;
      }
    };

    var link = linkG.selectAll(".linkline").data(graph.links);
    var linkEnter = link
      .join("path")
      .attr("d", function (d) {
        return getPathLine(d);
      })
      .attr("class", function (d) {
        return classes.linkline;
      })
      .attr("stroke", function (d) {
        if (!d.highlighted) return "black";
        if (d.highlighted) return "red";
      })
      .attr("stroke-width", function (d) {
        if (!d.highlighted) return 1.5;
        if (d.highlighted) return 10;
      })
      .style("z-index", function (d) {
        if (!d.highlighted) return -1;
        if (d.highlighted) return 100;
      })
      .style("opacity", function (d) {
        if (!d.highlighted) return 0.2;
        if (d.highlighted) return 1;
      });

    link.exit().remove();
    link = link.merge(linkEnter);

    var arrow = arrowG.selectAll("line").data(graph.links);
    var arrowEnter = arrow
      .join("path")
      .attr("d", function (d) {
        return getPathLine(d);
      })
      .attr("class", "arrow")   
      .attr("marker-end", "url(#arrow)");
    arrow.exit().remove();
    arrow = arrow.merge(arrowEnter);

    var node = nodeG.selectAll("g").data(graph.nodes);
    var nodeEnter = node.enter().append("g").call(drag);
    node.exit().remove();

    nodeEnter
      .append("foreignObject")
      .attr("width", 135)
      .attr("height", 135)
      .append("xhtml:div")
      .attr("class", function (d) {
        return classes.DMDSchemaBox;
      })
      //.style("overflow-y", "hidden") //scroll
      .html(function (d) {
        const shortName = d.name;
        console.log('abcd',d.name);
        const fullName = getfullName(shortName, props.entityList);
        const class1 = classes.EntityShortName;
        const class2 = classes.EntityFullName;
        const EntSchema = filterSchemaEntity(d.name, entitySchema);
        const wrapped = wrapEntityInDiv(EntSchema);
        console.log('abcd', EntSchema)
        // getEntSchemaText
        return (`
        <div class=${classes.EntityShortName}>
          ${shortName}
          </div>
          <div class=${classes.EntityFullName}>
          ${fullName}
          </div>
          <div class=${classes.EntitySchemaGroup}>
          ${wrapped}
          </div>`
          //  + "<div>"+EntSchema+"</div>"
        );

        // );
      });

    function filterSchemaEntity(name, schemas) {
      // console.log('abcd',schemas);
      return schemas.filter( (schema) => schema.ENTID.trim() === name )
    }

    function wrapEntityInDiv(schemas) { //entities
      const resultant = schemas.map(schema => {
        return (`
        <div class='schemaBox'>
        <p class=${classes.EntitySchema}>SHORTNM : ${schema.SHORTNM}</p>
        <p class=${classes.EntitySchema}>FLDNM : ${schema.FLDNM}</p>
        <p class=${classes.EntitySchema}>FTXT : ${schema.FTXT}</p>
        <p class=${classes.EntitySchema}>DTATYP : ${schema.DTATYP}</p>
        <p class=${classes.EntitySchema}>LEN : ${schema.LEN}</p>
        <p class=${classes.EntitySchema}>DCEP : ${schema.DCEP}</p>
        <p class=${classes.EntitySchema}>DIRNM : ${schema.DIRNM}</p>        
        </div>
        `)
      })
      return resultant.join('');
    }

    function releasenode(d) {
      d.fx = null;
      d.fy = null;
    }

    nodeEnter.append("text").attr("class", "nodetext");

    node = node.merge(nodeEnter);

    node.select(".nodetext").each(function (d) {
      var circleWidth = nodeSize * 2,
        textLength = 0,
        textWidth = textLength + nodeSize;

      if (circleWidth > textWidth) {
        d.isCircle = true;
        d.rectX = -20;
        d.rectWidth = circleWidth;
      } else {
        d.isCircle = false;
        d.rectX = -(textLength + 20) / 2;
        d.rectWidth = textWidth;
        d.textLength = textLength;
      }
    });

    node
      .select(".node-rect")
      .attr("x", function (d) {
        return d.rectX;
      })
      .attr("width", function (d) {
        return d.rectWidth;
      });




    //update the simulation based on the data
    simulation
        .nodes(graph.nodes)
        .force("collide", d3.forceCollide(140));//ASHUTOSH: 140






    simulation.nodes(graph.nodes).on("tick", function (e) {

      var randomShift = 20 + Math.random();
      //var randomShift = 20 + (Math.random() * 2);
      // console.log('ASHUTOSH: alpha', e.alpha);
      
      graph.nodes.forEach(function (d) {
        if (d.isCircle) {
          d.leftX = d.rightX = d.x;
        } else {
          d.leftX = d.x - d.textLength / 2 ;//+ randomShift / 2;
          d.rightX = d.x + d.textLength / 2 ;//- randomShift / 2;
        }
      });

      link.call(edge);
      arrow.call(edge);
      /*
      link = linkG.selectAll(".linkline").data(graph.links);
       linkEnter = link // var linkEnter
        .join("path")
        .attr("d", function (d) {
          return getPathLine(d);
        })
        .attr("stroke", function (d) {
          if (!d.highlighted) return "black";
          if (d.highlighted) return "red";
        })
        .attr("stroke-width", function (d) {
          if (!d.highlighted) return 1.5;
          if (d.highlighted) return 10;
        })
        .style("z-index", function (d) {
          if (!d.highlighted) return -1;
          if (d.highlighted) return 100;
        })
        .style("opacity", function (d) {
          if (!d.highlighted) return 0.3;
          if (d.highlighted) return 1;
        });

      link.exit().remove();
      link = link.merge(linkEnter);
      arrow = arrowG.selectAll(".arrow").data(graph.links);
       arrowEnter = arrow //var arrowEnter
        .join("path")
        .attr("d", function (d) {
          return getPathLine(d);
        })
        .attr("class", "arrow")
        .attr("marker-end", "url(#arrow)");
      arrow.exit().remove();
      arrow = arrow.merge(arrowEnter);
        */

        linkEnter.attr("d", function (d) {
          return getPathLine(d);
        });

        arrowEnter.attr("d", function (d) {
          return getPathLine(d);
        });

      /// simulation.force("link").links(graph.links);



      simulation
       .force('link', d3.forceLink().links(graph.links).distance(180))//.strength(1)) //ASHUTOSH: No strength 180
       .force("collide", d3.forceCollide(140));//140


/*
 simulation.force('collision', d3.forceCollide().radius(function(d) {
    return d.radius
  }))

//  simulation.force("link").links(link); 

*/



      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });




    /* //for context menu on nodes

    link.on("contextmenu", function (d) {
      const container = d3.select(context.MainDiv).node();
      console.log(context.MainDiv);
      d3.event.preventDefault();
      console.log(container);
      const position = d3.mouse(container);
      const posX = position[0];
      const posY = position[1];

      // d3.select(context.contextMenu2)
      //   .style("top", "" + posY + "px")
      //   .style("left", "" + posX + "px")
      //   .style("visibility", "visible")
      //   .style("z-index", 1);

      const notMainDiv =
        ".DMDchartCanvas" +
        context.screenId +
        ":not(" +
        context.contextMenu2 +
        ")";
      d3.selectAll(notMainDiv).on("click", function (d) {
        const container = d3.select(context.MainDiv).node();
        console.log(container);
        d3.event.preventDefault();
        const position = d3.mouse(container);

        // d3.select(context.contextMenu2)
        //   .style("top", "" + 0 + "px")
        //   .style("left", "" + 0 + "px")
        //   .style("visibility", "hidden");
      });

      context.relID = d.name;
      d3.event.stopPropagation();

      if (d.straight) d.straight = false;
      else d.straight = true;
    });

    // // Transition to the proper position for the node
    node
      .attr("transform", function (d) {
        return "translate(" + (d.x - 100) + "," + (d.y - 100) + ")";
      })
      .on("contextmenu", function (d) {
        const container = d3.select(context.MainDiv).node();
        console.log(context.MainDiv);
        d3.event.preventDefault();
        console.log(container);
        const position = d3.mouse(container);
        const posX = position[0];
        const posY = position[1];

        d3.select(context.contextMenu)
          .style("top", "" + posY + "px")
          .style("left", "" + posX + "px")
          .style("visibility", "visible")
          .style("z-index", 1);

        const notMainDiv =
          ".DMDchartCanvas" +
          context.screenId +
          ":not(" +
          context.contextMenu +
          ")";
        d3.selectAll(notMainDiv).on("click", function (d) {
          const container = d3.select(context.MainDiv).node();
          console.log(container);
          d3.event.preventDefault();
          const position = d3.mouse(container);

          d3.select(context.contextMenu)
            .style("top", "" + 0 + "px")
            .style("left", "" + 0 + "px")
            .style("visibility", "hidden");
        });

        context.pgmName = d.name;
        context.node = d.name;
        d3.event.stopPropagation();
      }) */

    //console.log(context.contextMenu2);
  }
  function getNode(nodes, name) {
    const filteredNode = nodes.filter((node) => node.name === name)[0];
    return filteredNode;
  }

  // Sets the (x1, y1, x2, y2) line properties for graph edges.
  // need to make this one to one
  function edge(selection) {
    // console.log(selection)
    selection
      .each(function (d) {
        let sourceX;
        let targetX;
        let midX;
        let dy;
        let dx;
        let angle;

        d.source = getNode(graph.nodes, d.source.name);
        d.target = getNode(graph.nodes, d.target.name);

        // This mess makes the arrows exactly perfect.
        if (d.source.rightX < d.target.leftX) {
          sourceX = d.source.rightX;
          targetX = d.target.leftX;
        } else if (d.target.rightX < d.source.leftX) {
          targetX = d.target.rightX;
          sourceX = d.source.leftX;
        } else if (d.target.isCircle) {
          targetX = sourceX = d.target.x;
        } else if (d.source.isCircle) {
          targetX = sourceX = d.source.x;
        } else {
          midX = (d.source.x + d.target.x) / 2;
          if (midX > d.target.rightX) {
            midX = d.target.rightX;
          } else if (midX > d.source.rightX) {
            midX = d.source.rightX;
          } else if (midX < d.target.leftX) {
            midX = d.target.leftX;
          } else if (midX < d.source.leftX) {
            midX = d.source.leftX;
          }
          targetX = sourceX = midX;
        }

        dx = targetX - sourceX;
        dy = d.target.y - d.source.y;
        angle = Math.atan2(dx, dy);

        // Compute the line endpoint such that the arrow
        // is touching the edge of the node rectangle perfectly.
        d.sourceX = sourceX + Math.sin(angle) * 20;
        d.targetX = targetX - Math.sin(angle) * 20;
        d.sourceY = d.source.y + Math.cos(angle) * 20;
        d.targetY = d.target.y - Math.cos(angle) * 20;
      })
      .attr("x1", function (d) {
        return d.sourceX;
      })
      .attr("y1", function (d) {
        return d.sourceY;
      })
      .attr("x2", function (d) {
        return d.targetX;
      })
      .attr("y2", function (d) {
        return d.targetY;
      });
  }

  const newObj = {};

  function fix_nodes(this_node, context) {
    if (fixedNode) {
      graph.nodes.map((node) => {
        if (node.name !== this_node.name) {
          node.fx = node.x;
          node.fy = node.y;
        }
        return node;
      });
    }
  }

  render(graph);
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
          Data Model Diagram {props.DMDModelData.entity=="" ? null : props.DMDModelData.entity.value}
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
        {/*drawDMDChart()*/}
      </div>
      
    </div>
  );
}
