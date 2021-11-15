import React from 'react';
import HiddenreportCreateContainer from 'src/components/dashboard/hiddenreport/HiddenreportCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import { useParams } from 'react-router-dom';

import HiddenReportDetailViewContainer from 'src/components/dashboard/hiddenreport/HiddenreportDetailView.Container';

const HiddenReportListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { reportId } = useParams();
  return (
    <PageLayout
      mainTopic={'히든리포트'}
      pageTitle={'히든리포트 디테일'}
      pageTopRef={pageTopRef}
    >
      <HiddenReportDetailViewContainer
        reportId={parseInt(reportId, 10)}
      />
    </PageLayout>
  );
};

export default HiddenReportListPage;
