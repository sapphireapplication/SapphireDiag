import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardActions } from "@material-ui/core";

import SchemaDetail from "./SchemaDetail";

function SchemaDetailType1Renderer(props) {
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
          <SchemaDetail {...props} />
        </CardContent>
        <CardActions>{/* Render actions if any */}</CardActions>
      </Card>
    </Grid>
  );
}

export default SchemaDetailType1Renderer;
