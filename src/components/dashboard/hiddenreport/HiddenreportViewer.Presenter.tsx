import { FC } from 'react';

import { Box, Container, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet-async';
import './HiddenReportViewer.css';

interface IProps {
  title: string;
  nickname: string;
  contents: string;
}
const HiddenreportViewerPresenter: FC<IProps> = ({
  title,
  nickname,
  contents,
}) => {
  return (
    <>
      <Helmet>
        <title>Dashboard: Hiddenbox Viewer | TUDAL Admin</title>
      </Helmet>
      <Box sx={{ py: 3, backgroundColor: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h3">{title}</Typography>
          <Typography variant="h6" style={{ textAlign: 'right' }}>
            {nickname}
          </Typography>

          {contents && (
            <div
              className="viewer"
              dangerouslySetInnerHTML={{ __html: contents }}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default HiddenreportViewerPresenter;
