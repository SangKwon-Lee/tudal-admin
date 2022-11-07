import type { FC } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import TudalUsContentsCreateContainer from 'src/components/dashboard/tudalusContents/TudalUsContentsCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const Overview: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { contentsId } = useParams();
  const mode = contentsId ? 'edit' : 'create';
  return (
    <>
      <PageLayout
        dashboard={'투달유에스'}
        mainTopic={'투달유에스 콘텐츠 작성'}
        pageTitle={'투달유에스 콘텐츠 작성'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
        buttonClickLink={'/dashboard/tudalus/contents/create'}
        buttonName="생성"
      >
        <TudalUsContentsCreateContainer
          mode={mode}
          contentsId={contentsId}
        />
      </PageLayout>
    </>
  );
};

export default Overview;
