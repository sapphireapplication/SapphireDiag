export const setMainWindowState = (param) => async (dispatch) => {
    
  
    console.log("inside setMainWindowState action==", param);
  
    dispatch({
      type: "SET_MAINWINDOW_STATE",
      payload: param,
    });
  };
  