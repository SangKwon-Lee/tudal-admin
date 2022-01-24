import { FC } from 'react';

import { Box, Container, Typography } from '@material-ui/core';
import './HiddenReportViewer.css';
import { Viewer } from '@toast-ui/react-editor';

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
    <Box sx={{ py: 3, backgroundColor: 'white', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Typography variant="h3">{title}</Typography>
        <Typography variant="h6" style={{ textAlign: 'right' }}>
          {nickname}
        </Typography>
        {contents && <Viewer initialValue={contents} />}
      </Container>
    </Box>
  );
};

export default HiddenreportViewerPresenter;
