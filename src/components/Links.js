import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import ContextMenu from "./ContextMenu";

const initialState = {
  mouseX: null,
  mouseY: null,
  selItem: [],
  selItemText: [],
};

import TableRow from "@material-ui/core/TableRow";

export default function Links(props) {
  const { classes } = props;
  console.log("links===", props);

  // let showlist =
  //   props.sideTab === "Entities" ? props.entityList : props.programList;
  // let cols =
  //   props.sideTab === "Entities" ? ["ENTID", "ENTTX"] : ["PGMID", "PGMTX"];

  /////trying to implement the code menu too at side bar//////////////
  let showlist =
    props.sideTab === "Entities"
      ? props.entityList
      : props.sideTab === "Programs"
      ? props.programList
      : props.pgmCodeDetail;
  let cols =
    props.sideTab === "Entities"
      ? ["ENTID", "ENTTX"]
      : props.sideTab === "Programs"
      ? ["PGMID", "PGMTX"]
      : ["STNNUM", "STN"];

  /////trying to implement the code menu too at side bar//////////////

  const [state, setState] = React.useState(initialState);
  const [page, setPage] = React.useState(0);
  const [activeIndex, setactiveIndex] = React.useState(-1);
  //const [anchorEl, setAnchorEl] = React.useState({ show: false, text: "" });
  //const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const initialisePage = () => {
    setPage(0);
  };

  function handleClick(event, item) {
    event.preventDefault();
    console.log("key value===", item);

    if (props.sideTab=='Programs')
    props.linkClickHandler(event, "but27", item, "Data Usage", "LBContext");
    else
    props.linkClickHandler(event, "but31", item, "Source Browser", "LBContext");

    // props.linkClickHandler(
    //   event,
    //   "but26",
    //   item,
    //   "Data Usage",
    //   "LBContext",
    //   makeSubList(item[0].idx)
    // );

    setactiveIndex(item[0].idx);
    console.log("currenttarget==", item[0].text);
  }

  function handleRightClick(event, item) {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      selItem: item,
    });
    setactiveIndex(item[0].idx);
   // console.log('handleRightClick activeindex ',item[0].idx)
  }

  const handleClose = () => {
    setState(initialState);
  };

  console.log("showlist===", showlist);
  var astyle = {
    borderTop: "black double",
    borderBottom: "black double",
    backgroundColor: "lightblue",
  };
  var dstyle = {
    borderTop: "0px",
    borderBottom: "0px",
    backgrounColor: "lightgray",
  };
  /* Rendering sidebar links */
  return (
    <div>
      <List component="nav" aria-labelledby="Links">
        {showlist.map((link, ind) => (
          <ListItem
            button
            //key={link[cols[0]]}
            id={link[cols[0]]}
            className={classes.removeBorder}
            style={ind === activeIndex ? astyle : dstyle}
            onContextMenu={(e) => {
              let newarray = [];

              props.leftpaneDetail.keyfield.map((item, idx) =>
                newarray.push({
                  field: item,
                  value: link[item],
                  text: link[props.leftpaneDetail.keytext[idx]],
                  idx: ind,
                })
              );
              //console.log("array dikhao====", newarray);
              handleRightClick(e, newarray);
            }}
            onClick={(e) => {
              let newarray = [];
              if (props.sideTab === "Programs" || props.sideTab==='CodeList') {
                //Data usage diagrams works for programs only
                props.leftpaneDetail.keyfield.map((item, idx) =>
                  newarray.push({
                    field: item,
                    value: link[item],
                    text: link[props.leftpaneDetail.keytext[idx]],
                    code: link[props.leftpaneDetail.keyfield[idx]],
                    idx: ind,
                  })
                );
                handleClick(e, newarray);
              }
            }}
          >
            <ListItemText
              primary={
                link[cols[1]] === ""
                  ? "(" + link[cols[0]] + ")"
                  : link[cols[1]] + "(" + link[cols[0]] + ")"
              }
              className={(classes.sidebarMenu, classes.fontSizeSmall)}
            />
          </ListItem>
        ))}
      </List>

      <ContextMenu
        contents={props.leftpaneDetail}
        state={state}
        handleClose={handleClose}
        initialisePage={initialisePage}
        ContextPos={"LBContext"}
        {...props}
      />
    </div>
  );
}
