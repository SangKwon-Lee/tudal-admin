import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import CpMasterCreateContainer from 'src/components/dashboard/cp/CpMasterCreate.Container';
const CpMasterCreatePage: FC = () => {
  const { settings } = useSettings();

  return (
    <>
      <Helmet>
        <title>Dashboard: CP Master Create | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                CP 관리
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/masters"
                  variant="subtitle2"
                >
                  CP
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  달인 수정
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <CpMasterCreateContainer mode={'edit'} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CpMasterCreatePage;
