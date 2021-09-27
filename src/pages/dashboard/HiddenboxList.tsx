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
  Typography,
} from '@material-ui/core';
import { HiddenboxListTable } from '../../components/dashboard/hiddenbox';
import ChevronRightIcon from '../../icons/ChevronRight';
import PlusIcon from '../../icons/Plus';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import type { Hiddenbox } from '../../types/hiddenbox';
import axios from '../../lib/axios';
import useMounted from 'src/hooks/useMounted';
import useAuth from 'src/hooks/useAuth';

const HiddenboxList: FC = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [hiddenboxes, setHiddenboxes] = useState<Hiddenbox[]>([]);
  const mounted = useMounted();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getHiddenboxes = useCallback(
    async (reload = false) => {
      try {
        const response = await axios.get<Hiddenbox[]>(
          `/hiddenboxes?isDeleted=0&_sort=created_at:DESC`,
        );
        console.log(response.data);
        if (mounted || reload) {
          setHiddenboxes(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [mounted],
  );

  useEffect(() => {
    getHiddenboxes();
  }, [getHiddenboxes]);

  const reload = () => {
    getHiddenboxes();
  };

  return (
    <>
      <Helmet>
        <title>Dashboard: Hiddenbox List | TUDAL Admin</title>
      </Helmet>
      {user.role.hiddenbox ? (
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 8,
          }}
        >
          <Container maxWidth={settings.compact ? 'xl' : false}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography color="textPrimary" variant="h5">
                  히든박스 리스트
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
                    컨텐츠
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
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography> 히든박스 권한이 없습니다.</Typography>
          <Typography>
            히든박스 권한을 등록하시려면 관리자에게 문의해주세요.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default HiddenboxList;
