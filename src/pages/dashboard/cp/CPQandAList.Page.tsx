import type { FC } from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import CPQandAListContainer from 'src/components/dashboard/cp/CpQandAList.Container';
import useAuth from 'src/hooks/useAuth';
import { IUserType } from 'src/types/user';
const CpMasterDetailPage: FC = () => {
  const { user } = useAuth();
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const isCP = user.type === IUserType.CP;
  return (
    <>
      <PageLayout
        dashboard="대시보드"
        mainTopic={'문의사항'}
        pageTitle={'문의사항'}
        pageTopRef={pageTopRef}
        hasCreateButton={isCP}
        buttonName={'문의사항 작성'}
        buttonClickLink={'/dashboard/qas/new'}
      >
        <CPQandAListContainer />
      </PageLayout>
    </>
  );
};

export default CpMasterDetailPage;
