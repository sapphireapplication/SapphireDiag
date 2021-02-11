import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import ContextMenu from "./ContextMenu";
import { Typography } from "@material-ui/core";

const initialState = {
  mouseX: null,
  mouseY: null,
  selItem: [],
  selItemText: [],
};

// const useStyles = makeStyles({
//   root: {
//     width: "100%",
//   },
//   container: {
//     maxHeight: 500,
//   },
//   bgcolor: {
//     backgroundColor: "rgb(23 27 160 / 54%)",
//   },
// });

export default function DisplayTable(props) {
  const { classes } = props;
  //const classes1 = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  //var DataToRender = props.DataToBeRender;
  var DataToRender = props.dataToBeRendered;

  const [state, setState] = React.useState(initialState);

  function handleRightClick(event, item) {
    event.preventDefault();

    //let entity = props.screenDetail.keyfield === "PGMID" ? "Program" : "Entity";
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      selItem: item,
    });
  }

  const initialisePage = () => {
    setPage(0);
  };
  const handleClose = () => {
    setState(initialState);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  React.useEffect(() => {
    setPage(0);
  }, []);

  function displaycolumns(row) {
    return props.screenDetail.columns.map((column) => {
      const value = row[column.id];
      return (
        <TableCell
          key={column.id}
          align={column.align}
          // style={{ padding: "0px 0px 0px 5px" }}
        >
          {column.format && typeof value === "number"
            ? column.format(value)
            : value}
        </TableCell>
      );
    });
  }

  function subheading() {
    var pp = "";
    if (DataToRender.hasOwnProperty("ForItem")) {
      DataToRender.ForItem.map((o) => {
        var ppt =
          o.text === undefined || o.text === null ? "" : "(" + o.text + ")";
        pp = pp + o.value + ppt + "/  ";
      });
    } else pp = "/  ";
    console.log("pp==", pp);
    return pp.substr(0, pp.length - 3);
  }

  const heading = props.screenDetail.navigation;

  console.log("in table renderer===", props);
  return (
    <div>
      {/*<Paper className={classes.root}>*/}

      <div className={classes.caption}>
        <span className={classes.span}>
          {heading}
          {subheading()}
        </span>
      </div>
      {/*<TableContainer className={classes.container} component={Paper}>*/}
      {/* <Table stickyHeader aria-label="sticky table" style={{ width: "98%" }}>*/}
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {props.screenDetail.columns.map((column) => (
                <TableCell
                  // className={classes.bgcolor}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {DataToRender.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => {
                if (props.screenDetail.contextmenu === true) {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      // key={row[props.screenDetail.keyfield] + idx}
                      key={idx}
                      onContextMenu={(e) => {
                        let newarray = [];

                        props.screenDetail.keyfield.map((item, idx) =>
                          newarray.push({
                            field: item,
                            value: row[item],
                            text: row[props.screenDetail.keytext[idx]],
                          })
                        );
                        //console.log("array dikhao====", newarray);
                        handleRightClick(e, newarray);
                      }}
                      className={classes.cursorContext}
                    >
                      {displaycolumns(row)}
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                      {displaycolumns(row)}
                    </TableRow>
                  );
                }
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 25, 100]}
        component="div"
        count={DataToRender.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      <ContextMenu
        contents={props.screenDetail}
        state={state}
        handleClose={handleClose}
        initialisePage={initialisePage}
        ContextPos={"Context"}
        {...props}
      />
      {/* </Paper>*/}
    </div>
  );
}
//
