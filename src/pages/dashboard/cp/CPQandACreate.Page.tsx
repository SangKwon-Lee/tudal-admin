import type { FC } from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CPQandACreateContainer from 'src/components/dashboard/cp/CpQandACreate.Container';
const CpMasterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { qId } = useParams();

  const mode = qId ? 'edit' : 'create';
  return (
    <>
      <PageLayout
        dashboard="대시보드"
        mainTopic={'문의사항 작성'}
        pageTitle={'문의사항 작성'}
        pageTopRef={pageTopRef}
      >
        <CPQandACreateContainer mode={mode} />
      </PageLayout>
    </>
  );
};

export default CpMasterCreatePage;
