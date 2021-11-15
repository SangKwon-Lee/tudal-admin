import React from 'react';
import ScheduleContainer from 'src/components/dashboard/schedule/Schedule.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const SchedulePage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  return (
    <PageLayout
      dashboard="일정"
      mainTopic={'일정 리스트'}
      pageTitle={'일정 리스트'}
      pageTopRef={pageTopRef}
      hasCreateButton={false}
    >
      <ScheduleContainer pageTopRef={pageTopRef} />
    </PageLayout>
  );
};

export default SchedulePage;
