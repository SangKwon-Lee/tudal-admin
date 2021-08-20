import React, { useEffect } from 'react';
import { Box, Breadcrumbs, Container, Grid, Link, Typography, Dialog } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import ChevronRightIcon from 'src/icons/ChevronRight';
import useSettings from 'src/hooks/useSettings';
import useAuth from 'src/hooks/useAuth';

import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import { APIStock } from 'src/lib/api';
import { StockList, StockForm } from 'src/components/dashboard/stock';
import useAsync from 'src/hooks/useAsync';

const StockPage = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [{ data: stockList, loading: stockListLoading, error: stockError }] = useAsync<
    IStockDetailsWithTagCommentNews[]
  >(APIStock.getListDetails, [], []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Schedule List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        {false && <StockForm></StockForm>}
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                뉴스 리스트
              </Typography>
              <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />} sx={{ mt: 1 }}>
                <Link color="textPrimary" component={RouterLink} to="/dashboard" variant="subtitle2">
                  대시보드
                </Link>
                <Link color="textPrimary" component={RouterLink} to="/dashboard" variant="subtitle2">
                  컨텐츠관리
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  뉴스 코멘트
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <StockList list={stockList} loading={stockListLoading}></StockList>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StockPage;
