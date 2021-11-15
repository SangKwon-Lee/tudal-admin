import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import MasterCreateWizardContainer from 'src/components/dashboard/master/MasterCreateWizard.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';

const MasterEditPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Master Create | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="달인"
        mainTopic={'피드 수정'}
        pageTitle={'피드 수정'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <MasterCreateWizardContainer mode={'edit'} />
      </PageLayout>
    </>
  );
};

export default MasterEditPage;
