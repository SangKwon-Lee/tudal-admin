import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'src/components/layout/ListPageLayout';
import StockCommentListContainer from 'src/components/dashboard/stock/StockCommentList.Container';

const StockCommentPage = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: StockComment List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <PageLayout
        dashboard="종목 - 코멘트"
        mainTopic={'종목 - 코멘트 리스트'}
        pageTitle={'종목 - 코멘트 리스트'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <StockCommentListContainer />
      </PageLayout>
    </>
  );
};

export default StockCommentPage;
