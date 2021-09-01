import API_ADDRESS from "../../server/apiaddress";
export const setDataUsageFileList = () => async (dispatch) => {
  console.log("inside data usage FILELIST data action");
  
  let qurl = `${SERVERADDR}/EntListDU/${DBNAME}`;
 // let response = [];
  await fetch(qurl,{credentials: 'omit'})
    .then((res) => res.json())
    .then((json) => {
      console.log("show  ENT filedata===", json);
      //response = json;
      dispatch({
        type: "FETCH_DATA_USAGE_FILES",
        payload: json.response.files,
        entrels: json.response.entrels     
      });
    });
};

