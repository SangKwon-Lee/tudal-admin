import type { FC } from 'react';
import { Box, Container } from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

interface Props {
  masterNotice: any;
}

const MasterNoticeViewerPresenter: FC<Props> = (props) => {
  const { masterNotice } = props;
  return (
    <Box
      sx={{
        py: 3,
        backgroundColor: '#171C24',
      }}
    >
      <Container maxWidth="md">
        <Viewer initialValue={masterNotice.contents} theme={'dark'} />
      </Container>
    </Box>
  );
};

export default MasterNoticeViewerPresenter;
