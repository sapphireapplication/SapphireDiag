const INITIAL_STATE = {
  topbarData: null,
  titleInfo: {
    id: "TITLE",
    value: "MIDRANGE DYNAMICS",
  },
  subTitleInfo: {
    id: "SUBTITLE",
    value: "providing innovative IBM i solutions",
  },
  //   DFDinfo: {
  //     id: "DFD",
  //     src: "/getdfd",
  //   },
  notificationInfo: {
    id: "NOTIFICATION",
    type: "notification",
    value: [
      {
        title: "Notification 1",
        content:
          "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
      },
      {
        title: "Notification 2",
        content:
          "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
      },
      {
        title: "Notification 3",
        content:
          "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.",
      },
    ],
  },
  accountInfo: {
    id: "ACCOUNTINFO",
    type: "account",
    value: [
      {
        title: "Profile Info",
        content: {
          Name: "MD Admin",
          email: "mdadmin@gmail.com",
          contact: "91-9876543210",
        },
      },
      {
        title: "Session Info",
      },
      {
        title: "Logoff",
      },
    ],
  },
  contactInfo: {
    header: "Contact",
    content:
      "Contact for Assistance\n\nIf you have any questions or concerns, please do not hesitate to contact us.\n\nVersion : LIC\nBuild     : 20180508",
  },
  authDetails:JSON.parse(localStorage.getItem('authDetails'))
};

export default (state = INITIAL_STATE, action) => {
  console.log("action.payload==", action.payload);
  switch (action.type) {
    case "SET_TOPBAR_DATA":
      return {
        ...state,
        topbarData: action.payload,
      };
    case "SET_TOPBAR_TITLE_INFO":
      return {
        ...state,
        titleInfo: action.payload,
      };
    case "SET_TOPBAR_SUBTITLE_INFO":
      return {
        ...state,
        subTitleInfo: action.payload,
      };
    case "SET_TOPBAR_NOTIFICATION_INFO":
      return {
        ...state,
        notificationInfo: action.payload,
      };
    case "SET_TOPBAR_ACCOUNT_INFO":
      return {
        ...state,
        accountInfo: action.payload,
      };
      case "SET_TOPBAR_AUTH_DETAILS":
        return{
          ...state,
          authDetails: action.payload,
        }
    default:
      return state;
  }
};
