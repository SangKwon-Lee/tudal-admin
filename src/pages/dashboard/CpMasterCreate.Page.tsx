import type { FC } from 'react';
import CpMasterCreateContainer from 'src/components/dashboard/cp/CpMasterCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
const CpMasterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        mainTopic={'CP 관리'}
        pageTitle={'CP 관리'}
        pageTopRef={pageTopRef}
      >
        <CpMasterCreateContainer />
      </PageLayout>
    </>
  );
};

export default CpMasterCreatePage;
