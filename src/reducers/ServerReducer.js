
const INITIAL_STATE = {
  reqFileName: "W.LIC.SEL__",
  reqAction: "",
  reqFunction: "W.LIC.SEL",
  reqLangId: "E",
  reqRequestCode: "",
  reqScreen: "",
  reqThread: "",

  fileName: "W.LIC.SEL__",
  action: "SEL",
  function: "W.LIC.SEL",
  requestCode: "",
  screen: "RW7000",
  serverResp: null,
  pageResp: null,
  frameLoad: false,
  baseTemplates: {},
  dfdData: null,
  ddlList: [
    "CSTLND",
    "CSTSTS",
    "FCSTS",
    "FPROD",
    "FVER",
    "LICSTS",
    "NEWVER",
    "PRODUCT",
  ],
  ddlData: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_REQ_FILENAME": {
      return {
        ...state,
        reqFileName: action.payload,
      };
    }
    case "SET_REQ_ACTION": {
      return {
        ...state,
        reqAction: action.payload,
      };
    }
    case "SET_REQ_FUNC": {
      return {
        ...state,
        reqFunction: action.payload,
      };
    }
    case "SET_REQ_LANGID": {
      return {
        ...state,
        reqLangId: action.payload,
      };
    }
    case "SET_REQ_REQUEST_CODE": {
      return {
        ...state,
        reqRequestCode: action.payload,
      };
    }
    case "SET_REQ_SCREEN": {
      return {
        ...state,
        reqScreen: action.payload,
      };
    }
    case "SET_REQ_THREAD": {
      return {
        ...state,
        reqThread: action.payload,
      };
    }
    case "SET_DDL_DATA": {
      return {
        ...state,
        ddlData: action.payload,
      };
    }
    case "READ_SERVER_RESP":
      return {
        ...state,
        serverResp: action.payload,
      };
    case "READ_PAGE_RESP":
      return {
        ...state,
        pageResp: action.payload,
      };
    case "SET_BASE_TEMPLATE":
      return {
        ...state,
        baseTemplates: action.payload,
      };
    case "UPDATE_FILENAME":
      return {
        ...state,
        fileName: action.payload,
      };
    case "UPDATE_ACTION":
      return {
        ...state,
        action: action.payload,
      };
    case "UPDATE_FUNC":
      return {
        ...state,
        function: action.payload,
      };
    case "UPDATE_REQUEST_CODE":
      return {
        ...state,
        requestCode: action.payload,
      };
    case "UPDATE_SCREEN":
      return {
        ...state,
        screen: action.payload,
      };
    case "UPDATE_FRAME_LOAD":
      return {
        ...state,
        frameLoad: action.payload,
      };
      case "DFD_DATA":
      return {
        ...state,
        dfdData: action.payload,
      };
    default:
      return state;
  }
};
