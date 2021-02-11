import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardActions } from "@material-ui/core";
import EntPgmFileList from "./EntPgmFileList";

function EntityListType2Renderer(props) {
  const { classes } = props;

  console.log("inside entity renderer");
  return (
    <Grid item xs={12} lg={12}>
      <Card>
        <CardContent>
          <EntPgmFileList {...props} />
        </CardContent>
        <CardActions>{/* Render actions if any */}</CardActions>
      </Card>
    </Grid>
  );
}

export default EntityListType2Renderer;
