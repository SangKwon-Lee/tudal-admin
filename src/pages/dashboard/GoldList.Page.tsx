import React from 'react';
import GoldListContainer from 'src/components/dashboard/gold/GoldList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const GoldList: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      mainTopic={'골드'}
      pageTitle={'골드 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={false}
    >
      <GoldListContainer pageTopRef={pageTopRef} />
    </PageLayout>
  );
};

export default GoldList;
