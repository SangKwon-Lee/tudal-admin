import { FC, useEffect, useState } from 'react';

import { Box, Container, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet-async';
import crypto from 'crypto';
import { useNavigate, useParams } from 'react-router';
import { IHR } from 'src/types/hiddenreport';
import { cmsServer, CMS_TOKEN } from 'src/lib/axios';
import useMounted from 'src/hooks/useMounted';
import './HiddenReportViewer.css';

const HiddenReportViewerPage: FC = () => {
  const [report, setReport] = useState<IHR>(null);
  const { id } = useParams();
  const mounted = useMounted();

  const navigate = useNavigate();
  useEffect(() => {
    const getReport = async () => {
      const { data } = await cmsServer.get<IHR>(
        `/hidden-reports/${id}?token=${CMS_TOKEN}`,
      );
      setReport(data);
    };

    getReport();
  }, [id]);

  useEffect(() => {
    if (mounted && report) {
      const randomString = crypto.randomBytes(20).toString('hex');

      navigate(
        `/viewer/hiddenreport/${report.id}?key=${randomString}`,
      );
    }
  }, [report]);

  if (!report) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Hiddenbox Viewer | TUDAL Admin</title>
      </Helmet>
      <Box sx={{ py: 3, backgroundColor: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h3">{report.title}</Typography>
          <Typography variant="h6" style={{ textAlign: 'right' }}>
            {report.hidden_reporter.nickname}
          </Typography>

          {report.contents && (
            <div
              className="viewer"
              dangerouslySetInnerHTML={{ __html: report.contents }}
            />
            // report.contents && <Viewer initialValue={report.contents}/>
          )}
        </Container>
      </Box>
    </>
  );
};

export default HiddenReportViewerPage;
