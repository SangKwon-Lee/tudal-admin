import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { INews } from 'src/types/news';
import axios from 'src/lib/axios';

import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';
import ChevronRightIcon from '../../icons/ChevronRight';
import useAsync from 'src/hooks/useAsync';

import useSettings from '../../hooks/useSettings';
import { News } from 'src/fixtures';
import gtm from '../../lib/gtm';
import { NewsListTable } from 'src/components/dashboard/news';

const NewsComments: React.FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Schedule List | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                뉴스 리스트
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  대시보드
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  컨텐츠관리
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  뉴스 코멘트
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          {/* <ScheduleForm reload={reload} /> */}
          <Box sx={{ mt: 3 }}>
            <NewsListTable newsList={News.list} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NewsComments;
