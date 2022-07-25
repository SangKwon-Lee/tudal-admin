import type { FC } from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

interface Props {
  masterNotice: any;
}

const MasterNoticeViewerPresenter: FC<Props> = (props) => {
  const { masterNotice } = props;

  return (
    <Box sx={{ backgroundColor: 'white' }}>
      {/* <Container maxWidth="md"> */}
      <Typography variant="h3">{masterNotice.title}</Typography>
      {/* <Typography variant="h6" style={{ textAlign: 'right' }}>
          {masterNotice.title}
        </Typography> */}
      <Viewer
        initialValue={masterNotice.contents}
        // plugins={[colorSyntax]}
      />
      {/* </Container> */}
    </Box>
  );
};

export default MasterNoticeViewerPresenter;
