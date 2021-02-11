import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Maincontent from "./MainContent";
import Footer from "./Footer";

function PageRenderer(props) {
  const { classes } = props;
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  //console.log("inside Pagerenderer==", props);
  return (
    <div
      id={"license-application-" + props.currentScreen}
      className={classes.root}
    >
      <Topbar {...props} />
      {/* {props.diagramType === 'SOURCE_BROWSER_PGM' ?(
      // <Sidebar handleDrawerClose={handleDrawerClose} open={open} {...props} />): null}*/}
      <Maincontent handleDrawerOpen={handleDrawerOpen} open={open} {...props} />

      <Footer {...props} />
    </div>
  );
}

export default PageRenderer;
