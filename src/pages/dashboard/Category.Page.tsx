import React, { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import {
  Box,
  Container,
  Breadcrumbs,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';

import useSettings from 'src/hooks/useSettings';
import { Toaster } from 'react-hot-toast';
import ChevronRightIcon from 'src/icons/ChevronRight';
import CategoryListContainer from 'src/components/dashboard/category/CategoryList.Container';

const CategoryPage: React.FC = () => {
  const { settings } = useSettings();
  const scrollRef = useRef(null);

  return (
    <>
      <Helmet>
        <title>Dashboard: Category List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container
          maxWidth={settings.compact ? 'xl' : false}
          ref={scrollRef}
        >
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                카테고리 리스트
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
                  카테고리
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <CategoryListContainer />
        </Container>
      </Box>
    </>
  );
};

export default CategoryPage;
