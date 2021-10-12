import React, { useState, useRef } from 'react';
import { Schedule } from 'src/types/schedule';

import { ScheduleListContainer } from './index';
import { APISchedule } from 'src/lib/api';
import * as _ from 'lodash';
import useMounted from 'src/hooks/useMounted';
import ScheduleFormContainer from './ScheduleForm.Container';

const ScheduleContainer: React.FC = () => {
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [targetModify, setTargetModify] = useState<Schedule>(null);

  const clearTargetModify = () => {
    setTargetModify(null);
  };
  const reload = () => console.log('reload');

  return (
    <>
      <ScheduleFormContainer
        reload={reload}
        targetModify={targetModify}
        clearTargetModify={clearTargetModify}
      />
      <ScheduleListContainer
        shouldUpdate={shouldUpdate}
        setTargetModify={setTargetModify}
        setShouldUpdate={setShouldUpdate}
      />
    </>
  );
};

export default ScheduleContainer;
