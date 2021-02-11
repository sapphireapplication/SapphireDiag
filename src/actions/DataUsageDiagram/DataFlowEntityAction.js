import API_ADDRESS from "../../../server/apiaddress";
export const setDataFlowEntity = (param) => async (dispatch, res) => {
  console.log("param in DFD==", param);
  let entity = param.find((o) => o.field === "ENTID");
  console.log("inside action DU==", param, program);
  //let dispatchflag = "";
  let qurl = "";
  //let files = {};
  let programs = [];
  let entschema = [];
  let pgmcode = [];
  let DFData = { ID: entity.value, TEXT: entity.text, children: [] };

  qurl = `${API_ADDRESS}/Pgmfiles/${entity.value}`;
  //console.log("qurl==", qurl);
  await fetch(qurl)
    .then((res) => res.json())
    .then(async (json) => {
      programs = json.response;

      await fetch(`${API_ADDRESS}/PgmSchema/3/${entity.ENTID}`)
        .then((res) => res.json())
        .then(async (json) => {
          //console.log("show entschema files===", json);
          entschema = json.response;

          await fetch(`${API_ADDRESS}/PgmCode/2/${entity.ENTID}`)
            .then((res) => res.json())
            .then(async (json) => {
              //console.log("show entschema files===", json);
              pgmcode = json.response;

              ////////////////////////
              /////making DFData

              programs.map((program) => {
                let pgmitem = { ID: program.PGMID, TEXT: program.PGMTX };
                let pSCH = [];
                var ppschma = entschema.filter(
                  (ent) => ent.PGMID === program.PGMID
                );
                ppschma.map((pschma) => {
                  var pschema = { ID: pschma.SHORTNM, TEXT: pschma.FTXT };
                  var ppcode = pgmcode.filter(
                    (pp) => trim(pp.MVARDB) === trim(pschma.SHORTNM)
                  );
                  pschema["children"] = ppcode;
                  pSCH.pschema;
                });
                pgmitem["children"] = pSCH;
                DFData["children"].push(pgmitem);
              });

              console.log("DFData in entity wala==", DFData);
            });
        });

      // dispatch({
      //   type: "FETCH_DFDPROGRAMDATA",
      //   payload: DFData,
      // });
      // res({ status: "OK" });
    });
};
