import { FC } from 'react';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import useAuth from 'src/hooks/useAuth';
import HrProfileContainer from 'src/components/dashboard/master/HrProfile.Container';

const HrProfilePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  return (
    <>
      <PageLayout
        mainTopic={'히든 리포터 프로필'}
        pageTitle={'히든 리포터 프로필'}
        pageTopRef={pageTopRef}
      >
        <HrProfileContainer user={user} />
      </PageLayout>
    </>
  );
};

export default HrProfilePage;
