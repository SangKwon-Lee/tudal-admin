import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import { IMaster } from 'src/types/master';
import { APICp } from 'src/lib/api';
import MasterIntroViewer from 'src/components/viewer/MasterIntroViewer';

const MasterViewer: FC = () => {
  const { settings } = useSettings();
  const [master, setMaster] = useState<IMaster | null>(null);
  const { id } = useParams();

  const getHiddenbox = async () => {
    try {
      const response = await APICp.getMaster(id);
      setMaster(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getHiddenbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!master) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Hiddenbox Viewer | TUDAL Admin</title>
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
