import { FC } from 'react';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import useAuth from 'src/hooks/useAuth';
import HiddenReportProfileContainer from 'src/components/dashboard/hiddenreport/HiddenReportProfile.Container';

const HiddenReportProfilePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  return (
    <>
      <PageLayout
        dashboard="히든 리포트"
        mainTopic={'히든 리포터 프로필'}
        pageTitle={'히든 리포터 프로필'}
        pageTopRef={pageTopRef}
      >
        <HiddenReportProfileContainer user={user} />
      </PageLayout>
    </>
  );
};

export default HiddenReportProfilePage;
