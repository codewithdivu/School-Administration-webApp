import React from 'react';
import PropTypes from 'prop-types';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({ isLoading = false }) => (
  <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <CircularProgress color="primary" />
  </Backdrop>
);

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loader;
