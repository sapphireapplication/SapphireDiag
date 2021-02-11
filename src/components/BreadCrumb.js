import React from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { connect } from "react-redux";
const mapStateToProps = (state) => {
  return {
    currentstate: state,
  };
};

function BreadCrumb(props) {
  const { classes } = props;

  function handleClick(e, item, pos) {
    event.preventDefault();
    console.log("you clicked===", props, pos, item);
    var foritem = [];
    if (item.id.substr(3, 1) == "1") {
      var yy = props.ForEntity.length - (props.NavListData.length - pos);
      props.ForEntity.map((x, idx) => {
        if (idx < yy) foritem.push(x);
      });
    } else {
      var yy = props.ForProgram.length - (props.NavListData.length - pos);
      console.log("yy=", yy);
      props.ForProgram.map((x, idx) => {
        if (idx < yy) foritem.push(x);
      });
    }
    console.log("show foritem==", foritem);
    // var ctrlstr = "BrdCrmb" + pos;
    props.linkClickHandler(
      e,
      item.id,
      foritem,
      item.label,
      "BrdCrmb" + (pos - 1)
    );
  }
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
    >
      {props.NavListData.length
        ? props.NavListData.map((nav, idx) =>
            idx < props.NavListData.length - 1 && nav.id != "Reseller login" ? (
              <Link
                color="inherit"
                href="/"
                onClick={(e) => {
                  handleClick(e, nav, idx + 1);
                }}
                key={nav.id}
                id={nav.id}
              >
                {nav.label}
              </Link>
            ) : (
              <Typography color="textPrimary" key={nav.id} id={nav.id}>
                {nav.label}
              </Typography>
            )
          )
        : ""}
    </Breadcrumbs>
  );
}

export default connect(mapStateToProps, {})(BreadCrumb);
