import React from 'react';
import HiddenReportListContainer from 'src/components/dashboard/hiddenreport/HiddenreportList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const HiddenReportListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="히든 리포트"
      mainTopic={'히든리포트 리스트'}
      pageTitle={'히든리포트 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={true}
      buttonName={'리포트 생성'}
      buttonClickLink={'/dashboard/hiddenreports/new'}
    >
      <HiddenReportListContainer />
    </PageLayout>
  );
};

export default HiddenReportListPage;
