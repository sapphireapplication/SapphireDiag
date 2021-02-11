export const setNavListData = (label, id, controlstring) => async (
  dispatch,
  getState,
  res
) => {
  console.log("inside action navlist", label, controlstring);
  console.log(
    "show getstatecontent===",
    getState().fetchNavListDataReducer.NavListData
  );
  var temp = getState().fetchNavListDataReducer.NavListData;
  if (controlstring === "LeftBar") temp.splice(0, temp.length);
  else if (controlstring.substr(0, 7) === "BrdCrmb") {
    console.log("yahan aaya", parseInt(controlstring.substr(7, 1)));
    temp.splice(parseInt(controlstring.substr(7, 1)), temp.length);
  } else if (controlstring === "LBContext") temp.splice(1, temp.length);
  temp.push({ id: id, label: label });
  console.log("second value===", temp);

  dispatch({
    type: "FETCH_NAVLIST",
    payload: temp,
  });
  //res.send({ status: "OK" });
};
