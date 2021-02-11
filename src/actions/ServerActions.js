import apis from "../apis/index";
import { setMainContentNavList } from "./MainContentActions";
import xml2js from "xml2js";

function convertXMLToJSON(xmlData) {
  return new Promise(async (resolve, reject) => {
    var jsonDataArr = [];

    await Promise.all(
      xmlData.map((data) => {
        for (var key in data) {
          var jsonData = {};

          xml2js.parseString(
            data[key],
            {
              explicitArray: false,
              mergeAttrs: true,
            },
            function (err, result) {
              jsonData[`${key}`] = result;
              jsonDataArr.push(jsonData);
            }
          );
        }
      })
    );

    resolve(jsonDataArr);
  });
}

function convertJSONtoXML(jsonData) {
  return new Promise((resolve, reject) => {
    var builder = new xml2js.Builder({ headless: true });
    var xmlReq = builder.buildObject(jsonData);

    resolve(xmlReq);
  });
}

export const sendServerReq = (req) => async (dispatch, getState) => {
  const state = getState();

  var xmlReq = await convertJSONtoXML(req);

  console.log("Sending XML Request:\n", xmlReq);
};

export const prepareServerReq = () => async (dispatch, getState) => {
  const state = getState();
  var reqObj = {};
  var screenObj = undefined;

  /* Compose server request (JSON) */
  reqObj["operation"] = { container: [] };

  reqObj.operation.container.push({
    $: {
      type: "GLOBAL",
    },
    field: [
      {
        $: {
          id: "ACTION",
          value: state.serverReducer.reqAction,
        },
      },
      {
        $: {
          id: "FUNCTION",
          value: state.serverReducer.reqFunction,
        },
      },
      {
        $: {
          id: "LANGID",
          value: state.serverReducer.reqLangId,
        },
      },
      {
        $: {
          id: "REQUESTCODE",
          value: state.serverReducer.reqRequestCode,
        },
      },
      {
        $: {
          id: "SCREEN",
          value: state.serverReducer.reqScreen,
        },
      },
      {
        $: {
          id: "THREAD",
          value: state.serverReducer.reqThread,
        },
      },
    ],
  });

  if (state.serverReducer.reqFunction != "GETDDLIST") {
    if (state.mainContentReducer.fieldList.length) {
      screenObj = {
        $: {
          type: "SCREEN",
        },
      };

      screenObj["caption"] = { $: { value: state.mainContentReducer.caption } };

      /* Popullating field(s) info */
      switch (true) {
        case state.mainContentReducer.fieldList.length === 1:
          if (
            (state.mainContentReducer.fieldList[0].editable &&
              state.mainContentReducer.fieldList[0].editable === "true") ||
            (state.mainContentReducer.fieldList[0].visible &&
              state.mainContentReducer.fieldList[0].visible === "false")
          ) {
            screenObj["field"] = { $: {} };

            Object.keys(state.mainContentReducer.fieldList[0]).forEach(
              (key) => {
                if (
                  key === "value" &&
                  document.getElementById(
                    state.mainContentReducer.fieldList[0].id
                  )
                ) {
                  if (
                    state.serverReducer.ddlList.indexOf(
                      state.mainContentReducer.fieldList[0].id
                    ) >= 0
                  )
                    screenObj["field"]["$"][key] = document.getElementById(
                      state.mainContentReducer.fieldList[0].id
                    ).nextSibling.value;
                  else
                    screenObj["field"]["$"][key] = document.getElementById(
                      state.mainContentReducer.fieldList[0].id
                    ).value;
                } else {
                  screenObj["field"]["$"][key] =
                    state.mainContentReducer.fieldList[0][key];
                }
              }
            );

            screenObj["field"]["$"]["browse"] = false;
          }

          break;

        case state.mainContentReducer.fieldList.length > 1:
          screenObj["field"] = [];

          state.mainContentReducer.fieldList.forEach((field) => {
            if (
              (field.editable && field.editable === "true") ||
              (field.visible && field.visible === "false")
            ) {
              var obj = { $: {} };

              Object.keys(field).forEach((key) => {
                if (key === "value" && document.getElementById(field.id)) {
                  if (state.serverReducer.ddlList.indexOf(field.id) >= 0)
                    obj["$"][key] = document.getElementById(
                      field.id
                    ).nextSibling.value;
                  else obj["$"][key] = document.getElementById(field.id).value;
                } else {
                  obj["$"][key] = field[key];
                }

                obj["$"]["browse"] = false;
              });
              screenObj["field"].push(obj);
            }
          });

          break;

        default:
          console.log("hit default in composing xml req");
      }

      /* Popullating grid(s) info */
      switch (true) {
        case state.mainContentReducer.gridList.length === 1:
          /* compose grid tag when there is only one grid in the list */
          screenObj["grid"] = {
            $: {
              id: state.mainContentReducer.gridList[0].id,
            },
          };

          screenObj["grid"]["rows"] = {};

          if (Array.isArray(state.mainContentReducer.gridList[0].rows.row)) {
            /* When there are more than one row in the grid data */
            screenObj["grid"]["rows"]["row"] = [];

            state.mainContentReducer.gridList[0].rows.row.forEach((row) => {
              var rowObj = {
                $: {
                  nr: row.nr,
                },
                item: [],
              };

              row.item.forEach((col) => {
                if (
                  (col["visible"] && col["visible"] === "false") ||
                  (col["editable"] && col["editable"] === "true")
                ) {
                  var colObj = { $: {} };

                  for (var key in col) {
                    colObj["$"][key] = col[key];
                  }
                  rowObj.item.push(colObj);
                }
              });

              screenObj["grid"]["rows"]["row"].push(rowObj);
            });
          } else if (state.mainContentReducer.gridList[0].rows.row) {
            /* When there is just one row in the grid data */
            screenObj["grid"]["rows"]["row"] = {
              $: {
                nr: state.mainContentReducer.gridList[0].rows.row.nr,
              },
              item: [],
            };

            state.mainContentReducer.gridList[0].rows.row.item.forEach(
              (col) => {
                if (
                  (col["visible"] && col["visible"] === "false") ||
                  (col["editable"] && col["editable"] === "true")
                ) {
                  var colObj = { $: {} };

                  for (var key in col) {
                    colObj["$"][key] = col[key];
                  }
                  screenObj["grid"]["rows"]["row"]["item"].push(colObj);
                }
              }
            );
          }

          break;

        case state.mainContentReducer.gridList.length > 1:
          /* compose grid tag when there is more than one grid */
          screenObj["grid"] = [];

          state.mainContentReducer.gridList.forEach((grid) => {
            var gridObj = {
              $: {
                id: grid.id,
              },
              rows: {},
            };

            if (Array.isArray(grid.rows.row)) {
              /* When there are more than one row in the grid data */
              gridObj["rows"]["row"] = [];

              grid.rows.row.forEach((row) => {
                var rowObj = {
                  $: {
                    nr: row.nr,
                  },
                  item: [],
                };

                row.item.forEach((col) => {
                  if (
                    (col["visible"] && col["visible"] === "false") ||
                    (col["editable"] && col["editable"] === "true")
                  ) {
                    var colObj = { $: {} };

                    for (var key in col) {
                      colObj["$"][key] = col[key];
                    }
                    rowObj.item.push(colObj);
                  }
                });

                gridObj["rows"]["row"].push(rowObj);
              });
            } else if (grid.rows.row) {
              /* When there is just one row in the grid data */
              gridObj["rows"]["row"] = {
                $: {
                  nr: grid.rows.row.nr,
                },
                item: [],
              };

              grid.rows.row.item.forEach((col) => {
                if (
                  (col["visible"] && col["visible"] === "false") ||
                  (col["editable"] && col["editable"] === "true")
                ) {
                  var colObj = { $: {} };

                  for (var key in col) {
                    colObj["$"][key] = col[key];
                  }
                  gridObj["rows"]["row"]["item"].push(colObj);
                }
              });
            }
          });

          break;

        default:
          console.log("hit default in composing xml req");
      }

      reqObj.operation.container.push(screenObj);
    }
  }

  dispatch(sendServerReq(reqObj));
};

