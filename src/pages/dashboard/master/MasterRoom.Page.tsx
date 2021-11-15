import type { FC } from 'react';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MasterRoomContainer from 'src/components/dashboard/master/MasterRoom.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const MasterRoomPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Master Room | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="달인"
        mainTopic={'방 관리'}
        pageTitle={'방 관리'}
        pageTopRef={pageTopRef}
      >
        <MasterRoomContainer />
      </PageLayout>
    </>
  );
};

export default MasterRoomPage;
