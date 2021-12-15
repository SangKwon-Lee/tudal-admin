import { FC, useEffect, useState } from 'react';

import { Box, Container, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet-async';
import crypto from 'crypto';
import { useNavigate, useParams } from 'react-router';
import { IHR } from 'src/types/hiddenreport';
import { cmsServer, CMS_TOKEN } from 'src/lib/axios';
import useMounted from 'src/hooks/useMounted';
import './HiddenReportViewer.css';

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
      <Helmet>
        <title>Dashboard: Hiddenbox Viewer | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          py: 3,
          backgroundColor: 'white',
          width: '500px',
          height: '3200px',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3">{title}</Typography>
          <Typography variant="h6" style={{ textAlign: 'right' }}>
            {nickname}
          </Typography>

          {contents && (
            <div
              className="viewer"
              dangerouslySetInnerHTML={{ __html: contents }}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default HiddenreportPreviewPresenter;
