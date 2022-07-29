import {
  Box,
  Card,
  Button,
  TextField,
  Typography,
  Grid,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { FC } from 'react';

export const Homescreen: FC = () => {
  const currentDate = dayjs(new Date()).format('YYYY-MM-DD');

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'full',
          height: 200,
        }}
      >
        <Typography variant="h2" sx={{ mt: 2 }}>
          Welcome
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'full',
          height: 200,
        }}
      >
        <Typography sx={{ fontSize: '30px' }}>
          {currentDate}
        </Typography>
      </Box>
    </>
  );
};

export default Homescreen;
