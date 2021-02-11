import { createMuiTheme } from "@material-ui/core/styles";

const muiBaseTheme = createMuiTheme();
export const drawerWidth = 250;

export const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      root: {
        position: "fixed",
        zIndex: muiBaseTheme.zIndex.drawer + 1,
      },
      colorPrimary: {
        backgroundColor: "#072f67",
      },
    },
    MuiDrawer: {
      root: {
        width: drawerWidth,
        flexShrink: 0,
      },
      paper: {
        width: drawerWidth,
        backgroundColor: "#D2D4D5",
      },
    },
    MuiToolbar: {
      root: {
        display: "flex",
        alignItems: "center",
        padding: muiBaseTheme.spacing(0, 1),
        ...muiBaseTheme.mixins.toolbar,
      },
    },
    MuiTextField: {
      root: {},
    },
    MuiFormControl: {
      root: {
        margin: muiBaseTheme.spacing(1),
        width: "100%",
      },
    },
    MuiSelect: {
      root: {},
    },
    MuiOutlinedInput: {
      inputMarginDense: {
        paddingTop: "10.5px",
        paddingBottom: "10.5px",
      },
      input: {
        paddingTop: "10.5px",
        paddingBottom: "10.5px",
      },
    },
    MuiInputBase: {
      input: {
        paddingTop: "10.5px",
        paddingBottom: "10.5px",
      },
    },
    MuiInputLabel: {
      outlined: {
        transform: "translate(14px, 12px) scale(1)",
      },
      marginDense: {
        transform: "translate(14px, 12px) scale(1)",
      },
    },
    MuiTypography: {
      body1: {
        fontSize: "0.9rem",
        lineHeight: "1",
      },
      h6: {
        //added by seema
        fontSize: "1.5rem",
        fontWeight: "600",
      },
    },
    MuiButton: {
      root: {
        padding: "3px 10px",
      },
      contained: {
        // margin: muiBaseTheme.spacing(1),
        fontWeight: "bold",
      },
      containedPrimary: {
        backgroundColor: "#072f67",
      },
    },
    MuiIconButton: {
      root: {
        padding: "5px",
      },
    },
    MuiTableContainer: {
      root: {
        // marginLeft: muiBaseTheme.spacing(1),
        marginLeft: "0px",
      },
    },
    MuiTable: {
      root: {
        // marginTop: muiBaseTheme.spacing(1),
      },
    },
    MuiTableCell: {
      head: {
        backgroundColor: "#072f67",
        fontWeight: "bold",
        color: "#fff",
        height: "40px",
        // textAlign: 'center',
      },
      sizeSmall: {
        // padding: "5px 0px 5px 10px",
        padding: "0px 0px 0px 17px",
      },
      stickyHeader: {
        // top: 0,
        // left: 0,
        // zIndex: 2,
        position: "sticky",
        color: "black",
        // backgroundColor: "#fafafa",
        backgroundColor: "white",
        padding: "5px 0px 5px 17px",
      },

      body: {
        padding: "0px 0px 0px 0px",
        // textAlign: 'center'
      },
    },
    MuiAlert: {
      root: {
        marginTop: muiBaseTheme.spacing(1),
        padding: "0px 5px",
      },
    },
    MuiList: {
      // root: {
      //   border: "1px solid silver",
      // },
      subheader: {
        paddingTop: "0px",
      },
      padding: {
        paddingTop: "0px",
        paddingBottom: "0px",
      },
    },
    MuiMenuItem: {
      root: {
        lineHeight: "1",
        minHeight: "0px",
      },
    },
    MuiListSubheader: {
      root: {
        fontSize: "1rem",
        color: "#000",
      },
      gutters: {
        paddingLeft: "10px",
      },
    },
    MuiListItem: {
      root: {
        paddingTop: "4px",
        paddingBottom: "4px",
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: "0px",
        color: "#000",
        paddingRight: "8px",
      },
    },
    MuiBadge: {
      root: {
        margin: "10px",
      },
    },
    MuiPagination: {
      ul: {
        justifyContent: "center",
      },
    },
    MuiCard: {
      root: {
        boxShadow: "none",
      },
    },
    MuiCardContent: {
      root: {
        display: "flex",
        flexDirection: "column",
        padding: "0px",
        // paddingRight: "24px",
        paddingRight: "0px",
        "&:last-child": {
          // paddingBottom: "8px",
          paddingBottom: "12px",
        },
      },
    },
    MuiCardActions: {
      root: {
        justifyContent: "flex-end",
        padding: "8px",
        paddingRight: "16px",
        // float : 'right'
      },
    },

    MuiPaper: {
      rounded: {
        borderRadius: "0px",
      },
    },

    MuiTableRow: {
      root: {
        "&:nth-of-type(odd)": {
          //backgroundColor: muiBaseTheme.palette.action.hover,
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.08) !important",
        },

        // "&:selected, &:selected:hover": {
        //   backgroundColor: "purple",
        // },
      },
    },

    MuiToggleButtonGroup: {
      root: {
        marginLeft: "20px",
      },
    },
    MuiToggleButton: {
      root: {
        height: "30px",
        textTransform: "none",
        fontWeight: "600",
      },
    },
    MuiBox: {
      root: {
        direction: "rtl",
        fontWeight: "1000",
      },
    },
  },
});
