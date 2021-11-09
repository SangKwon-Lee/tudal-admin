import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useSettings from '../../hooks/useSettings';
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Grid,
  Typography,
} from '@material-ui/core';
import ChevronRightIcon from '../../icons/ChevronRight';
import CpListContainer from 'src/components/dashboard/cp/CpList.Container';

const CpListPage: FC = () => {
  const { settings } = useSettings();

  return (
    <>
      <Helmet>
        <title>Dashboard: CP List | TUDAL Admin</title>
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
                CP 리스트
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/hiddenboxes"
                  variant="subtitle2"
                >
                  CP
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  CP 리스트
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}></Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <CpListContainer />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CpListPage;
