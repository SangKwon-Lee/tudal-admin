import React from 'react';
import YoutubeListContainer from 'src/components/dashboard/youtube/YoutubeList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const YoutubeListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="유튜브 리스트"
      mainTopic={'유튜브 리스트'}
      pageTitle={'유튜브 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={true}
      buttonName={'유튜브 생성'}
      buttonClickLink={'/dashboard/youtube/create'}
    >
      <YoutubeListContainer />
    </PageLayout>
  );
};

export default YoutubeListPage;
