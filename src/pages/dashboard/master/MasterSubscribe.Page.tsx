import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import MasterSubscribeContainer from 'src/components/dashboard/master/MasterSubscribe.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';

const MasterSubscribePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Master Subscribe | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="달인"
        mainTopic={'구독 현황'}
        pageTitle={'구독 현황'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <MasterSubscribeContainer />
      </PageLayout>
    </>
  );
};

export default MasterSubscribePage;
