import React, { useEffect, useState } from 'react';
import OverviewPresenter from './Overview.Presenter';
import dayjs from 'dayjs';

const OverviewContainer: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [time, setTime] = useState(dayjs().format('HH:mm'));
  // const [greet, setGreet] = useState('');

  useEffect(() => {
    console.log(time.slice(0, 2));
  }, [time]);

  return <OverviewPresenter time={time} />;
};

export default OverviewContainer;
