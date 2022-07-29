import type { FC } from 'react';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import Homescreen from 'src/components/overview/Homescreen';

const Overview: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        dashboard={'대시보드'}
        mainTopic={'홈'}
        pageTitle={'홈'}
        pageTopRef={pageTopRef}
      >
        <Homescreen />
      </PageLayout>
    </>
  );
};

export default Overview;
