import { FC, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import useAuth from 'src/hooks/useAuth';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Grid,
  Typography,
} from '@material-ui/core';
import ChevronRightIcon from '../../icons/ChevronRight';
import PlusIcon from '../../icons/Plus';
import ExpertListTable from '../../components/dashboard/expert/ExpertListTable';
import useMounted from 'src/hooks/useMounted';
import { APIExpert } from 'src/lib/api';

const ExpertsList: FC = () => {
  const { settings } = useSettings();
  const [experts, setExperts] = useState([]);
  const { user } = useAuth();
  const mounted = useMounted();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getExperts = useCallback(
    async (reload = false) => {
      try {
        const response = await APIExpert.getList();
        console.log(response.data);
        if (mounted || reload) {
          setExperts(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [mounted],
  );

  useEffect(() => {
    getExperts();
  }, [getExperts]);

  const reload = () => {
    getExperts();
  };

  return (
    <>
      <Helmet>
        <title>Dashboard: Experts List | TUDAL Admin</title>
      </Helmet>
      {/* {user.role.expert ? ( */}
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
                달인 리스트
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
                <Typography color="textSecondary" variant="subtitle2">
                  달인
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
                  to="/dashboard/experts/new"
                >
                  달인 추가
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ExpertListTable experts={experts} reload={reload} />
          </Box>
        </Container>
      </Box>
      {/* ) : (
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
          <Typography> 달인 권한이 없습니다.</Typography>
          <Typography>
            달인 권한을 등록하시려면 관리자에게 문의해주세요.
          </Typography>
        </Box>
      )} */}
    </>
  );
};

export default ExpertsList;
