import { FC } from 'react';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import CpCreateConfirmContainer from 'src/components/dashboard/cp/CpCreateConfirm.Container';

const CpCreateConfirmPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        mainTopic={'CP 생성 확인'}
        pageTitle={'CP 생성 확인'}
        pageTopRef={pageTopRef}
      >
        <CpCreateConfirmContainer />
      </PageLayout>
    </>
  );
};

export default CpCreateConfirmPage;
