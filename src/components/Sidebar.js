import React, { useEffect } from "react";
import Links from "./Links";
import { makeStyles } from "@material-ui/core/styles";
//import CardComponent from "./CardComponent";
import { connect } from "react-redux";
import { Drawer, Box, IconButton } from "@material-ui/core";
import { setSidebarData } from "../actions/SidebarActions";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const mapStateToProps = (state) => {
  return {
    header: state.sidebarReducer.header,
    links: state.sidebarReducer.links,
    fixedlinks: state.sidebarReducer.fixedlinks,
  };
};

function Sidebar(props) {
  const { classes } = props;
  //const classes1 = useStyles();
  const [alignment, setAlignment] = React.useState("");

  const handleAlignment = (event, newAlignment) => {
    console.log("newAlignment=====", newAlignment);
    setAlignment(newAlignment);
  };
  //const [sideTab, setsideTab] = React.useState("Entities");
  const handleClick = (e, control) => {
    if (control === "EntList") {
      props.linkClickHandler(e, "EntList", "", "Entities Details", "LeftBar");
      // setsideTab("Entities");
      props.setsideTab("Entities");
    } else {
      props.linkClickHandler(e, "PgmList", "", "Program Details", "LeftBar");
      // setsideTab("Programs");
      props.setsideTab("Programs");
    }
  };
  /* Update the sidebar data as soon as the new page is read */
  useEffect(() => {
    props.setSidebarData();
  }, []);

  console.log("props in side bar==", props);

  /* Rendering sidebar component */
  return (
    <div id="sidebar">
      <Drawer variant="persistent" open={props.open}>
        {/* To leave space on top to prevent overlapping with Topbar */}
        <div className={classes.toolbar} />

        {/* Icon to close the sidebar drawer */}
        <div className={classes.drawerHeader}>
          <IconButton onClick={props.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
{/*      
        <div>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="Choose Type"
          >
            {props.fixedlinks === null
              ? ""
              : props.fixedlinks.map((link) => (
                  <ToggleButton
                    id={link.id}
                    value={link.value}
                    aria-label={link.value}
                    onClick={(e) => handleClick(e, link.id)}
                  >
                    {link.value}
                  </ToggleButton>
                ))}
          </ToggleButtonGroup>
              </div> */}

        {/* Container for the sidebar components */}
        <Box id="box1" className={classes.drawerContainer}>
          {/* Container for Links */}
          <Box id="box2">
            <Links
              subHeader={props.header}
              //sideTab={sideTab}
              //setsideTab={setsideTab}

              {...props}
            />
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}

export default connect(mapStateToProps, { setSidebarData })(Sidebar);
