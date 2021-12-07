import { FC } from 'react';
import React from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import HiddenReportStatContainer from 'src/components/dashboard/hiddenreport/HiddenreportStat.Container';

const HiddenReportStatPage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <PageLayout
        dashboard="히든 리포트"
        mainTopic={'히든 리포트 통계'}
        pageTitle={'히든 리포터 통계'}
        pageTopRef={pageTopRef}
      >
        <HiddenReportStatContainer />
      </PageLayout>
    </>
  );
};

export default HiddenReportStatPage;
