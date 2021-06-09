import { useCallback, useState, useEffect, useContext } from 'react';
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
  ReportMakerWizard,
} from '../../components/dashboard/report';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import type { Hiddenbox } from '../../types/hiddenbox';
import axios from '../../lib/axios';
import useSettings from '../../hooks/useSettings';
import { alpha } from '@material-ui/core/styles'
import SocketManager, { SocketContext } from "../../contexts/SocketContext";

const ReportMaker: FC = () => {
  const { settings } = useSettings();
  const { queryManager, connected, reconnect } = useContext(SocketContext);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Report Maker | TUDAL Admin</title>
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
                {'Report Maker'}
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
                  리포트 생성기
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ mt: 3 }}>
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
                <ReportMakerWizard />
            </Grid>
            </Grid>
            {/* {currentTab === 'invoices' && <HiddenboxInvoices />}
            {currentTab === 'logs' && <HiddenboxLogs />} */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReportMaker;
