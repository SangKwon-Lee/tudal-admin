import { FC, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Grid,
  Typography,
} from '@material-ui/core';
import ChevronRightIcon from '../../icons/ChevronRight';
import CouponIssuedListTableContainer from 'src/components/dashboard/coupon/CouponIssuedListTable.Container';
// import useAuth from 'src/hooks/useAuth';

const CouponIssuedListPage: FC = () => {
  const { settings } = useSettings();
  // const { user } = useAuth();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Coupon Issued List | TUDAL Admin</title>
      </Helmet>
      {/* {user.role.master ? ( */}
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
                발급된 쿠폰 리스트
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/coupons"
                  variant="subtitle2"
                >
                  회계
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  발급된 쿠폰 리스트
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}></Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <CouponIssuedListTableContainer />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CouponIssuedListPage;
