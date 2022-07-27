import type { FC } from 'react';
import React from 'react';
import TudalusContainer from 'src/components/dashboard/tudalus/Tudalus.Conatiner';
import PageLayout from 'src/components/layout/ListPageLayout';

const Overview: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        dashboard={'홈'}
        mainTopic={'투달러스'}
        pageTitle={'투달러스'}
        pageTopRef={pageTopRef}
      >
        <TudalusContainer />
      </PageLayout>
    </>
  );
};

export default Overview;
