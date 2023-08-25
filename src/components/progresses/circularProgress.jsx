import React from 'react';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

const MyCircularProgress = styled(CircularProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${CircularProgress.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${CircularProgress.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1C4D8C' : '#308fe8',
  },
}));

export default MyCircularProgress;
