import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import GroupCommentCreateCotainer from 'src/components/dashboard/groupComment/GroupCommentCreate.Container';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';

const GroupCommentCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Helmet>
        <title>Dashboard: Group Comment Create | TUDAL Admin</title>
      </Helmet>
      <PageLayout
        dashboard="그룹 코멘트"
        mainTopic={'그룹 코멘트 관리'}
        pageTitle={'그룹 코멘트 관리'}
        pageTopRef={pageTopRef}
      >
        <GroupCommentCreateCotainer />
      </PageLayout>
    </>
  );
};

export default GroupCommentCreatePage;
