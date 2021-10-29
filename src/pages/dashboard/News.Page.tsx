import React from 'react';
import NewsContainer from 'src/components/dashboard/news/News.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const NewsPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      mainTopic={'뉴스'}
      pageTitle={'뉴스 리스트'}
      pageTopRef={pageTopRef}
    >
      <NewsContainer pageTopRef={pageTopRef} />
    </PageLayout>
  );
};

export default NewsPage;
