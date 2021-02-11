export const setForEntity = (param) => async (dispatch) => {
  console.log("inside action fetch", param);

  dispatch({
    type: "FETCH_FORENTITY",
    payload: param,
  });
};
