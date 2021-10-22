import React from 'react';
import KeywordListContainer from 'src/components/dashboard/keyword/KeywordList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const SchedulePage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      mainTopic={'키워드'}
      pageTitle={'키워드 리스트'}
      pageTopRef={pageTopRef}
    >
      <KeywordListContainer pageTopRef={pageTopRef} />
    </PageLayout>
  );
};

export default SchedulePage;
