import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import CategoryListContainer from 'src/components/dashboard/category/CategoryList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const CategoryPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Category List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <PageLayout
        dashboard="카테고리"
        mainTopic={'카테고리 리스트'}
        pageTitle={'카테고리 리스트'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
      >
        <CategoryListContainer />
      </PageLayout>
    </>
  );
};

export default CategoryPage;
