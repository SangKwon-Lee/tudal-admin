import type { FC } from 'react';
import CpMasterCreateContainer from 'src/components/dashboard/cp/CpMasterCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import { useParams } from 'react-router-dom';
const CpMasterCreatePage: FC = () => {
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
        <CpMasterCreateContainer mode={mode} />
      </PageLayout>
    </>
  );
};

export default CpMasterCreatePage;
