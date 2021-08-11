import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { INews } from 'src/types/news';
import axios from 'src/lib/axios';
import * as _ from 'lodash';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import ChevronRightIcon from '../../icons/ChevronRight';
import useAsync from 'src/hooks/useAsync';

import useSettings from '../../hooks/useSettings';
import { FixtureNews } from 'src/fixtures';
import gtm from '../../lib/gtm';
import { NewsListTable } from 'src/components/dashboard/news';
import { APINews } from 'src/lib/api';
import GroupedList11 from 'src/components/widgets/grouped-lists/GroupedList11';

const News: React.FC = () => {
  const { settings } = useSettings();
  const [search, setSearch] = useState<string>('');
  const [newsState, refetchNews] = useAsync<INews[]>(
    () => APINews.getList(search),
    [search],
    [],
  );

  const handleSearch = _.debounce(setSearch, 300);
  const reload = useCallback(() => refetchNews(), [refetchNews]);

  const {
    data: newsList,
    error: newsError,
    loading: newsLoading,
  } = newsState;

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
          <Box sx={{ mt: 3 }}>
            <NewsListTable
              newsList={newsList}
              search={search}
              setSearch={handleSearch}
              reload={reload}
              isLoading={newsLoading}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default News;
