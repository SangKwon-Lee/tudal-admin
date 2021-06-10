import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Link,
  Typography
} from '@material-ui/core';
import { HiddenboxListTable } from '../../components/dashboard/hiddenbox';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import PlusIcon from '../../icons/Plus';
import UploadIcon from '../../icons/Upload';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import type { Hiddenbox } from '../../types/hiddenbox';
import axios from '../../lib/axios';

const HiddenboxList: FC = () => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [hiddenboxes, setHiddenboxes] = useState<Hiddenbox[]>([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getHiddenboxes = useCallback(async (reload=false) => {
    console.log("isMountedRef", isMountedRef.current)
    try {
      const response = await axios.get<Hiddenbox[]>(`/hiddenboxes?isDeleted=0&_sort=created_at:DESC`);
      console.log(response.data)
      if (isMountedRef.current || reload) {
        setHiddenboxes(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    console.log("useEffect, getHiddenboxes")
    getHiddenboxes();
  }, [getHiddenboxes]);

  const reload = () => {
    getHiddenboxes();
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Hiddenbox List | TUDAL Admin</title>
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
                Hiddenbox List
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
                  startIcon={<PlusIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="contained"
                  component={RouterLink}
                  to="/dashboard/hiddenboxes/new"
                >
                  히든박스 추가
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <HiddenboxListTable
              hiddenboxes={hiddenboxes}
              reload={reload}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HiddenboxList;
