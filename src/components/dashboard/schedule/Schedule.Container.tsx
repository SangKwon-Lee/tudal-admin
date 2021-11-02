import React, { useState, useEffect } from 'react';
import { Schedule } from 'src/types/schedule';

import { ScheduleListContainer } from './index';
import ScheduleFormContainer from './ScheduleForm.Container';

interface IScheduleContainerProps {
  pageTopRef: React.RefObject<HTMLDivElement>;
}
const ScheduleContainer: React.FC<IScheduleContainerProps> = (
  props,
) => {
  const { pageTopRef } = props;
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [targetModify, setTargetModify] = useState<Schedule>(null);

  const clearTargetModify = () => {
    setTargetModify(null);
  };

  const handleUpdate = (shouldUpdate: boolean) => {
    setShouldUpdate(shouldUpdate);
  };

  useEffect(() => {
    targetModify &&
      pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [targetModify, pageTopRef]);

  return (
    <>
      <ScheduleFormContainer
        handleUpdate={handleUpdate}
        targetModify={targetModify}
        clearTargetModify={clearTargetModify}
      />
      <ScheduleListContainer
        pageTopRef={pageTopRef}
        shouldUpdate={shouldUpdate}
        setTargetModify={setTargetModify}
        handleUpdate={handleUpdate}
      />
    </>
  );
};

export default ScheduleContainer;
