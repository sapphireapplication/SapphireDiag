import { reject } from "lodash";
async function fetchData(entid) {
  const NodesUrl = `${SERVERADDR}/EntDList/${DBNAME}/${entid}`;
  const LinksUrl = `${SERVERADDR}/EntDRels/${DBNAME}/${entid}`;
  const PListUrl = `${SERVERADDR}/EntDPList/${DBNAME}/${entid}`;

  return new Promise((resolve) => {

    Promise.all([
      fetch(NodesUrl).then(data => data.json()),
      fetch(LinksUrl).then(data => data.json()),
      fetch(PListUrl).then(data => data.json())
    ])
      .then(res => resolve([
        res[0].response.positions,
        res[1].response.positions,
        res[2].response.positions
      ]))

  })
};

export const buildChart = async (entid) => {
  return new Promise((resolve, reject) => {

    fetchData(entid)
      .then(data => {
        if(data[0].length === 0)
          throw "Data absent"

        const [ENTDLST, ENTDRELS, ENTDPLST] = data

        const mainEntity = ENTDLST[0].DGMID.trim()

        const Nodes = ENTDLST.map((item, i) => {
          return {
            name: item.ENT.trim(),
            index: i
          }
        })

        const Links = ENTDRELS.map((item, i) => {
          return {
            index: i,
            source: {
              name: item.CHLD.trim()
            },
            target: {
              name: item.PAR.trim()
            }
          }
        })

        const pList = ENTDPLST.map( item => {
          return { 
              source: { name : item.NEWENT.trim() }, 
              target: { name: item.DGMENT.trim() }
            }
          })

        let Parents = [], Children = [];
        const otherRels = new Set();

        (() => {

          Links.forEach(link => {
            if (link.source.name === mainEntity)
              Parents.push({
                name: link.target.name
              })
            else
              if (link.target.name === mainEntity)
                Children.push({
                  name: link.source.name
                })
              else {
                otherRels.add(link.source.name)
                otherRels.add(link.target.name)
              }
          })

        })();


        console.log("00000-", Parents, Children, otherRels);
        console.log("00000-MainEntity", mainEntity, typeof (mainEntity));
        console.log("00000-REALNODES", Nodes);
        console.log("00000-REALLinks", Links);
        console.log("00000-Parents", Parents);
        console.log("00000-Children", Children);
        console.log('potential list',pList);


        resolve({
          nodes: Nodes,
          links: Links,
          pList,
          relation: {
            mainEntity: mainEntity,
            parents: Parents,
            children: Children,
            otherRels,
          }

        })


      })
      .catch(e => {
        console.log(`%c ${e} for ${entid}`,'background: #222; color: #bada55')
        resolve({nodes: undefined})
      })

  })

};