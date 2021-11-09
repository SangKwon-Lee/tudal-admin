import type { FC } from 'react';
import CpReporterCreateContainer from 'src/components/dashboard/cp/CpReporterCreate.Container';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
const CpReporterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        mainTopic={'CP 관리'}
        pageTitle={'CP 관리'}
        pageTopRef={pageTopRef}
      >
        <CpReporterCreateContainer mode={'edit'} />
      </PageLayout>
    </>
  );
};

export default CpReporterCreatePage;
