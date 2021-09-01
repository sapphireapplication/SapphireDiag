import * as d3 from "d3"

export default function positionNodes(graph, width, rWidth, rHeight) {

    // Global variables

    const rParents = graph.relation.parents
    const rChildren = graph.relation.children
    const Nodes = graph.nodes
    const otherRels = graph.relation.otherRels
    const hRWidth = rWidth / 2
    const hRHeight = rHeight / 2

    const superParents =  rParents.filter(item => !otherRels.has(item.name))
    const superChildren =  rChildren.filter(item => !otherRels.has(item.name))
    const parents = rParents.filter(item => otherRels.has(item.name))
    const children = rChildren.filter(item => otherRels.has(item.name))

    // Utilities functions

    function isParent(name) {
        if (rParents.length !== 0) {
            const result = rParents.find(element => element.name === name)
            return result ? true : false
        }
        else return false
    }

    function isChildren(name) {
        if (rChildren.length !== 0) {
            const result = rChildren.find(element => element.name === name)
            return result ? true : false
        }
        else return false
    }

    // Scaling functions

    const xPosScaleParent = d3.scaleLinear()
            .domain([0, rParents.length-1])
            .range([rWidth, width - rWidth])

    const xPosScaleChildren = d3.scaleLinear()
            .domain([0, rChildren.length - 1])
            .range([rWidth, width - rWidth])

    // Adding postions to Nodes

    for (let i = 0, childCounter = -1, parentCounter = -1; i <= Nodes.length - 1; ++i) {

        let relation = '';
        if (isParent(Nodes[i].name)) {
            relation = 'parent'
            ++parentCounter;
            // console.log('parent', parentCounter, Nodes[i].name);
        }
        else
            if (isChildren(Nodes[i].name)) {
                relation = 'child'
                ++childCounter;
                // console.log('child', childCounter, Nodes[i].name);
            }
            else
                relation = 'entity'

        const distBetweenNodes = 50

        switch (relation) {
            case 'parent':
                Nodes[i].x = xPosScaleParent(parentCounter)

                // Shifting y co-ordinate of otherRels to line 1.5
                if (otherRels.has(Nodes[i].name)) {
                    // Nodes[i].y = hasParents ? rHeight + distBetweenNodes : 0
                    if(superParents.length) {
                        Nodes[i].y = hRHeight + distBetweenNodes 
                    } else {
                        Nodes[i].y = 0
                    }
                } else {
                    Nodes[i].y = 0//rHeight + hRHeight // 0
                }
                break;
            case 'entity':
                // if (hasParents) {
                //     Nodes[Nodes.length - 1].x = (width / 2) - rWidth
                //     Nodes[Nodes.length - 1].y = 2 * rHeight + 2 * distBetweenNodes//(height / 2)
                // } else {
                //     Nodes[Nodes.length - 1].x = width / 2
                //     Nodes[Nodes.length - 1].y = rHeight + distBetweenNodes//rHeight //0
                // }
                // console.log(hasParents);
                // Nodes[Nodes.length-1].x = entityPos(Math.floor(rParents.length/2 - 1))

                const entityXPos = rParents.length / 2 === 0 ? width / 2 : width/2 - rWidth;
                // const entityXPos = width/2

                if(superParents.length !== 0 && parents.length !== 0) { //Both are present
                    // Nodes[Nodes.length - 1].x = width / 2 
                    // Nodes[Nodes.length - 1].y = 2 * rHeight //+ 2 * distBetweenNodes    
                    Nodes[i].y = 2 * rHeight //+ 2 * distBetweenNodes    
                    // console.log('both parents are present');
                } else if (superParents.length === 0 && parents.length === 0) { // Both are absent
                    // Nodes[Nodes.length -1].x = width/2
                    // Nodes[Nodes.length -1].y = 0
                    Nodes[i].y = 0
                    // console.log('both parents are absent');
                } else 
                if(superParents.length !== 0 && parents.length === 0) { //s present 
                    // Nodes[Nodes.length-1].y = rHeight + distBetweenNodes
                    Nodes[i].y = rHeight + distBetweenNodes
                    // console.log(' super parent is present');
                } else 
                if(superParents.length === 0 && parents.length !== 0){
                    // Nodes[Nodes.length-1].y = rHeight + distBetweenNodes
                    Nodes[i].y = rHeight + distBetweenNodes
                    // console.log(' parent is present');
                }                    
                // else {
                //     // Nodes[Nodes.length -1].x = width/2
                //     Nodes[Nodes.length -1].y = rHeight + distBetweenNodes
                //     console.log('super parent is present');
                // }

                // Nodes[Nodes.length -1].x = entityXPos
                Nodes[i].x = entityXPos


                break;
            case 'child':
                // if (hasParents) {
                //     Nodes[i].x = xPosScaleChildren(childCounter)
                //     Nodes[i].y = 4 * rHeight + 4 * distBetweenNodes//height - hRHeight
                //     // Nodes[i].y = (height / 2) + (2 * rHeight)
                // } else {
                //     Nodes[i].x = xPosScaleChildren(childCounter)
                //     Nodes[i].y = 2 * rHeight //height / 2
                // }

                // // Shifting y co-ordinate of otherRels to line 2.5
                // if (otherRels.has(Nodes[i].name)) {
                //     Nodes[i].y = 3 * rHeight + 3 * distBetweenNodes
                // }

                Nodes[i].x = xPosScaleChildren(childCounter)
                if(superParents.length !== 0 && parents.length !== 0) { //Both are present
                    Nodes[i].y =  3 * rHeight + 1.5 * distBetweenNodes//+ 3 * distBetweenNodes
                    // console.log('both parent are present in child');
                } else if (superParents.length === 0 && parents.length === 0) { // Both are absent
                    Nodes[i].y = rHeight + 1.5*distBetweenNodes
                    // console.log('both parent are absent in child');
                    
                } //else if(superParents.length !== 0 && parents.length)
                
                
                else {
                    Nodes[i].y = 2 * rHeight + 2 * distBetweenNodes
                    // console.log('once parent is absent in child');
                }

                if (otherRels.has(Nodes[i].name)) {
                    if (children.length === 0) {
                        // Nodes[i].y += hRHeight 
                    } else {
                        Nodes[i].y += hRHeight 
                    }
                }

                break;
            // case 'onePointfive': 
            //     break
            default:
                break;
        }
    }
}