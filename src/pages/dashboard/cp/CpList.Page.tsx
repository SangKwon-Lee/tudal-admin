import { FC } from 'react';
import CpListContainer from 'src/components/dashboard/cp/CpList.Container';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';

const CpListPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        dashboard={'CP 관리'}
        mainTopic={'CP 리스트'}
        pageTitle={'CP 리스트'}
        pageTopRef={pageTopRef}
        hasCreateButton={true}
        buttonName="계정 생성"
        buttonClickLink="/dashboard/cp/create"
      >
        <CpListContainer />
      </PageLayout>
    </>
  );
};

export default CpListPage;
