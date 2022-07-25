import type { FC } from 'react';
import { Box, Typography } from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
// import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
interface Props {
  masterNotice: any;
}

const MasterNoticeViewerPresenter: FC<Props> = (props) => {
  const { masterNotice } = props;

  return (
    <Box>
      {/* <Container maxWidth="md"> */}
      {/* <Typography variant="h4" sx={{ color: 'white' }}>
        {masterNotice.title}
      </Typography> */}
      {/* <Typography variant="h6" style={{ textAlign: 'right' }}>
          {masterNotice.title}
        </Typography> */}
      <Viewer
        theme="dark"
        initialValue={masterNotice.contents}
        // plugins={[colorSyntax]}
      />
      {/* </Container> */}
    </Box>
  );
};

export default MasterNoticeViewerPresenter;
