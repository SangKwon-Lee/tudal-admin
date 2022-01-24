import { FC } from 'react';

import { Box, Container, Typography } from '@material-ui/core';

import { Viewer } from '@toast-ui/react-editor';

interface IProps {
  title: string;
  nickname: string;
  contents: string;
}
const HiddenreportPreviewPresenter: FC<IProps> = ({
  title,
  nickname,
  contents,
}) => {
  return (
    <>
      <Box
        sx={{
          py: 3,
          backgroundColor: 'background.default',
          width: '500px',
          height: '3200px',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3">{title}</Typography>
          <Typography variant="h6" style={{ textAlign: 'right' }}>
            {nickname}
          </Typography>

          {contents && <Viewer initialValue={contents} />}
        </Container>
      </Box>
    </>
  );
};

export default HiddenreportPreviewPresenter;
