import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import MasterListTableContainer from '../../../components/dashboard/master/MasterListTable.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';

const MastersListPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Masters List | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="달인"
        mainTopic={'달인 리스트'}
        pageTitle={'달인 리스트'}
        pageTopRef={pageTopRef}
        hasCreateButton={true}
        buttonName={'피드 추가'}
        buttonClickLink={'/dashboard/master/new'}
      >
        <MasterListTableContainer />
      </PageLayout>
    </>
  );
};

export default MastersListPage;
