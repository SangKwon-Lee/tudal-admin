import type { FC } from 'react';
import CpReporterCreateContainer from 'src/components/dashboard/cp/CpReporterCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
const CpReporterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { userId, reporterId } = useParams();
  const path = useLocation();
  const pathName = path.pathname.includes('signup');
  const mode =
    userId && pathName
      ? 'selectAndCreate'
      : reporterId
      ? 'edit'
      : 'create';
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