export const readServerResp = (screen) => async (dispatch, getState) => {
  const state = getState();
  const response = await apis.get("/getResp/");

  var jsonRespData = await convertXMLToJSON(response.data.content);
  //console.log("show data==", jsonRespData);

  var res = jsonRespData.find((element) => {
    // console.log(Object.keys(element)[0]);
    // console.log(state.serverReducer);
    // console.log(
    //   element[Object.keys(element)[0]].operation.container[0].field.find(
    //     (fld) => fld.id === "ACTION"
    //   ).value === state.serverReducer.action
    // );
    // console.log(
    //   element[Object.keys(element)[0]].operation.container[0].field.find(
    //     (fld) => fld.id === "FUNCTION"
    //   ).value === state.serverReducer.function
    // );
    // console.log(
    //   element[Object.keys(element)[0]].operation.container[0].field.find(
    //     (fld) => fld.id === "REQUESTCODE"
    //   ).value === state.serverReducer.requestCode
    // );
    // console.log(
    //   element[Object.keys(element)[0]].operation.container[0].field.find(
    //     (fld) => fld.id === "SCREEN"
    //   ).value === (screen ? screen : state.serverReducer.screen)
    // );
    // console.log(
    //   Object.keys(element)[0].indexOf(state.serverReducer.fileName) > 0
    // );
    return (
      //   element[Object.keys(element)[0]].operation.container[0].field[0].value ===
      //     state.serverReducer.action &&
      //   element[Object.keys(element)[0]].operation.container[0].field[1].value ===
      //     state.serverReducer.function &&
      //   element[Object.keys(element)[0]].operation.container[0].field[3].value ===
      //     state.serverReducer.requestCode &&
      //   element[Object.keys(element)[0]].operation.container[0].field[4].value ===
      //     (screen ? screen : state.serverReducer.screen) &&
      //   Object.keys(element)[0].indexOf(state.serverReducer.fileName) > 0

      element[Object.keys(element)[0]].operation.container[0].field.find(
        (fld) => fld.id === "ACTION"
      ).value === state.serverReducer.action &&
      element[Object.keys(element)[0]].operation.container[0].field.find(
        (fld) => fld.id === "FUNCTION"
      ).value === state.serverReducer.function &&
      element[Object.keys(element)[0]].operation.container[0].field.find(
        (fld) => fld.id === "REQUESTCODE"
      ).value === state.serverReducer.requestCode &&
      element[Object.keys(element)[0]].operation.container[0].field.find(
        (fld) => fld.id === "SCREEN"
      ).value === (screen ? screen : state.serverReducer.screen) &&
      Object.keys(element)[0].indexOf(state.serverReducer.fileName) >= 0
    );
  });

  //console.log("res in serveraction===", res);

  if (screen) {
    dispatch({
      type: "UPDATE_SCREEN",
      payload: screen,
    });
  }

  dispatch({
    type: "READ_SERVER_RESP",
    payload: jsonRespData,
  });

  dispatch({
    type: "READ_PAGE_RESP",
    payload: res[Object.keys(res)[0]],
  });
};

