import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import YoutubeCreateContainer from 'src/components/dashboard/youtube/YoutubeCreate.Container';
import { useParams } from 'react-router-dom';

const YoutubeCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { youtubeId } = useParams();
  const mode = youtubeId ? 'edit' : 'create';
  return (
    <>
      <Helmet>
        <title>Dashboard: Youtube Create | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="유튜브"
        mainTopic={'유튜브 생성'}
        pageTitle={'유튜브 생성'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <YoutubeCreateContainer
          pageTopRef={pageTopRef}
          mode={mode}
          youtubeId={youtubeId}
        />
      </PageLayout>
    </>
  );
};

export default YoutubeCreatePage;
