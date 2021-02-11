export const fetchBaseTemplate = (screenId) => async (dispatch, res) => {
  // let state = getState();
  // let template = Object.assign({}, state.serverReducer.baseTemplate);
  // let resp = undefined;

  import("../baseTemplates/page-schema-" + screenId + ".json").then(
    (template) => {
      console.log("kya padha isne==", template.default);
      if (screenId === "RC0010" || screenId === "RC0020" || screenId === "RC0030"){
        dispatch({
          type: "SET_LEFT_PANE",
          payload: template.default,
        });
      } else
        dispatch({
          type: "SET_BASE_TEMPLATE",
          payload: template.default,
        });
      res({ status: "OK" });
    }
  );
};