export const fetchDdlList = (ddlCode) => async (dispatch, getState) => {
  let state = getState();

  dispatch({
    type: "SET_REQ_ACTION",
    payload: "",
  });
  dispatch({
    type: "SET_REQ_FUNC",
    payload: "GETDDLIST",
  });
  dispatch({
    type: "SET_REQ_LANGID",
    payload: "E",
  });
  dispatch({
    type: "SET_REQ_REQUEST_CODE",
    payload: ddlCode,
  });
  dispatch({
    type: "SET_REQ_SCREEN",
    payload: "",
  });
  dispatch({
    type: "SET_REQ_THREAD",
    payload: "1",
  });

  dispatch(prepareServerReq());

  let ddlData = Object.assign({}, state.serverReducer.ddlData);

  let data = state.serverReducer.serverResp.find(
    (data) =>
      data[Object.keys(data)].operation.container[0] &&
      data[Object.keys(data)].operation.container[0].field[3].value === ddlCode
  );

  ddlData[`${ddlCode}`] =
    data[Object.keys(data)[0]].operation.container[1].array;

  dispatch({
    type: "SET_DDL_DATA",
    payload: ddlData,
  });
};

export const fetchBaseTemplate = () => async (dispatch, getState) => {
  let state = getState();
  let template = Object.assign({}, state.serverReducer.baseTemplate);
  let resp = undefined;

  if (!template[state.serverReducer.screen]) {
    import(
      "../baseTemplates/page-schema-" + state.serverReducer.screen + ".json"
    ).then((template) => {
      resp = template.default;
      template[state.serverReducer.screen] = resp;
      dispatch(
        setMainContentNavList(template[state.serverReducer.screen].navigation)
      );

      // if (template[state.serverReducer.screen]) {
      //     template[state.serverReducer.screen].frame.forEach((frame) => {
      //         if (frame.fldDdlMap) {
      //             frame.fldDdlMap.forEach((ddl) => {
      //                 if (state.serverReducer.ddlData[ddl.ddlId] === undefined) {
      //                     dispatch(fetchDdlList(ddl.ddlId))
      //                 }
      //             })
      //         }
      //     })
      // }

      dispatch({
        type: "SET_BASE_TEMPLATE",
        payload: template,
      });
    });
  } else {
    dispatch(
      setMainContentNavList(template[state.serverReducer.screen].navigation)
    );
  }
};

