import type { FC } from 'react';
import CpMasterCreateContainer from 'src/components/dashboard/cp/CpMasterCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
const CpMasterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { masterId, userId } = useParams();
  const path = useLocation();
  const isSignup = path.pathname.includes('signup');
  const mode =
    userId && isSignup
      ? 'selectAndCreate'
      : masterId
      ? 'edit'
      : 'create';
  return (
    <>
      <PageLayout
        dashboard="CP 관리"
        mainTopic={'달인 생성'}
        pageTitle={'달인 생성'}
        pageTopRef={pageTopRef}
      >
        <CpMasterCreateContainer mode={mode} />
      </PageLayout>
    </>
  );
};

export default CpMasterCreatePage;
