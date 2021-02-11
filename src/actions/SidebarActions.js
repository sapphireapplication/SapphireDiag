export const setSidebarData = () => async (dispatch) => {
  /* Extract and set sidebar data from page response */
  // var data = pageData.operation.container.find(
  //   (conObj) => conObj.type === "REQUESTCODELIST"
  // )
  //   ? Array.isArray(
  //       pageData.operation.container.find(
  //         (conObj) => conObj.type === "REQUESTCODELIST"
  //       ).array
  //     )
  //     ? pageData.operation.container
  //         .find((conObj) => conObj.type === "REQUESTCODELIST")
  //         .array.find((arrObj) => arrObj.type === "link")
  //       ? pageData.operation.container
  //           .find((conObj) => conObj.type === "REQUESTCODELIST")
  //           .array.find((arrObj) => arrObj.type === "link")
  //       : null
  //     : pageData.operation.container.find(
  //         (conObj) => conObj.type === "REQUESTCODELIST"
  //       ).array.type === "link"
  //     ? pageData.operation.container.find(
  //         (conObj) => conObj.type === "REQUESTCODELIST"
  //       ).array
  //     : null
  //   : null;

  //var fixeddata = { id: "DFD", value: "Level Migration Diagram" };
  var fixeddata = [
    { id: "EntList", value: "Entities" },
    { id: "PgmList", value: "Program" },
  ];

  /* Set sidebar header redux state  */
  // dispatch({
  //   type: "SET_SIDEBAR_HEADER",
  //   payload: data ? data.value : null,
  // });

  // /* Set sidebar links redux state  */
  // dispatch({
  //   type: "SET_SIDEBAR_LINKS",
  //   payload: data ? data.item : null,
  // });

  // dispatch({
  //   type: "SET_SIDEBAR_DFDLINK",
  //   payload: fixeddata,
  // });

  dispatch({
    type: "SET_SIDEBAR_FIXEDLINK",
    payload: fixeddata,
  });
};
