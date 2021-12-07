import React, { useEffect, useState } from 'react';
import OverviewPresenter from './Overview.Presenter';
import dayjs from 'dayjs';

const OverviewContainer: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [time, setTime] = useState(dayjs().format('HH:mm'));
  const [greet, setGreet] = useState('');
  useEffect(() => {
    if (time.slice(0, 2) < '12') {
      setGreet('morning');
    } else if (time.slice(0, 2) < '18') {
      setGreet('afternoon');
    } else {
      setGreet('evening');
    }
  }, [time]);

  return <OverviewPresenter greet={greet} />;
};

export default OverviewContainer;
