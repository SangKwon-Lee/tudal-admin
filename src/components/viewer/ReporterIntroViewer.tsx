import type { FC } from 'react';
import { Box, Container } from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { CP_Hidden_Reporter } from 'src/types/cp';
import './customViewer.css';

interface Props {
  reporter: CP_Hidden_Reporter;
}

const ReporterIntroView: FC<Props> = (props) => {
  const { reporter } = props;

  return (
    <Box sx={{ py: 3, backgroundColor: 'white' }}>
      <Container maxWidth="md">
        <Viewer
          initialValue={reporter.intro}
          //plugins={[colorSyntax]}
        />
      </Container>
    </Box>
  );
};

export default ReporterIntroView;
