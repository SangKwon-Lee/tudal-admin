import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import { CP_Hidden_Reporter } from 'src/types/cp';
import ReporterIntroView from 'src/components/viewer/ReporterIntroViewer';
import { cmsServer, CMS_TOKEN } from 'src/lib/axios';

const ReporterViewer: FC = () => {
  const { settings } = useSettings();
  const [reporter, setReporter] = useState<CP_Hidden_Reporter | null>(
    null,
  );
  const { id } = useParams();

  const getReporter = async () => {
    try {
      const response = await cmsServer.get<CP_Hidden_Reporter>(
        `/masters/${id}?token=${CMS_TOKEN}`,
      );
      setReporter(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getReporter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!reporter) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`${reporter.nickname}의 프로필`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <ReporterIntroView reporter={reporter} />
        </Container>
      </Box>
    </>
  );
};

export default ReporterViewer;
