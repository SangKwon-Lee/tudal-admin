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

import ChevronRightIcon from '../../icons/ChevronRight';
import useSettings from '../../hooks/useSettings';
import PopupListContainer from 'src/components/dashboard/popup/PopUpList.Container';

const HiddenboxList: FC = () => {
  const { settings } = useSettings();

  return (
    <>
      <Helmet>
        <title>팝업 리스트 페이지</title>
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
                팝업 리스트
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
                  컨텐츠
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  팝업
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <PopupListContainer />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HiddenboxList;
