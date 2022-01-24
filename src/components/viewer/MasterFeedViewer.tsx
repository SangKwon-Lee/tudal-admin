import type { FC } from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import './customViewer.css';
import { IMasterFeed } from 'src/types/master';

interface Props {
  feed: IMasterFeed;
}

const MasterFeedViewerPresenter: FC<Props> = (props) => {
  const { feed } = props;

  return (
    <Box sx={{ py: 3, backgroundColor: 'white' }}>
      <Container maxWidth="md">
        <Typography variant="h3">{feed.title}</Typography>
        <Typography variant="h6" style={{ textAlign: 'right' }}>
          {feed.master.nickname}
        </Typography>
        <Viewer
          initialValue={feed.description}
          //plugins={[colorSyntax]}
        />
      </Container>
    </Box>
  );
};

export default MasterFeedViewerPresenter;
