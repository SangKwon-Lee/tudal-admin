import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import TestListContainer from 'src/components/dashboard/test/TestList.Container';
import { useParams } from 'react-router-dom';

const TestListPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="테스트 리스트"
      mainTopic={'테스트 리스트'}
      pageTitle={'테스트 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={true}
      buttonName={'테스트 생성'}
      buttonClickLink={'/dashboard/test/create'}
    >
      <TestListContainer />
    </PageLayout>
  );
};

export default TestListPage;
