import React, { useEffect } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export default function DialogRenderer(props) {
  const { classes } = props;

  return (
    /* Dialog box rendering for menu options click */
    <Dialog
      onClose={props.handleDialogClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
      maxWidth={"xs"}
      className={classes.contactCard}
    >
      <MuiDialogTitle disableTypography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={props.handleDialogClose}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>

      <DialogTitle
        id="customized-dialog-title"
        onClose={props.handleDialogClose}
      >
        {props.dialogTitle}
      </DialogTitle>

      <DialogContent dividers>
        <Typography gutterBottom>{props.dialogContent}</Typography>
      </DialogContent>
    </Dialog>
  );
}
