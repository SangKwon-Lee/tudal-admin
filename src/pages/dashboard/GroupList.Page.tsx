import React from 'react';
import GroupListContainer from 'src/components/dashboard/group/GroupList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const NewsPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      mainTopic={'그룹'}
      pageTitle={'그룹 리스트'}
      pageTopRef={pageTopRef}
    >
      <GroupListContainer />
    </PageLayout>
  );
};

export default NewsPage;
