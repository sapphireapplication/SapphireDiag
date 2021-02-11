// import React from "react";
// import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
// import Popover from "@material-ui/core/Popover";
// import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";

// const useStyles = makeStyles(() =>
//   createStyles({
//     typography: {
//       padding: theme.spacing(2),
//     },
//   })
// );

// export default function DfdLabel() {
//   const classes = useStyles();
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;

//   return (
//     <div>
//       <Button
//         aria-describedby={id}
//         variant="contained"
//         color="primary"
//         onClick={handleClick}
//       >
//         Open Popover
//       </Button>
//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "center",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "center",
//         }}
//       >
//         <Typography className={classes.typography}>
//           The content of the Popover.
//         </Typography>
//       </Popover>
//     </div>
//   );
// }

// <DisplayModal
// show={this.state.modal}
// handleClose={(e) => this.modalClose(e)}
// >
// <div
//   style={{
//     backgroundColor: "#f5f5f5",
//     color: "black",
//     //borderBottom: "grey solid",
//   }}
// >
//   hello world
// </div>
// </DisplayModal>

import React from "react";

const DisplayModal = ({ handleClose, show, children, lblboundary }) => {
  const showHideClassName = show
    ? { backgroundColor: "rgb(0,0,0,.5)", display: "block" }
    : { backgroundColor: "rgb(0,0,0,.5)", display: "none" };

  const mystyle = {
    //color: "#0088ce",
    borderTop: "double",
    borderBottom: "double",
    position: "fixed",
    width: "200px",
    height: "40px",
    backgroundColor: "lightblue",
    left: "180px",
    top: "483px",
    zIndex: "2000",
  };
  console.log("lbl==", lblboundary);
  return (
    <div className="modal" style={showHideClassName}>
      <div style={mystyle}>{children}</div>
    </div>
  );
};

export default DisplayModal;
