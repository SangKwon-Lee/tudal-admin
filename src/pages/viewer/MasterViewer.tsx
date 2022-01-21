import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import { IMaster } from 'src/types/master';
import MasterIntroViewer from 'src/components/viewer/MasterIntroViewer';
import { cmsServer, CMS_TOKEN } from 'src/lib/axios';

const MasterViewer: FC = () => {
  const { settings } = useSettings();
  const [master, setMaster] = useState<IMaster | null>(null);
  const { id } = useParams();

  const getMaster = async () => {
    try {
      const response = await cmsServer.get<IMaster>(
        `/masters/${id}?token=${CMS_TOKEN}`,
      );
      setMaster(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!master) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`${master.nickname}의 프로필`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <MasterIntroViewer master={master} />
        </Container>
      </Box>
    </>
  );
};

export default MasterViewer;
