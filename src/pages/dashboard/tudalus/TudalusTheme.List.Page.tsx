import type { FC } from 'react';
import React from 'react';
import TudalUsThemeListContainer from 'src/components/dashboard/tudalusContents/TudalUsThemeList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const Overview: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        dashboard={'투달유에스'}
        mainTopic={'투달유에스 테마 리스트'}
        pageTitle={'투달유에스 테마 리스트'}
        pageTopRef={pageTopRef}
      >
        <TudalUsThemeListContainer />
      </PageLayout>
    </>
  );
};

export default Overview;
