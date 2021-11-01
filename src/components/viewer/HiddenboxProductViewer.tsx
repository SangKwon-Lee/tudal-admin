import type { FC } from 'react';
import { Box, Typography, Container } from '@material-ui/core';

import type { Hiddenbox } from '../../types/hiddenbox';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
//import 'tui-color-picker/dist/tui-color-picker.css';
//import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
//import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import './customViewer.css';

interface Props {
  hiddenbox: Hiddenbox;
}

const HiddenboxProductViewer: FC<Props> = (props) => {
  const { hiddenbox } = props;

  return (
    <Box sx={{ py: 3, backgroundColor: 'white' }}>
      <Container maxWidth="md">
        <Typography variant="h3">{hiddenbox.title}</Typography>
        <Typography variant="h6" style={{ textAlign: 'right' }}>
          {hiddenbox.author.nickname}
        </Typography>
        <Viewer
          initialValue={hiddenbox.contents}
          //plugins={[colorSyntax]}
        />
      </Container>
    </Box>
  );
};

export default HiddenboxProductViewer;
