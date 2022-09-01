import type { FC } from 'react';
import { Box, Container, useTheme } from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import { IMaster } from 'src/types/master';
import '@toast-ui/editor/dist/toastui-editor.css';

interface Props {
  master: IMaster;
}

const MasterIntroViewer: FC<Props> = (props) => {
  const { master } = props;
  const theme = useTheme();
  return (
    <Box
      sx={{ py: 3, backgroundColor: theme.palette.background.paper }}
    >
      <Container maxWidth="md">
        <Viewer
          initialValue={master.intro}
          theme={theme.palette.mode}
        />
      </Container>
    </Box>
  );
};

export default MasterIntroViewer;
