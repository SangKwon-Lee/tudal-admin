import type { FC } from 'react';
import OverviewContainer from 'src/components/overview/Overview.Container';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';

const Overview: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        dashboard={'대시보드'}
        mainTopic={'대시보드'}
        pageTitle={'대시보드'}
        pageTopRef={pageTopRef}
      >
        <OverviewContainer />
      </PageLayout>
    </>
  );
};

export default Overview;
