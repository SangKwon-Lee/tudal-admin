import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import TestCreateContainer from 'src/components/dashboard/test/TestCreate.Container';
import { useParams } from 'react-router-dom';

const TestCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { testId } = useParams();
  const mode = testId ? 'edit' : 'create';
  return (
    <>
      <Helmet>
        <title>Dashboard:  Create | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="테스트"
        mainTopic={'테스트 생성'}
        pageTitle={'테스트 생성'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <TestCreateContainer
          pageTopRef={pageTopRef}
          mode={mode}
          testId={testId}
        />
      </PageLayout>
    </>
  );
};

export default TestCreatePage;
