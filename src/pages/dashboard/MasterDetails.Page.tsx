import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import MasterDetailsContainer from '../../components/dashboard/master/MasterDetails.Container';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import useSettings from '../../hooks/useSettings';

const tabs = [{ label: '달인내용', value: 'details' }];

const MasterDetailsPage: FC = () => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState<string>('details');
  const { masterId } = useParams();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    setCurrentTab('details');
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Master Details | TUDAL Admin</title>
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
                달인 상세보기
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/master"
                  variant="subtitle2"
                >
                  달인
                </Link>

                <Typography color="textSecondary" variant="subtitle2">
                  상세보기
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  component={RouterLink}
                  startIcon={<PencilAltIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  to={`/dashboard/master/${masterId}/edit`}
                  variant="contained"
                >
                  편집
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Tabs
              indicatorColor="primary"
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs &&
                tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
            </Tabs>
          </Box>
          <Divider />
          <Box sx={{ mt: 3 }}>
            {currentTab === 'details' && (
              <Grid container spacing={3}>
                <Grid
                  item
                  lg={settings.compact ? 12 : 8}
                  md={12}
                  xl={settings.compact ? 12 : 8}
                  xs={12}
                >
                  <MasterDetailsContainer />
                </Grid>
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MasterDetailsPage;
