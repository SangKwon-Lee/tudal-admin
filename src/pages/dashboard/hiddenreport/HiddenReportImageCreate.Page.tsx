import React from 'react';
import { useParams } from 'react-router-dom';
import HiddenReportCreateContainer from 'src/components/dashboard/hiddenreport/HiddenreportImageCreate.Conatiner';
import PageLayout from 'src/components/layout/ListPageLayout';

const HiddenReportImageCreatePage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const mode = id ? 'edit' : 'create';
  return (
    <PageLayout
      dashboard="히든 리포트"
      mainTopic={'히든리포트 이미지'}
      pageTitle={'히든리포트 이미지 생성'}
      pageTopRef={pageTopRef}
      hasCreateButton={false}
    >
      <HiddenReportCreateContainer
        pageTopRef={pageTopRef}
        mode={mode}
      />
    </PageLayout>
  );
};

export default HiddenReportImageCreatePage;
