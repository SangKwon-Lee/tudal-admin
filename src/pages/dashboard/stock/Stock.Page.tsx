import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import StockListContainer from 'src/components/dashboard/stock/StockList.Container';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';

const StockPage = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Schedule List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <PageLayout
        dashboard="종목"
        mainTopic={'종목 리스트'}
        pageTitle={'종목 리스트'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <StockListContainer />
      </PageLayout>
    </>
  );
};

export default StockPage;
