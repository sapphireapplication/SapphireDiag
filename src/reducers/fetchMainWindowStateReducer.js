const INITIAL_STATE = {
    mainWindowState: "",
  };
  
  export default (state = INITIAL_STATE, action) => {
    console.log("reducer window type==", action.payload);
    switch (action.type) {
      case "SET_MAINWINDOW_STATE":
        return {
          ...state,
          mainWindowState: action.payload,
        };
  
      default:
        return state;
    }
  };
  