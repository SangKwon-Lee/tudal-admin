import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import CouponListTableContainer from 'src/components/dashboard/coupon/CouponListTable.Container';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
// import useAuth from 'src/hooks/useAuth';

const CouponListPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Coupon List | TUDAL Admin</title>
      </Helmet>

      <PageLayout
        dashboard={'쿠폰'}
        mainTopic={'쿠폰 리스트'}
        pageTitle={'쿠폰 리스트'}
        pageTopRef={pageTopRef}
      >
        <CouponListTableContainer />
      </PageLayout>
    </>
  );
};

export default CouponListPage;
