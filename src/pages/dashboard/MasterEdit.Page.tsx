import { useEffect } from 'react';
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
import gtm from '../../lib/gtm';
import MasterCreateWizardContainer from 'src/components/dashboard/master/MasterCreateWizard.Container';

const MasterEditPage: FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Master Create | TUDAL Admin</title>
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
                피드 수정
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
                <Typography color="textSecondary" variant="subtitle2">
                  피드
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <MasterCreateWizardContainer mode={'edit'} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MasterEditPage;
