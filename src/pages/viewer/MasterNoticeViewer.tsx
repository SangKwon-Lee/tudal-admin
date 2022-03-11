import { Box, Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import MasterNoticeViewerPresenter from 'src/components/viewer/MasterNoticeViewer';
import useSettings from 'src/hooks/useSettings';
import { cmsServer, CMS_TOKEN } from 'src/lib/axios';
import gtm from 'src/lib/gtm';
import type { FC } from 'react';

const MasterNoticeViewer: FC = () => {
  const { settings } = useSettings();
  const [masterNotice, setMasterNotice] = useState(null);
  const { noticeId } = useParams();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  });

  const getMasterNotice = async () => {
    try {
      const { data } = await cmsServer.get(
        `/master-notices/${noticeId}?token=${CMS_TOKEN}`,
      );
      setMasterNotice(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getMasterNotice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!masterNotice) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Notice Viewer | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <MasterNoticeViewerPresenter masterNotice={masterNotice} />
        </Container>
      </Box>
    </>
  );
};
export default MasterNoticeViewer;
