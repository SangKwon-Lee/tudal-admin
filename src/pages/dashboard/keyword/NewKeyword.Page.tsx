import React from 'react';
import NewKeywordContainer from 'src/components/dashboard/keyword/NewKeyword.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const SchedulePage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="키워드"
      mainTopic={'키워드 리스트'}
      pageTitle={'키워드 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={false}
    >
      <NewKeywordContainer />
    </PageLayout>
  );
};

export default SchedulePage;
