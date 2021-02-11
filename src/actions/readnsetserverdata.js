import API_ADDRESS from "../../server/apiaddress";
import setEntityData from "./EntityDataActions";
import setNavListData from "./setNavListDataActions";
import fetchBaseTemplate from "./setscreenPositionAction";
export const readnsetserverdata = (id, param2, label, controlstr) => async (
  dispatch,
  getState
) => {
  var state = getState();
  console.log("inside action fetch", state);
  await setEntityData();
  await setNavListData(label, id, controlstr);
  await fetchBaseTemplate("RC0010");
};
