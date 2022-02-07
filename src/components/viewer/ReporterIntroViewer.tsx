import type { FC } from 'react';
import { Box, Container } from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { IHiddenReporter } from 'src/types/hiddenreport';

interface Props {
  reporter: IHiddenReporter;
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
