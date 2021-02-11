import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import PageRenderer from "./PageRenderer";

import { setEntityData } from "../actions/EntityDataActions";
import { setProgramData } from "../actions/ProgramDataActions";
import { setSchemaData } from "../actions/SchemaDataActions";
import { setPgmSchemaData } from "../actions/PgmSchemaDataActions";
import { setEntPgmFilesData } from "../actions/EntPgmFilesDataActions";
import { setEntViewData } from "../actions/EntViewData";
import { setEntRelData } from "../actions/EntRelData";
import { setForEntity } from "../actions/setForEntity";
import { setForProgram } from "../actions/setForProgram";
import { fetchBaseTemplate } from "../actions/setscreenPositionAction";
import { setPgmCalledPgmData } from "../actions/PgmCalledPgmDataActions";
import { setPgmCallingPgmData } from "../actions/PgmCallingPgmDataActions";
import { setPgmCodeData } from "../actions/PgmCodeDataActions";
import { setPgmParamData } from "../actions/PgmParamDataActions";
import { setPgmCallingParamData } from "../actions/PgmCallingParamDataActions";
import { setNavListData } from "../actions/setNavListDataActions";
//import { setDataUsageData } from "../actions/DataUsageDiagram/DataUsageDataAction";
import { setDataUsageProgram } from "../actions/DataUsageDiagram/DataUsageProgramAction";
import { setDataUsageFile } from "../actions/DataUsageDiagram/DataUsageFileAction";
import { setPgmPgmFilesData } from "../actions/PgmPgmFilesDataAction";
import { setProgramStructureChart } from "../actions/ProgramStructureChart/ProgramStrucDataAction.js";
import { setDMDChart} from "../actions/DMD/DMDDataAction.js";
import {setSourceBrowser} from "../actions/DataUsageDiagram/SourceBrowserAction";
import { setDiagramType } from "../actions/setDiagramType";
import { setDataUsageProgramList} from "../actions/setDataUsageProgramActions";
import { setDataUsageFileList} from "../actions/setDataUsageFileActions";

const mapStateToProps = (state) => {
  return {
    entityList: state.fetchentitiesReducer.entityList,
    entRelsDMD: state.fetchentitiesReducer.entRelsDMD,
    programList: state.fetchProgramsReducer.programList,
    chartArray: state.fetchProgramsReducer.chartArray,
    ForEntity: state.fetchForEntityReducer.forEntity,
    schemaDetail: state.fetchSchemaReducer.schemaDetails,
    pgmSchemaDetail: state.fetchPgmSchemaReducer.pgmSchemaDetails,
    entPgmFileDetail: state.fetchEntPgmFilesReducer.entPgmFileDetails,
    ForProgram: state.fetchForProgramReducer.forProgram,
    entviewDetail: state.fetchEntViewReducer.entviewDetails,
    entrelDetail: state.fetchEntRelReducer.entrelDetails,
    screenDetail: state.setscreenPositionReducer.screenDetails,
    leftpaneDetail: state.setscreenPositionReducer.leftpaneDetails,
    pgmCallingDetail: state.fetchPgmCallingReducer.pgmCallingDetails,
    pgmCalledDetail: state.fetchPgmCalledReducer.pgmCalledDetails,
    pgmCodeDetail: state.fetchPgmCodeReducer.pgmCodeDetails,
    pgmParamDetail: state.fetchPgmParamReducer.pgmParamDetails,
    pgmCallingParamDetail:
      state.fetchPgmCallingParamReducer.pgmCallingParamDetails,
    NavListData: state.fetchNavListDataReducer.NavListData,
    //DataUsageData: state.fetchDataUsageDataReducer.DataUsageData,
    //subList1: state.fetchDataUsageDataReducer.subList1,
    //subList2: state.fetchDataUsageDataReducer.subList2,
    DUDProgramData: state.fetchDUDProgramReducer.DUDProgramData,
    DUDFileData: state.fetchDUDFileReducer.DUDFileData,
    pgmPgmFileDetail: state.fetchPgmPgmFilesReducer.pgmPgmFileDetails,
    PgmStrData: state.fetchPgmStrChartReducer,
    DMDModelData: state.fetchDMDModelReducer,
    sourceBrowserData : state.fetchSourceBrowserReducer.SourceBrowserData,
    diagramType: state.fetchDiagramTypeReducer.diagType,
    dataUsageProgramList: state.fetchDataUsageProgramsReducer.dataUsageProgramList,
    dataUsageFileList: state.fetchDataUsageFilesReducer.dataUsageFileList,

    //DataToBeRender: state.setDataToBeRenderReducer.DataToBeRender, //
  };
};