export const buttonClickEventHandler = (
  filename,
  action,
  func,
  requestCode,
  screen,
  frameCtrl,
  reqParams
) => async (dispatch, getState) => {
  const state = getState();
  console.log("reqparams====", reqParams);
  if (reqParams) {
    dispatch({
      type: "SET_REQ_FILENAME",
      payload: reqParams.filename,
    });
    dispatch({
      type: "SET_REQ_ACTION",
      payload: reqParams.action,
    });
    dispatch({
      type: "SET_REQ_FUNC",
      payload: reqParams.function,
    });
    dispatch({
      type: "SET_REQ_LANGID",
      payload: reqParams.langId,
    });
    dispatch({
      type: "SET_REQ_REQUEST_CODE",
      payload: reqParams.requestCode,
    });
    dispatch({
      type: "SET_REQ_SCREEN",
      payload: reqParams.screen,
    });
    dispatch({
      type: "SET_REQ_THREAD",
      payload: reqParams.thread,
    });
  }

  if (frameCtrl) {
    Promise.resolve(dispatch(prepareServerReq())).then(() => {
      dispatch({
        type: "UPDATE_FILENAME",
        payload: filename,
      });
      dispatch({
        type: "UPDATE_ACTION",
        payload: action,
      });
      dispatch({
        type: "UPDATE_FUNC",
        payload: func,
      });
      dispatch({
        type: "UPDATE_REQUEST_CODE",
        payload: requestCode,
      });
      dispatch({
        type: "UPDATE_SCREEN",
        payload: screen,
      });
      dispatch({
        type: "UPDATE_FRAME_LOAD",
        payload: frameCtrl,
      });

      dispatch(readServerResp());
    });
  } else {
    console.log("hopefully yahan aayega");
    Promise.resolve(dispatch(prepareServerReq())).then(() => {
      console.log(
        "inside serveraction==",
        filename,
        action,
        func,
        requestCode,
        screen,
        frameCtrl
      );
      dispatch({
        type: "UPDATE_FILENAME",
        payload: filename,
      });
      dispatch({
        type: "UPDATE_ACTION",
        payload: action,
      });
      dispatch({
        type: "UPDATE_FUNC",
        payload: func,
      });
      dispatch({
        type: "UPDATE_REQUEST_CODE",
        payload: requestCode,
      });
      dispatch({
        type: "UPDATE_SCREEN",
        payload: screen,
      });
      dispatch({
        type: "UPDATE_FRAME_LOAD",
        payload: frameCtrl,
      });

      Promise.resolve(dispatch(readServerResp())).then(() => {
        dispatch(fetchBaseTemplate());
      });
    });
  }
};

