import type { FC } from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import CpReporterDetailContainer from 'src/components/dashboard/cp/CpReporterDetail.Container';
const CpReporterDetailPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        dashboard={'CP 관리'}
        mainTopic={'히든 리포터 상세보기'}
        pageTitle={'히든 리포터 상세보기'}
        pageTopRef={pageTopRef}
      >
        <CpReporterDetailContainer />
      </PageLayout>
    </>
  );
};

export default CpReporterDetailPage;
