import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardActions } from "@material-ui/core";

import ProgramDetails from "./ProgramDetails";

function ProgramListType1Renderer(props) {
  const { classes } = props;

  console.log("inside Program renderer");
  return (
    <Grid item xs={12} lg={12}>
      <Card>
        <CardContent>
          <ProgramDetails {...props} />
        </CardContent>
        <CardActions>{/* Render actions if any */}</CardActions>
      </Card>
    </Grid>
  );
}

export default ProgramListType1Renderer;
