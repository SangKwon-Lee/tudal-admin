import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import BannerListContainer from 'src/components/dashboard/banner/BannerList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const BannerCreatePage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Banner List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <PageLayout
        dashboard="배너"
        mainTopic={'배너 리스트'}
        pageTitle={'배너 리스트'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <BannerListContainer />
      </PageLayout>
    </>
  );
};

export default BannerCreatePage;
