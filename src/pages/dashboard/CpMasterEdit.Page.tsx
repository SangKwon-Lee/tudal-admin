import type { FC } from 'react';
import React from 'react';
import CpMasterCreateContainer from 'src/components/dashboard/cp/CpMasterCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
const CpMasterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        mainTopic={'CP 관리'}
        pageTitle={'CP 관리'}
        pageTopRef={pageTopRef}
      >
        <CpMasterCreateContainer mode={'edit'} />
      </PageLayout>
    </>
  );
};

export default CpMasterCreatePage;
