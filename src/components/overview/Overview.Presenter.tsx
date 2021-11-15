import React from 'react';
import useAuth from 'src/hooks/useAuth';
import { Box, Grid, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
interface IOverviewProps {
  time: string;
}

const OverviewPresenter: React.FC<IOverviewProps> = ({ time }) => {
  const { user } = useAuth();

  return (
    <Grid container spacing={3}>
      <Grid
        alignItems="center"
        container
        justifyContent="space-between"
        spacing={3}
        item
        xs={12}
      >
        <Grid item>
          <Typography color="textPrimary" variant="h5">
            반갑습니다, {user.username} 님
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            Here&apos;s what&apos;s happening today
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography fontSize={150}>
          {dayjs().format('HH:mm')}
        </Typography>
        <Typography fontSize={40} sx={{ mt: -4 }}>
          Good Day, {user.username}
        </Typography>
      </Box>
    </Grid>
  );
};

export default OverviewPresenter;
