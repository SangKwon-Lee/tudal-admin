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
import useSettings from '../../../hooks/useSettings';
import ChevronRightIcon from '../../../icons/ChevronRight';
import PopUpCreateContainer from 'src/components/dashboard/popup/PopUpCreate.Container';

const PopUpCreatePage: FC = () => {
  const { settings } = useSettings();
  return (
    <>
      <Helmet>
        <title>Dashboard: PopUp Edit | TUDAL Admin</title>
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
                팝업 수정
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
                  팝업
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  팝업 수정
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <PopUpCreateContainer mode={'edit'} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PopUpCreatePage;
