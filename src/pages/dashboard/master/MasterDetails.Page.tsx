import type { FC } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Button } from '@material-ui/core';
import MasterDetailsContainer from 'src/components/dashboard/master/MasterDetails.Container';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';

const MasterDetailsPage: FC = () => {
  const { masterId } = useParams();
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Master Feed Details | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="달인"
        mainTopic={'피드 생성'}
        pageTitle={'피드 생성'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <Box sx={{ m: -1, display: 'flex', justifyContent: 'end' }}>
          <Button
            color="primary"
            component={RouterLink}
            sx={{ mb: 3 }}
            to={`/dashboard/master/${masterId}/edit`}
            variant="contained"
          >
            편집
          </Button>
        </Box>
        <MasterDetailsContainer />
      </PageLayout>
    </>
  );
};

export default MasterDetailsPage;
