import type { FC } from 'react';
import CpReporterCreateContainer from 'src/components/dashboard/cp/CpReporterCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import { useParams } from 'react-router-dom';
const CpReporterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { reporterId } = useParams();
  const mode = reporterId ? 'edit' : 'create';
  return (
    <>
      <PageLayout
        dashboard="CP 관리"
        mainTopic={'히든 리포터 생성'}
        pageTitle={'히든 리포터 생성'}
        pageTopRef={pageTopRef}
      >
        <CpReporterCreateContainer mode={mode} />
      </PageLayout>
    </>
  );
};

export default CpReporterCreatePage;
