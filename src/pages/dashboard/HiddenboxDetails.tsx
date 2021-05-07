import { useCallback, useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
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
  Typography
} from '@material-ui/core';
import {
  HiddenboxProductDetails,
} from '../../components/dashboard/hiddenbox';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import type { Hiddenbox } from '../../types/hiddenbox';
import axios from '../../lib/axios';
import useSettings from '../../hooks/useSettings';

const tabs = [
  { label: '상품내용', value: 'details' },
  { label: '구매내역', value: 'payments' },
];

const HiddenboxDetails: FC = () => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [hiddenbox, setHiddenbox] = useState<Hiddenbox | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('details');
  const { hiddenboxId } = useParams();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getHiddenbox = useCallback(async () => {
    try {
      const response = await axios.get<Hiddenbox>(`/hiddenboxes/${hiddenboxId}`);
      console.log("[HiddenboxDetail", response.data);
      if (isMountedRef.current) {
        setHiddenbox(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getHiddenbox();
  }, [getHiddenbox]);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  if (!hiddenbox) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Hiddenbox Details | Material Kit Pro</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                {hiddenbox.title}
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
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  히든박스
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
                  to={`/dashboard/hiddenboxes/${hiddenboxId}/edit`}
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
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
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
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  lg={settings.compact ? 12 : 8}
                  md={12}
                  xl={settings.compact ? 12 : 8}
                  xs={12}
                >
                  <HiddenboxProductDetails hiddenbox={hiddenbox} />
                </Grid>
              </Grid>
            )}
            {/* {currentTab === 'invoices' && <HiddenboxInvoices />}
            {currentTab === 'logs' && <HiddenboxLogs />} */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HiddenboxDetails;
