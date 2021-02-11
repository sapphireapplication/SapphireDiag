import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Typography } from '@material-ui/core';
import {setSessionInfo} from '../actions/SessionInfoActions';

const mapStateToProps = (state) => {
  return {
  }
}

function Footer(props) {
  const {classes} = props;

  useEffect(() => {
  }, [])

  /* For future use: Currently we are not rendering anything in footer. */
  return null;
}

export default connect(mapStateToProps, {setSessionInfo})(Footer);