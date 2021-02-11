import { fetchDdlList } from "./ServerActions";

export const setMainContentData = () => async (dispatch, getState) => {
  var state = getState();
  var buttonList = state.serverReducer.frameLoad
    ? state.mainContentReducer.buttonList
    : [];
  var caption = state.serverReducer.frameLoad
    ? state.mainContentReducer.caption
    : null;
  var messageList = [];
  var fieldList = state.serverReducer.frameLoad
    ? state.mainContentReducer.fieldList
    : [];
  var gridList = [];

  state.serverReducer.pageResp.operation.container.forEach((container) => {
    switch (container.type) {
      /* Process button list */
      case "REQUESTCODELIST":
        /* Fetch buttons list */
        if (buttonList.length === 0) {
          if (Array.isArray(container.array)) {
            if (container.array.find((arrObj) => arrObj.type === "button")) {
              if (
                Array.isArray(
                  container.array.find((arrObj) => arrObj.type === "button")
                ).item
              )
                buttonList = container.array.find(
                  (arrObj) => arrObj.type === "button"
                ).item;
              else
                buttonList.push(
                  container.array.find((arrObj) => arrObj.type === "button")
                    .item
                );
            }
          } else {
            if (container.array.type === "button") {
              if (Array.isArray(container.array.item))
                buttonList = container.array.item;
              else buttonList.push(container.array.item);
            }
          }
        }
        break;

      /* Process message list */
      case "MESSAGELIST":
        /* Fetch message list */
        if (Array.isArray(container.array.item))
          messageList = container.array.item;
        else messageList.push(container.array.item);

        break;

      /* Process screen elements */
      case "SCREEN":
        /* Fetch caption */
        if (container.caption && caption === null)
          caption = container.caption.value;

        /* Fetch field list */
        if (container.field && fieldList.length === 0) {
          if (Array.isArray(container.field)) {
            fieldList = container.field;
          } else fieldList.push(container.field);
        }

        if (fieldList.length && caption === null) {
          caption = fieldList.find((field) => field.id === "CAPTION").value;
        }

        /* Fetch grid list */
        if (container.grid) {
          if (Array.isArray(container.grid)) gridList = container.grid;
          else gridList.push(container.grid);
        }

        /* Compose ddl list for which request has to be sent */
        var ddlArr = [];

        fieldList
          .filter((field) => state.serverReducer.ddlList.indexOf(field.id) >= 0)
          .forEach((fld) => {
            ddlArr.push(fld.id);
          });

        gridList.forEach((grid) => {
          if (grid.rows.row) {
            if (Array.isArray(grid.rows.row)) {
              grid.rows.row.forEach((row) => {
                row.item.forEach((item) => {
                  if (state.serverReducer.ddlList.indexOf(item.id) >= 0)
                    ddlArr.push(item.id);
                });
              });
            } else {
              grid.rows.row.item.forEach((item) => {
                if (state.serverReducer.ddlList.indexOf(item.id) >= 0)
                  ddlArr.push(item.id);
              });
            }
          }
        });

        ddlArr = [...new Set(ddlArr)];

        /* Send DDL List request */
        ddlArr.forEach((ddlId) => {
          if (state.serverReducer.ddlData[ddlId] === undefined)
            dispatch(fetchDdlList(ddlId));
        });

        break;

      default:
        break;
    }
  });

  dispatch({
    type: "SET_MAIN_CONTENT_BUTTON_LIST",
    payload: buttonList,
  });

  dispatch({
    type: "SET_MAIN_CONTENT_MSG_LIST",
    payload: messageList,
  });

  dispatch({
    type: "SET_MAIN_CONTENT_CAPTION",
    payload: caption,
  });

  dispatch({
    type: "SET_MAIN_CONTENT_FIELD_LIST",
    payload: fieldList,
  });

  dispatch({
    type: "SET_MAIN_CONTENT_GRID_LIST",
    payload: gridList,
  });
};

export const setMainContentNavList = (data, index) => async (
  dispatch,
  getState
) => {
  const state = getState();
  // console.log(
  //   "inside setmaincontentnavlist==",
  //   data,
  //   index,
  //   state.mainContentReducer.navList
  // );
  var navList = state.mainContentReducer.navList.slice(0);
  //console.log("navlist===", navList);
  if (data === "LOGOFF" || data === "BACKTOLOGIN") {
    navList.splice(1, navList.length - 1);
  } else if (data) {
    var newNavData = {
      id: data,
      screen: state.serverReducer.screen,
    };

    if (
      navList.length === 0 ||
      navList.find(
        (nav) => nav.id === newNavData.id && nav.screen === newNavData.screen
      ) === undefined
    )
      navList.push(newNavData);
  } else if (index != null || index != undefined) {
    navList.splice(index + 1);
  } else navList.splice(-1, 1);

  dispatch({
    type: "SET_MAIN_CONTENT_NAVLIST",
    payload: navList,
  });
};
