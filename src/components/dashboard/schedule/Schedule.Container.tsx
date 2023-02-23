import React, { useState, useEffect } from 'react';
import { Schedule } from 'src/types/schedule';
import Calendar from 'react-awesome-calendar';
import { ScheduleListContainer } from './index';
import ScheduleFormContainer from './ScheduleForm.Container';
import { APISchedule } from 'src/lib/api';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material';
import styled from '@emotion/styled';
import './custom.css';

const CustomCalendar = styled(Calendar)`
  .dayCell {
    border-right: 1px solid black !important;
  }
  .calendarWrapper {
    border-right: 1px solid black !important;
  }
`;

interface IScheduleContainerProps {
  pageTopRef: React.RefObject<HTMLDivElement>;
}
const ScheduleContainer: React.FC<IScheduleContainerProps> = (
  props,
) => {
  const { pageTopRef } = props;
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const theme = useTheme();
  const [targetModify, setTargetModify] = useState<Schedule>(null);
  const [canlendarList, setCanlendarList] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [query, setQuery] = useState({
    _q: '',
    _sort: 'created_at:desc',
    _page: 0,
    _limit: 100,
    _startDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    _endDate: dayjs().add(3, 'month').format('YYYY-MM-DD'),
  });
  console.log(canlendarList);

  const getSchedule = async () => {
    try {
      const { data, status } = await APISchedule.getList(query);
      if (status === 200 && data.length > 0) {
        const newData = data
          .map((data) => {
            let canlendar = {
              id: 0,
              color: '',
              from: '',
              to: '',
              title: '',
              priority: 0,
            };
            canlendar = {
              id: data.id,
              color:
                data.priority === 1
                  ? theme.palette.warning.light
                  : data.priority === 3
                  ? theme.palette.success.light
                  : theme.palette.error.light,
              title: data.title,
              from: data.startDate,
              to: data.endDate,
              priority: data.priority,
            };
            return canlendar;
          })
          .sort((a, b) => b.priority - a.priority);
        console.log(data);
        setCanlendarList(newData);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    getSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CustomCalendar
        style={{
          border: `1px solid red`,
        }}
        events={canlendarList}
      />
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
