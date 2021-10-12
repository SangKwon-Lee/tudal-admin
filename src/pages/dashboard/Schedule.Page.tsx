import React from 'react';
import ScheduleContainer from 'src/components/dashboard/schedule/Schedule.Container';
import PageLayout from 'src/components/layout/PageLayout';

const SchedulePage: React.FC = () => {
  return (
    <PageLayout mainTopic={'일정'} pageTitle={'일정 리스트'}>
      <ScheduleContainer />
    </PageLayout>
  );
};

export default SchedulePage;
