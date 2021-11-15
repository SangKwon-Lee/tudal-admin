import React from 'react';
import NewsContainer from 'src/components/dashboard/news/News.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const NewsPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="뉴스"
      mainTopic={'뉴스 리스트'}
      pageTitle={'뉴스 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={false}
    >
      <NewsContainer pageTopRef={pageTopRef} />
    </PageLayout>
  );
};

export default NewsPage;
