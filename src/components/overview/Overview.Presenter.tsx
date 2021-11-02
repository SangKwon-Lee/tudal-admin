import React from 'react';
import useAuth from 'src/hooks/useAuth';
import { INews } from 'src/types/news';
import { Schedule } from 'src/types/schedule';
import { Grid, Typography } from '@material-ui/core';
import OverviewNewsTable from '../dashboard/overview/OverviewNewsTable';
import OverviewScheduleTable from '../dashboard/overview/OverviewScheduleTable';

interface OverviewPresenterProps {
  newsList: INews[];
  scheduleList: Schedule[];
}

const OverviewPresenter: React.FC<OverviewPresenterProps> = ({
  newsList,
  scheduleList,
}) => {
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
          <Typography color="textSecondary" variant="overline">
            Overview
          </Typography>
          <Typography color="textPrimary" variant="h5">
            반갑습니다, {user.username} 님
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            Here&apos;s what&apos;s happening today
          </Typography>
        </Grid>
      </Grid>
      <Grid item md={7} xs={12}>
        <OverviewScheduleTable scheduleList={scheduleList} />
      </Grid>{' '}
      <Grid item md={5} xs={12}>
        <OverviewNewsTable newsList={newsList} />
      </Grid>
    </Grid>
  );
};

export default OverviewPresenter;
