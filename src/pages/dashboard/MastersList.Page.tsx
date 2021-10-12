import { FC, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
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
import MasterListTableContainer from '../../components/dashboard/master/MasterListTable.Container';
// import useAuth from 'src/hooks/useAuth';

const MastersListPage: FC = () => {
  const { settings } = useSettings();
  // const { user } = useAuth();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Masters List | TUDAL Admin</title>
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
                  to="/dashboard/master/new"
                >
                  달인 추가
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <MasterListTableContainer />
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

export default MastersListPage;
