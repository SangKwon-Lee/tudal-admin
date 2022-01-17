import type { FC } from 'react';
import { Box, Container } from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import './customViewer.css';
import { IMaster } from 'src/types/master';

interface Props {
  master: IMaster;
}

const MasterIntroViewer: FC<Props> = (props) => {
  const { master } = props;

  return (
    <Box sx={{ py: 3, backgroundColor: 'white' }}>
      <Container maxWidth="md">
        <Viewer
          initialValue={master.intro}
          //plugins={[colorSyntax]}
        />
      </Container>
    </Box>
  );
};

export default MasterIntroViewer;
