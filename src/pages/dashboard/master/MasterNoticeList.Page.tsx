import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import MasterNoticeContainer from 'src/components/dashboard/master/MasterNoticeList.Container';

const MastersNoticeListPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Masters Notice | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="달인"
        mainTopic={'달인 공지'}
        pageTitle={'달인 공지'}
        pageTopRef={pageTopRef}
        hasCreateButton={true}
        buttonName={'공지 추가'}
        buttonClickLink={'/dashboard/master/notice/create'}
      >
        <MasterNoticeContainer />
      </PageLayout>
    </>
  );
};

export default MastersNoticeListPage;
