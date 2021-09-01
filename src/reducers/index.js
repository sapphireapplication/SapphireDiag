import { combineReducers } from "redux";
//import pageSchemaReducer from "./PageSchemaReducer";
import sidebarReducer from "./sidebarReducer";
//import serverReducer from "./ServerReducer";
import mainContentReducer from "./MainContentReducer";
import topbarReducer from "./TopbarReducer";
import sessionInfoReducer from "./SessionInfoReducer";
import pageElementsReducer from "./PageElementsReducer";
import fetchentitiesReducer from "./fetchentitiesReducer";
import fetchProgramsReducer from "./fetchProgramsReducer";
import fetchSchemaReducer from "./fetchSchemaReducer";
import fetchPgmSchemaReducer from "./fetchPgmSchemaReducer";
import fetchEntPgmFilesReducer from "./fetchEntPgmFilesReducer";
import fetchEntViewReducer from "./fetchEntViewReducer";
import fetchForEntityReducer from "./fetchForEntityReducer";
import fetchForProgramReducer from "./fetchForProgramReducer";
import fetchEntRelReducer from "./fetchEntRelReducer";
import setscreenPositionReducer from "./setscreenPositionReducer";
import fetchPgmCallingReducer from "./fetchPgmCallingReducer";
import fetchPgmCalledReducer from "./fetchPgmCalledReducer";
import fetchPgmCodeReducer from "./fetchPgmCodeReducer";
import fetchPgmParamReducer from "./fetchPgmParamReducer";
import fetchPgmCallingParamReducer from "./fetchPgmCallingParamReducer";
import fetchNavListDataReducer from "./fetchNavListDataReducer";
//import setDataToBeRenderReducer from "./setDataToBeRenderReducer";
//import fetchDataUsageDataReducer from "./DataUsageDiagram/fetchDataUsageDataReducer";
import fetchDUDProgramReducer from "./DataUsageDiagram/fetchDUDProgramReducer";
import fetchDUDFileReducer from "./DataUsageDiagram/fetchDUDFileReducer";
import fetchPgmPgmFilesReducer from "./fetchPgmPgmFilesReducer";
import fetchPgmStrChartReducer from "./fetchPgmStrChartReducer";
import fetchDMDModelReducer from "./fetchDMDModelReducer";
import fetchSourceBrowserReducer from "./DataUSageDiagram/fetchSourceBrowserReducer";
import fetchSBDataReducer from "./DataUSageDiagram/fetchSBDataReducer";
import fetchDiagramTypeReducer from "./fetchDiagramTypeReducer";
import fetchDataUsageProgramsReducer from "./fetchDataUsageProgramsReducer";
import fetchDataUsageFilesReducer from "./fetchDataUsageFilesReducer";
import fetchMainWindowStateReducer from "./fetchMainWindowStateReducer";
export default combineReducers({
  //pageSchemaReducer,
  sidebarReducer,
  // serverReducer,
  mainContentReducer,
  topbarReducer,
  sessionInfoReducer,
  pageElementsReducer,
  fetchentitiesReducer,
  fetchProgramsReducer,
  fetchSchemaReducer,
  fetchPgmSchemaReducer,
  fetchEntPgmFilesReducer,
  fetchEntViewReducer,
  fetchForEntityReducer,
  fetchForProgramReducer,
  fetchEntRelReducer,
  setscreenPositionReducer,
  fetchPgmCallingReducer,
  fetchPgmCalledReducer,
  fetchPgmCodeReducer,
  fetchPgmParamReducer,
  fetchPgmCallingParamReducer,
  fetchNavListDataReducer,
  //setDataToBeRenderReducer,
  //fetchDataUsageDataReducer,
  fetchDUDProgramReducer,
  fetchDUDFileReducer,
  fetchPgmPgmFilesReducer,
  fetchPgmStrChartReducer,
  fetchDMDModelReducer,
  fetchSourceBrowserReducer,
  fetchDiagramTypeReducer,
  fetchDataUsageProgramsReducer,
  fetchDataUsageFilesReducer,
  fetchMainWindowStateReducer,
  fetchSBDataReducer,
});
