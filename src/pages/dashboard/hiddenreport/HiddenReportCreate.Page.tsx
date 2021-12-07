import React from 'react';
import HiddenreportCreateContainer from 'src/components/dashboard/hiddenreport/HiddenreportCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import { useParams, useLocation } from 'react-router-dom';

const HiddenReportListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { reportId } = useParams();
  const path = useLocation();
  const isCreate = path.pathname.includes('new');

  const mode = isCreate ? 'create' : 'edit';

  return (
    <PageLayout
      mainTopic={'히든리포트'}
      pageTitle={'히든리포트 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={false}
    >
      <HiddenreportCreateContainer
        mode={mode}
        pageTopRef={pageTopRef}
        reportId={parseInt(reportId, 10)}
      />
    </PageLayout>
  );
};

export default HiddenReportListPage;
