import type { FC } from 'react';
import React from 'react';
import TudalUsContentsListContainer from 'src/components/dashboard/tudalusContents/TudalUsContentsList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const Overview: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        dashboard={'투달유에스'}
        mainTopic={'투달유에스 콘텐츠 리스트'}
        pageTitle={'투달유에스 콘텐츠 리스트'}
        pageTopRef={pageTopRef}
      >
        <TudalUsContentsListContainer />
      </PageLayout>
    </>
  );
};

export default Overview;
