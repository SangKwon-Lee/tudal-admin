import type { FC } from 'react';
import CpReporterCreateContainer from 'src/components/dashboard/cp/CpReporterCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import { useParams } from 'react-router-dom';
const CpReporterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { masterId } = useParams();
  const mode = masterId ? 'edit' : 'create';
  return (
    <>
      <PageLayout
        mainTopic={'CP 관리'}
        pageTitle={'CP 관리'}
        pageTopRef={pageTopRef}
      >
        <CpReporterCreateContainer mode={mode} />
      </PageLayout>
    </>
  );
};

export default CpReporterCreatePage;
