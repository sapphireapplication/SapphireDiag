import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function ContextMenu(props) {
  const { classes } = props;
  console.log("inside context menu==", props);
  return props.contents.contextmenu === true ? (
    <Menu
      keepMounted
      open={props.state.mouseY !== null}
      onClose={props.handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        props.state.mouseY !== null && props.state.mouseX !== null
          ? { top: props.state.mouseY, left: props.state.mouseX }
          : undefined
      }
    >
      <MenuItem
        onClick={props.handleClose}
        className={classes.flexEnd}
        //style={{ justifyContent: "flex-end" }}
      >
        x
      </MenuItem>
      {props.contents.contextmenucontent.map((obj) => {
        return (
          <MenuItem
            key={obj.button}
            onClick={(e) => {
              props.handleClose(e);
              props.initialisePage(e);
              props.linkClickHandler(
                e,
                obj.button,
                props.state.selItem,
                obj.label,
                props.ContextPos
              );
            }}
          >
            {obj.label}
          </MenuItem>
        );
      })}
    </Menu>
  ) : null;
}
