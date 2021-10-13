import React from 'react';
import ScheduleContainer from 'src/components/dashboard/schedule/Schedule.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const SchedulePage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      mainTopic={'일정'}
      pageTitle={'일정 리스트'}
      pageTopRef={pageTopRef}
    >
      <ScheduleContainer pageTopRef={pageTopRef} />
    </PageLayout>
  );
};

export default SchedulePage;