function PageController(props) {
  /* To fill in the params to form req/resp accordingly */
  // var reqParams = {};
  // var resParams = {};
  const [load, setLoad] = useState("0");
  const [sideTab, setsideTab] = React.useState("Entities");

  /* Invoke startup action to read initial page response from server */
  useEffect(() => {
    //props.setEntityData();
    //props.fetchBaseTemplate("RC0010");
    //props.setdataToBeRendered();
  }, []);

  /* Link click event handler to simulate page navigation */

  function linkClickHandler(event, id, param2, label, controlstr) {
    console.log("in link event handler", id, param2, label, controlstr);
    /* on click programs-  id-PgmList  param2 BC-Program Details lable- LeftBar*/
    switch (id) {
      case "CodeList":
        console.log("hit CodeList", param2);
        props.setDiagramType("SOURCE_BROWSER_PGM")
        props.fetchBaseTemplate("RC0030");
        props.setPgmCodeData(param2);
        //props.setNavListData(label, id, controlstr);
        
        setsideTab(id);
        setLoad(id);
        break;
      case "EntList":
        // props.readnsetserverdata(id, param2, label, controlstr);
        console.log("hit diagram");
        props.setEntityData();
        props.setNavListData(label, id, controlstr);
        props.fetchBaseTemplate("RC0010");

        setLoad(id);
        break;
      case "PgmList":
        props
          .setProgramData("")
          .then((dispatch, res) => console.log(res, dispatch))
          .then((json) =>
            props
              .fetchBaseTemplate("RC0020")
              .then((dispatch, res) => console.log(props))
              .then((json) =>
                props
                  .setNavListData(label, id, controlstr)
                  //.then((res) => console.log(res))
                  .then((json) => {
                    console.log(" id in PGMList====", id);
                    setLoad(id);
                  })
              )
          );

        // console.log("hit Program");
        // props.fetchBaseTemplate("RC0020");
        // props.setProgramData("");
        // props.setNavListData(label, id, controlstr);

        // setLoad(id);
        break;
      case "but11":
        //console.log("hit Program List", id, param2);
        props.fetchBaseTemplate("RC0011");
        //props.setProgramData(param2);
        props.setPgmPgmFilesData(param2);
        props.setForEntity(param2);
        props.setNavListData(label, id, controlstr);

        setLoad(id);
        break;
      case "but111":
        console.log("hit Schema Details", param2);
        props.fetchBaseTemplate("RC0022");
        //props.fetchBaseTemplate("RC00111");
        props.setPgmSchemaData(param2);
        props.setForEntity(param2);
        props.setNavListData(label, id, controlstr);
        setLoad(id);
        break;
      case "but12":
        //console.log("hit Schema Details");
        props.fetchBaseTemplate("RC0012");
        props.setSchemaData(param2);
        props.setForEntity(param2);
        props.setNavListData(label, id, controlstr);
        // props.setDataToBeRender({
        //   data: props.schemaDetail,
        //   ForItem: props.ForEntity,
        // });
        setLoad(id);
        break;
      case "but13":
        //console.log("hit Entity View Details");
        props.fetchBaseTemplate("RC0013");
        props.setEntViewData(param2);
        props.setForEntity(param2);
        props.setNavListData(label, id, controlstr);
        // props.setDataToBeRender({
        //   data: props.entviewDetail,
        //   ForItem: props.ForEntity,
        // });
        setLoad(id);
        break;
      case "but14":
        //console.log("hit Entity Relations Details");
        props.fetchBaseTemplate("RC0014");
        props.setEntRelData(param2);
        props.setForEntity(param2);
        props.setNavListData(label, id, controlstr);
        // props.setDataToBeRender({
        //   data: props.entrelDetail,
        //   ForItem: props.ForEntity,
        // });
        setLoad(id);
        break;
      case "but15":
        props.setEntityData()
       .then((json)=>
        props
        .setDMDChart(param2)
        .then((dispatch, res) => console.log(res, dispatch))
        .then((json) =>
          props
            .fetchBaseTemplate("RC0015")
            .then((dispatch, res) => console.log(res, dispatch))
            .then((json) =>
              props
                .setForEntity(param2)
                .then((res) => console.log(res))
                .then((json) =>
                  props
                    .setNavListData(label, id, controlstr)
                    .then((json) => {
                      console.log("id in but15====", id);
                      setLoad(id);
                    })
                )
            )
          )
        );
      break;
      case "but21":
        console.log("hit EntityList", id, param2);
        props.fetchBaseTemplate("RC0021");
        props.setEntPgmFilesData(param2);
        props.setForProgram(param2);
        props.setNavListData(label, id, controlstr);
        // props.setDataToBeRender({
        //   data: props.entPgmFileDetail,
        //   ForItem: props.ForProgram,
        // });
        setLoad(id);
        break;
      case "but22":
        //console.log("hit Schema Details");
        props.fetchBaseTemplate("RC0022");
        props.setPgmSchemaData(param2);
        props.setForProgram(param2);
        props.setNavListData(label, id, controlstr);
        // props.setDataToBeRender({
        //   data: props.pgmSchemaDetail,
        //   ForItem: props.ForProgram,
        // });
        setLoad(id);
        break;
      case "but23":
        //console.log("hit Schema Details");
        props.fetchBaseTemplate("RC0023");
        props.setPgmCalledPgmData(param2);
        props.setForProgram(param2);
        props.setNavListData(label, id, controlstr);

        setLoad(id);
        break;

      case "but241":
        //console.log("hit Schema Details");
        props.fetchBaseTemplate("RC00231");
        props.setPgmCallingParamData(param2);
        props.setForProgram(param2);
        props.setNavListData(label, id, controlstr);

        setLoad(id);
        break;
      case "but24":
        //console.log("hit Schema Details");
        props.fetchBaseTemplate("RC0024");
        props.setPgmCallingPgmData(param2);
        props.setForProgram(param2);
        props.setNavListData(label, id, controlstr);

        setLoad(id);
        break;
      case "but211": //Program/Entities/Pgmschema
        console.log("hit Schema Details", param2);
        props.fetchBaseTemplate("RC0022");
        //props.fetchBaseTemplate("RC00111");
        props.setPgmSchemaData(param2);
        props.setForProgram(param2);
        props.setNavListData(label, id, controlstr);

        setLoad(id);
        break;

      case "but221": //Program/Schema/Pgmcode
        console.log("hit Pgmcode Details", param2);
        props.fetchBaseTemplate("RC00221");
        props.setPgmCodeData(param2);
        props.setForProgram(param2);
        props.setNavListData(label, id, controlstr);

        setLoad(id);
        break;

      case "but25":
        console.log("page controller, but25");
        props.fetchBaseTemplate("RC0025");
        props.setPgmParamData(param2);
        props.setForProgram(param2);
        props.setNavListData(label, id, controlstr);

        setLoad(id);
        break;
      // case "but26":
      //   console.log("DUD, but26");
      //   props
      //     .setDataUsageData(param2, sublist.sublist1, sublist.sublist2)
      //     .then((dispatch, res) => console.log(res, dispatch))
      //     .then((json) =>
      //       props
      //         .fetchBaseTemplate("RC0026")
      //         .then((dispatch, res) => console.log(res, dispatch))
      //         .then((json) =>
      //           props
      //             .setForProgram(param2)
      //             .then((res) => console.log(res))
      //             .then((json) =>
      //               props
      //                 .setNavListData(label, id, controlstr)
      //                 //.then((res) => console.log(res))
      //                 .then((json) => {
      //                   console.log("id====", id);
      //                   setLoad(id);
      //                 })
      //             )
      //         )
      //     );

      //   // props.setNavListData(label, id, controlstr);
      //   // setLoad(id)
      //   break;
      case "but27":
        console.log('shilpi_du props',props)
               
        props.setDiagramType("DATA_USAGE_PGM")
        .then((res) => console.log(res))
        .then((json) =>
        
        props.setDataUsageProgramList()
        .then((json)=>
          props
          .setDataUsageProgram(param2)
          .then((dispatch, res) => console.log(res, dispatch))
          .then((json) =>
            props
              .fetchBaseTemplate("RC0027")
              .then((dispatch, res) => console.log(res, dispatch))
              .then((json) =>
                props
                  .setForProgram(param2)
                  .then((res) => console.log(res))
                  .then((json) =>
                    props
                      .setNavListData(label, id, controlstr)
                      //.then((res) => console.log(res))
                      .then((json) => {
                        console.log("id in but27====", id);
                        setLoad(id);
                      })
                  )
               )
            )
          )
         );

        // props.setNavListData(label, id, controlstr);
        // setLoad(id)
        break;
        case "but28":  //PGM STRUCTURE CHART
        let program = param2.find((o) => o.field === "PGMID");

        var pgmid = program.value
        console.log('shilpi pgmid', pgmid)
        //if(pgmid == '')

        props.setProgramData()
          .then((json) => {
            if (pgmid != '') {
              props
                .setProgramStructureChart(param2)
                .then((dispatch, res) => console.log(res, dispatch))
                .then((json) =>
                  props
                    .fetchBaseTemplate("RC0028")
                    .then((dispatch, res) => console.log(res, dispatch))
                    .then((json) =>
                      props
                        .setForProgram(param2)
                        .then((res) => console.log(res))
                        .then((json) =>
                          props
                            .setNavListData(label, id, controlstr)
                            .then((json) => {
                              console.log("id in but28====", id);
                              setLoad(id);
                            })
                        )
                    )
                )
            }
            else {
              console.log('in else part', label, id, controlstr)
              props
                .setNavListData(label, id, controlstr)
                .then((json) => {
                  setLoad(id)
                })
            }
          } //if
        );
          break;
          case "but29":  //DATA USAGE FILE
        console.log('shilpi_du props',props)
        /*if(list === undefined){
          list = props.programList 
        }*/
        
        props.setDiagramType("DATA_USAGE_FILE")
        .then((res) => console.log(res))
        .then((json) =>
        
        props.setDataUsageFileList()
        .then((json)=>
          props
          .setDataUsageFile(param2)
          .then((dispatch, res) => console.log(res, dispatch))
          .then((json) =>
            props
              .fetchBaseTemplate("RC0027")
              .then((dispatch, res) => console.log(res, dispatch))
              .then((json) =>
                props
                  .setForEntity(param2)
                  .then((res) => console.log(res))
                  .then((json) =>
                    props
                      .setNavListData(label, id, controlstr)
                      //.then((res) => console.log(res))
                      .then((json) => {
                        console.log("id in but29====", id);
                        setLoad(id);
                      })
                  )
               )
            )
          )
         );

        // props.setNavListData(label, id, controlstr);
        // setLoad(id)
        break;
          case "but31":
        props
          .setSourceBrowser(param2)
          .then((dispatch, res) => console.log(res, dispatch))
          .then((json) =>
            props
              .fetchBaseTemplate("RC0031")
              .then((dispatch, res) => console.log(res, dispatch))
              .then((json) =>
                props
                  .setForProgram(param2)
                  .then((res) => console.log(res))
                  .then((json) =>
                    props
                      .setNavListData(label, id, controlstr)
                      //.then((res) => console.log(res))
                      .then((json) => {
                        console.log("id in but31====", id);
                        setLoad(id);
                        
                      })
                  )
              )
          );

        // props.setNavListData(label, id, controlstr);
        // setLoad(id)
        break;

      default:
        //console.log("hit default link");
        setLoad("0");
        break;
    }
  }
  return (
    <PageRenderer
      //buttonClickHandler={buttonClickHandler}
      linkClickHandler={linkClickHandler}
      screenId={load}
      sideTab={sideTab}
      setsideTab={setsideTab}
      {...props}
    />
  );
}

//export default connect(mapStateToProps, mapDispatchToProps)(PageController);
export default connect(mapStateToProps, {
  setEntityData,
  setProgramData,
  setSchemaData,
  setPgmSchemaData,
  setEntViewData,
  setEntRelData,
  setEntPgmFilesData,
  setForEntity,
  setForProgram,
  fetchBaseTemplate,
  setDiagramType,
  setPgmCalledPgmData,
  setPgmCallingPgmData,
  setPgmCodeData,
  setPgmParamData,
  setPgmCallingParamData,
  setNavListData,
  //setDataUsageData,
  //setDataFlowProgram,
  setDataUsageProgram,
  setDataUsageFile,
  setPgmPgmFilesData,
  setProgramStructureChart,
  setDMDChart,
  setSourceBrowser,
  setDataUsageProgramList,
  setDataUsageFileList,
  //readnsetserverdata,
  //setDataToBeRender,
})(PageController);
