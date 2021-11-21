import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@material-ui/core';
import OverviewContainer from 'src/components/overview/Overview.Container';
import useSettings from 'src/hooks/useSettings';

const Overview: FC = () => {
  const { settings } = useSettings();
  return (
    <>
      <Helmet>
        <title>Dashboard: Overview</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <OverviewContainer />
        </Container>
      </Box>
    </>
  );
};

export default Overview;
