import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import MasterNoticeCreateContainer from 'src/components/dashboard/master/MasterNoticeCreate.Container';

const MastersNoticeEditPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Masters Notice | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="달인"
        mainTopic={'공지 생성'}
        pageTitle={'공지 생성'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <MasterNoticeCreateContainer mode="edit" />
      </PageLayout>
    </>
  );
};

export default MastersNoticeEditPage;
