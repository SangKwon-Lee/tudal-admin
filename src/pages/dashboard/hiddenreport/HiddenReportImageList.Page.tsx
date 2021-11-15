import React from 'react';
import HiddenReportImageListContainer from '../../../components/dashboard/hiddenreport/HiddenreportImageList.Conatiner';
import PageLayout from 'src/components/layout/ListPageLayout';

const HiddenReportImageListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="히든 리포트"
      mainTopic={'히든리포트 이미지'}
      pageTitle={'히든리포트 이미지 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={true}
      buttonName={'이미지 생성'}
      buttonClickLink={'/dashboard/hiddenreports/images/new'}
    >
      <HiddenReportImageListContainer pageTopRef={pageTopRef} />
    </PageLayout>
  );
};

export default HiddenReportImageListPage;
