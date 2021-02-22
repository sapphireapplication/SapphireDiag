import API_ADDRESS from "../../../server/apiaddress";
import {getPgmStructureChartData} from "./Diagrams/Index";
export const setProgramStructureChart = (param) => async (dispatch, getState) => {
  console.log("whats in param==", param);
  
  console.log("yahan aaya ki nahi")
  var state = getState();
  let qurl = '';
  let schema = [];
  let files = {};
  let entities = [];
  var pgmid = param.value;
  //TEXT: program.text
  getPgmStructureChartData(pgmid, state.fetchProgramsReducer.chartArray).then(
    (data) => {
      const payload = data.data;
      //console.log('after calling elimination payload ',payload)
      const pgmListParm = getPgms(payload);
      //console.log('pgmListParm',pgmListParm)
      qurl = `${API_ADDRESS}/PgmDiagSchemas/${pgmListParm}`;
      fetch(qurl)
        .then((res) => res.json())
        .then(async (json) => {
          schema = json.response;
          files = json.filesUsedByPgm;
          entities = json.entPrograms;
          console.log('pgmschema files===', json.response);
          console.log('xxx ', entities);
          dispatch({
            type: 'SET_STR_DIAGRAM_DATA',
            payload: payload, //contains data after calling getPgmStructureChartData
            schemaBoxes: schema,
            fileList: files,
            entPrograms: entities,
            diagId: 1,
            pgm: pgmid,
            program: param,
          });
        });
    }
  );
};

export const getPgms = (pgmList) => {
    const programs = pgmList[2].reduce((acc, obj) => acc.concat(obj));
    const programList = programs.map((pgm) => pgm.program);
    //console.log('SHILPI_PGM apiutils',programList);
    const stingifiedList = JSON.stringify(programList);
    return stingifiedList;
  };