import { useCallback, useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography
} from '@material-ui/core';
import {
  HiddenboxProductViewer,
} from '../../components/dashboard/hiddenbox';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import type { Hiddenbox } from '../../types/hiddenbox';
import { cmsServer, CMS_TOKEN } from '../../lib/axios';
import useSettings from '../../hooks/useSettings';

const tabs = [
  { label: '상품내용', value: 'details' },
  { label: '구매내역', value: 'payments' },
];

const HiddenboxViewer: FC = () => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [hiddenbox, setHiddenbox] = useState<Hiddenbox | null>(null);
  const { hiddenboxId } = useParams();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getHiddenbox = async () => {
    try {
      const response = await cmsServer.get<Hiddenbox>(`/hiddenboxes/${hiddenboxId}?token=${CMS_TOKEN}`);
      setHiddenbox(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getHiddenbox();
  }, []);

  if (!hiddenbox) {
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
          py: 3
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <HiddenboxProductViewer hiddenbox={hiddenbox} />
        </Container>
      </Box>
    </>
  );
};

export default HiddenboxViewer;
