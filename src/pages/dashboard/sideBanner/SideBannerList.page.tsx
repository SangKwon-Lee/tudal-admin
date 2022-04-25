import React from 'react';
import SideBannerListContainer from 'src/components/dashboard/sideBanner/SideBannerList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const SideBannerListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="사이드 배너 리스트"
      mainTopic={'사이드 배너 리스트'}
      pageTitle={'사이드 배너 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={true}
      buttonName={'사이드 배너 생성'}
      buttonClickLink={'/dashboard/sidebanner/create'}
    >
      <SideBannerListContainer />
    </PageLayout>
  );
};

export default SideBannerListPage;
