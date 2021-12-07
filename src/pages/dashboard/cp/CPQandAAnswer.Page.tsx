import type { FC } from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CPQandAAnswerContainer from 'src/components/dashboard/cp/CpQandAAnswer.Container';
const CpMasterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { qId, aId } = useParams();
  const path = useLocation();
  const isEdit = path.pathname.includes('edit');
  const mode = isEdit ? 'edit' : 'create';
  return (
    <>
      <PageLayout
        dashboard="대시보드"
        mainTopic={'답변 작성'}
        pageTitle={'답변 작성'}
        pageTopRef={pageTopRef}
      >
        <CPQandAAnswerContainer qId={qId} aId={aId} mode={mode} />
      </PageLayout>
    </>
  );
};

export default CpMasterCreatePage;
