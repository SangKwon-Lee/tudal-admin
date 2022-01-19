import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'src/components/layout/ListPageLayout';
import StockTagListContainer from 'src/components/dashboard/stock/StockTagList.Container';

const StockTagPage = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: StockTag List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <PageLayout
        dashboard="종목 - 키워드"
        mainTopic={'종목 - 키워드 리스트'}
        pageTitle={'종목 - 키워드 리스트'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <StockTagListContainer />
      </PageLayout>
    </>
  );
};

export default StockTagPage;
