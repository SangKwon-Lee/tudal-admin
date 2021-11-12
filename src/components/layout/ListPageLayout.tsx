import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  Button,
} from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import ChevronRightIcon from 'src/icons/ChevronRight';
import PlusIcon from 'src/icons/Plus';
import { Link as RouterLink } from 'react-router-dom';

interface IPageLayoutProps {
  mainTopic: string;
  pageTitle: string;
  pageTopRef?: React.RefObject<HTMLDivElement>;
  hasCreateButton: boolean;
  buttonName?: string;
  buttonClickLink?: string;
}

/**
 *
 * @param props
 * mainTopic(string): 리스트 페이지 상단에 노출되는 페이지의 주제
 * pageTitle(string): 페이지 제목
 * pageTopRef(string): 페이지 상단에 위치한 React.Ref Obejct (주로 페이지 변경시 상단으로 스크롤 할 때 사용)
 * hasCreateButton(boolean): 페이지 우측 상단에 위치한 버튼의 유무
 * buttonName(string): 버튼의 이름
 * buttonClickLink(string): 해당 버튼클릭시 이동하는 URL
 *
 */
const PageLayout: React.FC<IPageLayoutProps> = (props) => {
  const {
    mainTopic,
    pageTitle,
    pageTopRef,
    hasCreateButton,
    buttonName,
    buttonClickLink,
  } = props;
  const { settings } = useSettings();

  return (
    <>
      <Helmet>
        <title>{pageTitle} | TUDAL Admin</title>
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
            {hasCreateButton && (
              <Grid item>
                <Box sx={{ m: -1 }}>
                  <Button
                    color="primary"
                    startIcon={<PlusIcon fontSize="small" />}
                    sx={{ m: 1 }}
                    variant="contained"
                    component={RouterLink}
                    to={buttonClickLink}
                  >
                    {buttonName}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
          {props.children}
        </Container>
      </Box>
    </>
  );
};

export default PageLayout;
