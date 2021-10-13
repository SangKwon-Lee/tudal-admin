import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import ChevronRightIcon from 'src/icons/ChevronRight';
import { Link as RouterLink } from 'react-router-dom';

interface IPageLayoutProps {
  mainTopic: string;
  pageTitle: string;
  pageTopRef?: React.RefObject<HTMLDivElement>;
}

const PageLayout: React.FC<IPageLayoutProps> = (props) => {
  const { mainTopic, pageTitle, pageTopRef } = props;
  const { settings } = useSettings();

  return (
    <>
      <Helmet>
        <title>{pageTitle}| TUDAL Admin</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
        ref={pageTopRef}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                {pageTitle}
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
                <Typography color="textSecondary" variant="subtitle2">
                  {mainTopic}
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          {props.children}
        </Container>
      </Box>
    </>
  );
};

export default PageLayout;
