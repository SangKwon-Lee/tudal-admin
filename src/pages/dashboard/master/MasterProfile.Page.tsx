import { FC } from 'react';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import MasterProfileContainer from 'src/components/dashboard/master/MasterProfile.Container';
import useAuth from 'src/hooks/useAuth';

const MasterProfilePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  return (
    <>
      <PageLayout
        dashboard="달인"
        mainTopic={'달인 프로필'}
        pageTitle={'달인 프로필'}
        pageTopRef={pageTopRef}
      >
        <MasterProfileContainer user={user} />
      </PageLayout>
    </>
  );
};

export default MasterProfilePage;
