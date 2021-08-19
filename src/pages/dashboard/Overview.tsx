import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Typography } from '@material-ui/core';

import useSettings from '../../hooks/useSettings';

import gtm from '../../lib/gtm';

const Overview: FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Overview | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Typography color="textPrimary" variant="h5">
          대시보드 개발 중입니다.
        </Typography>
      </Box>
    </>
  );
};

export default Overview;
