import apis from "../apis/index";

export const setTopbarData = () => async (dispatch) => {
  // const response = await apis.get('/getPage/page-schema-mdlicense-base-template/topbar.json')

  dispatch({
    type: "SET_TOPBAR_DATA",
    // payload: JSON.parse(response.data.content)
  });

  dispatch({
    type: "SET_TOPBAR_TITLE_INFO",
    // payload: JSON.parse(response.data.content).frames[0].items.find((item) => item.type === 'title')
  });

  dispatch({
    type: "SET_TOPBAR_SUBTITLE_INFO",
    // payload: JSON.parse(response.data.content).frames[0].items.find((item) => item.type === 'subtitle')
  });

  dispatch({
    type: "SET_TOPBAR_NOTIFICATION_INFO",
    // payload: JSON.parse(response.data.content).frames[0].items.find((item) => item.type === 'notification')
  });

  dispatch({
    type: "SET_TOPBAR_ACCOUNT_INFO",
    // payload: JSON.parse(response.data.content).frames[0].items.find((item) => item.type === 'accountInfo')
  });
  dispatch({
    type: "DFD_DATA",
  });
  
};

export const  setAuthDetails=(authDetails)=>async (dispatch)=>{
  dispatch({
    
    type: 'SET_TOPBAR_AUTH_DETAILS',
    payload: authDetails,
  })
}