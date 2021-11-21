import { FC } from 'react';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import CpCreateContainer from 'src/components/dashboard/cp/CpCreate.Container';
import { useParams } from 'react-router-dom';

const CpCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { cpId } = useParams();
  const mode = cpId ? 'edit' : 'create';
  return (
    <>
      <PageLayout
        dashboard={'CP 관리'}
        mainTopic={'CP 계정 생성'}
        pageTitle={'CP 계정 생성'}
        pageTopRef={pageTopRef}
      >
        <CpCreateContainer mode={mode} />
      </PageLayout>
    </>
  );
};

export default CpCreatePage;
