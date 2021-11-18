import React, { useEffect } from 'react';
import HiddenreportCreateContainer from 'src/components/dashboard/hiddenreport/HiddenreportCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

const HiddenReportListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { reportId } = useParams();
  const mode = reportId ? 'edit' : 'create';

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