export const linkClickEventHandler = (screen, reqParams) => async (
  dispatch,
  getState
) => {
  const state = getState();
  console.log("inside link handler==", screen, reqParams);

  if (reqParams) {
    dispatch({
      type: "SET_REQ_FILENAME",
      payload: reqParams.filename,
    });
    dispatch({
      type: "SET_REQ_ACTION",
      payload: reqParams.action,
    });
    dispatch({
      type: "SET_REQ_FUNC",
      payload: reqParams.function,
    });
    dispatch({
      type: "SET_REQ_LANGID",
      payload: reqParams.langId,
    });
    dispatch({
      type: "SET_REQ_REQUEST_CODE",
      payload: reqParams.requestCode,
    });
    dispatch({
      type: "SET_REQ_SCREEN",
      payload: reqParams.screen,
    });
    dispatch({
      type: "SET_REQ_THREAD",
      payload: reqParams.thread,
    });

    dispatch(prepareServerReq());
  }

  if (screen === "RW7002") {
    dispatch({
      type: "UPDATE_FILENAME",
      payload: null,
    });
    dispatch({
      type: "UPDATE_ACTION",
      payload: null,
    });
    dispatch({
      type: "UPDATE_FUNC",
      payload: null,
    });
    dispatch({
      type: "UPDATE_REQUEST_CODE",
      payload: null,
    });
    dispatch({
      type: "UPDATE_SCREEN",
      payload: screen,
    });
    dispatch({
      type: "READ_PAGE_RESP",
      payload: null,
    });

    dispatch({
      type: "SET_MAIN_CONTENT_BUTTON_LIST",
      payload: [
        {
          id: "GO",
          value: "Go",
        },
        {
          id: "BACK",
          value: "Back",
        },
      ],
    });

    dispatch({
      type: "SET_MAIN_CONTENT_MSG_LIST",
      payload: [],
    });

    dispatch({
      type: "SET_MAIN_CONTENT_CAPTION",
      payload: ["Reseller Login"],
    });

    dispatch({
      type: "SET_MAIN_CONTENT_FIELD_LIST",
      payload: [
        {
          id: "RESELLERID",
          value: "",
          label: "Reseller ID",
          editable: "true",
        },
        {
          id: "PASSWORD",
          value: "",
          label: "Password",
          editable: "true",
        },
      ],
    });

    dispatch({
      type: "SET_MAIN_CONTENT_GRID_LIST",
      payload: [],
    });

    /* Set sidebar header redux state  */
    dispatch({
      type: "SET_SIDEBAR_HEADER",
      payload: null,
    });

    /* Set sidebar links redux state  */
    dispatch({
      type: "SET_SIDEBAR_LINKS",
      payload: null,
    });

    dispatch(fetchBaseTemplate());
  } else if (screen === "LOGOFF") {
    dispatch({
      type: "UPDATE_FILENAME",
      payload: "W.LIC.SEL__",
    });
    dispatch({
      type: "UPDATE_ACTION",
      payload: "SEL",
    });
    dispatch({
      type: "UPDATE_FUNC",
      payload: "W.LIC.SEL",
    });
    dispatch({
      type: "UPDATE_REQUEST_CODE",
      payload: "",
    });
    dispatch({
      type: "UPDATE_SCREEN",
      payload: screen,
    });
    dispatch({
      type: "READ_PAGE_RESP",
      payload: null,
    });

    dispatch({
      type: "SET_MAIN_CONTENT_BUTTON_LIST",
      payload: [
        {
          id: "BACKTOLOGIN",
          value: "Back to User Login",
        },
      ],
    });

    dispatch({
      type: "SET_MAIN_CONTENT_MSG_LIST",
      payload: [
        {
          value:
            "You successfully logged out of MD License Tool. There is no other active thread.",
          severity: "10",
        },
      ],
    });

    dispatch({
      type: "SET_MAIN_CONTENT_CAPTION",
      payload: ["Logoff"],
    });

    dispatch({
      type: "SET_MAIN_CONTENT_FIELD_LIST",
      payload: [],
    });

    dispatch({
      type: "SET_MAIN_CONTENT_GRID_LIST",
      payload: [],
    });

    /* Set sidebar header redux state  */
    dispatch({
      type: "SET_SIDEBAR_HEADER",
      payload: null,
    });

    /* Set sidebar links redux state  */
    dispatch({
      type: "SET_SIDEBAR_LINKS",
      payload: null,
    });

    dispatch(prepareServerReq());

    dispatch(fetchBaseTemplate());
  } else {
    Promise.resolve(dispatch(prepareServerReq())).then(() => {
      Promise.resolve(dispatch(readServerResp())).then(() => {
        dispatch(fetchBaseTemplate());
      });
    });
  }
};

export const loginHandler = (id, pass) => async (dispatch, getState) => {
  const state = getState();
  const response = await apis.get(
    "/auth/" +
      document.getElementById("USRID").value +
      "/" +
      document.getElementById("PASSWORD").value
  );

  console.log("Login response:", response);

  if (response.data.status === 200) {
    var reqParams = {};

    reqParams.filename = "W.LIC.SO_GO_";
    reqParams.action = "SEL";
    reqParams.function = "W.LIC.SO";
    reqParams.langId = "E";
    reqParams.requestCode = "GO";
    reqParams.screen = "RW7002";
    reqParams.thread = "1";

    dispatch(
      buttonClickEventHandler(
        "W.LIC.SO_GO_",
        "RESELLER",
        "W.CST.LST",
        "",
        "RW7004",
        false,
        reqParams
      )
    );
  } else {
    dispatch({
      type: "SET_MAIN_CONTENT_MSG_LIST",
      payload: [
        {
          value: "User not authenticated!",
          severity: "20",
        },
      ],
    });
  }
};

export const logoffHandler = () => async (dispatch, getState) => {
  const state = getState();
  const response = await apis.get(
    "/logoff/" + state.sessionInfoReducer.sessionInfo.jobNumber
  );
  console.log("Logoff response: ", response.data);
  dispatch(linkClickEventHandler("LOGOFF"));
};
