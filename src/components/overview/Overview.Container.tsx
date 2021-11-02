import React, { useCallback, useEffect, useState } from 'react';
import OverviewPresenter from './Overview.Presenter';
import dayjs from 'dayjs';
import { APIOverview } from 'src/lib/api';
import { INews } from 'src/types/news';
import { Schedule } from 'src/types/schedule';

const OverviewContainer: React.FC = () => {
  const [news, setNews] = useState<INews[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const getData = useCallback(async () => {
    const today = dayjs().format('YYYY-MM-DD');
    try {
      const { data: newsList, status: newsStatus } =
        await APIOverview.getNews();
      const { data: scheduleList, status: scheduleStatus } =
        await APIOverview.getSchedules(today);

      newsStatus === 200 && setNews(newsList);
      scheduleStatus === 200 && setSchedules(scheduleList);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <OverviewPresenter newsList={news} scheduleList={schedules} />
  );
};

export default OverviewContainer;
