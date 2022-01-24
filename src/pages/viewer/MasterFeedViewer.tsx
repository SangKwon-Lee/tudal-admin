import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import { IMasterFeed } from 'src/types/master';
import MasterFeedViewerPresenter from 'src/components/viewer/MasterFeedViewer';
import { cmsServer, CMS_TOKEN } from 'src/lib/axios';

const MasterFeedViewer: FC = () => {
  const { settings } = useSettings();
  const [feed, setFeed] = useState<IMasterFeed | null>(null);
  const { id } = useParams();

  const getMaster = async () => {
    try {
      const response = await cmsServer.get<IMasterFeed>(
        `/master-feeds/${id}?token=${CMS_TOKEN}`,
      );
      setFeed(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!feed) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`${feed.title}`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <MasterFeedViewerPresenter feed={feed} />
        </Container>
      </Box>
    </>
  );
};

export default MasterFeedViewer;
