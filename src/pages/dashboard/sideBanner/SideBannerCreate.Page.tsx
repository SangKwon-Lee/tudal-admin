import React from 'react';
import { useParams } from 'react-router-dom';
import SideBannerCreateContainer from 'src/components/dashboard/sideBanner/SideBannerCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const SideBannerCreatePage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { bannerId } = useParams();
  const mode = bannerId ? 'edit' : 'create';
  return (
    <PageLayout
      dashboard="사이드 배너"
      mainTopic={'사이드 배너 생성'}
      pageTitle={'사이드 배너 생성'}
      pageTopRef={pageTopRef}
      hasCreateButton={false}
    >
      <SideBannerCreateContainer
        pageTopRef={pageTopRef}
        mode={mode}
        bannerId={bannerId}
      />
    </PageLayout>
  );
};

export default SideBannerCreatePage;
