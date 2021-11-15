import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import CouponIssuedListTableContainer from 'src/components/dashboard/coupon/CouponIssuedListTable.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';

const CouponIssuedListPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Coupon Issued List | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard={'쿠폰'}
        mainTopic={'발급된 쿠폰 리스트'}
        pageTitle={'발급된 쿠폰 리스트'}
        pageTopRef={pageTopRef}
      >
        <CouponIssuedListTableContainer />
      </PageLayout>
    </>
  );
};

export default CouponIssuedListPage;
