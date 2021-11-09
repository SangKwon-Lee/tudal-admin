import type { FC } from 'react';
import CpReporterCreateContainer from 'src/components/dashboard/cp/CpReporterCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
const CpReporterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <PageLayout
        mainTopic={'CP 관리'}
        pageTitle={'CP 관리'}
        pageTopRef={pageTopRef}
      >
        <CpReporterCreateContainer />
      </PageLayout>
    </>
  );
};

export default CpReporterCreatePage;
