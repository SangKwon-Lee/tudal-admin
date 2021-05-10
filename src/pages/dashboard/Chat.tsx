import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@material-ui/core';
import { ChatSidebar, ChatThread } from '../../components/dashboard/chat';
import gtm from '../../lib/gtm';
import { getThreads } from '../../slices/chat';
import { useDispatch } from '../../store';

const Chat: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(() => {
    dispatch(getThreads());
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Chat | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          height: '100%'
        }}
      >
        <ChatSidebar />
        <ChatThread />
      </Box>
    </>
  );
};

export default Chat;
