import styled from '@emotion/styled';
import { InputAdornment, OutlinedInput } from '@mui/material';
import React from 'react';
import Iconify from './Iconify';

const SearchBar = () => {
  const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': { boxShadow: theme.customShadows.z8 },
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`,
    },
  }));

  return (
    <SearchStyle
      //   value={filterName}
      //   onChange={onFilterName}
      placeholder="Search books..."
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
        </InputAdornment>
      }
    />
  );
};

export default SearchBar;
