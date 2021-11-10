import React from 'react';
import HiddenReportListContainer from 'src/components/dashboard/hiddenreport/HiddenreportImageList.Conatiner';
import PageLayout from 'src/components/layout/ListPageLayout';

const HiddenReportListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      mainTopic={'히든리포트'}
      pageTitle={'히든리포트 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={true}
      buttonName={'리포트 생성'}
      buttonClickLink={'/dashboard/hiddenreports/new'}
    >
      <HiddenReportListContainer pageTopRef={pageTopRef} />
    </PageLayout>
  );
};

export default HiddenReportListPage;
