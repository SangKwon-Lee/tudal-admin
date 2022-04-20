import React from 'react';
import GroupListContainer from 'src/components/dashboard/group/GroupList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const NewsPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="그룹 코멘트"
      mainTopic={'그룹 리스트'}
      pageTitle={'그룹 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={true}
      buttonName={'데일리 생성'}
      buttonClickLink={'/dashboard/groups/create'}
    >
      <GroupListContainer />
    </PageLayout>
  );
};

export default NewsPage;
