import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardActions } from "@material-ui/core";
//import { ExtractLevelNLink } from "../actions/datafordfd.js"; //by seema
//import DFDDiag from "./DFDDiagram";
//import { DragHandleRounded } from "@material-ui/icons";
import EntityList from "./EntityList";

function EntityListType1Renderer(props) {
  const { classes } = props;
  //const [DFDData, setData] = useState(ExtractLevelNLink(props.gridList));

  // useEffect(() => {
  //   console.log("DFDData===");
  // });
  console.log("inside entity renderer");
  return (
    <Grid item xs={12} lg={12}>
      <Card>
        <CardContent>
          <EntityList {...props} />
        </CardContent>
        <CardActions>{/* Render actions if any */}</CardActions>
      </Card>
    </Grid>
  );
}

export default EntityListType1Renderer;
