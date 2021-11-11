import type { FC } from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import CpMasterDetailContainer from 'src/components/dashboard/cp/CpMasterDetail.Container';
const CpMasterDetailPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        mainTopic={'CP 달인 상세보기'}
        pageTitle={'CP 달인 상세보기'}
        pageTopRef={pageTopRef}
      >
        <CpMasterDetailContainer />
      </PageLayout>
    </>
  );
};

export default CpMasterDetailPage;
