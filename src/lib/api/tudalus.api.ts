import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';
import dayjs from 'dayjs';

export const getTudalusSubscriber = async () => {
  const Today = dayjs();
  let Month = String(dayjs().get('month') + 1);
  let Day = String(dayjs().get('date'));

  if (Month.length === 1) {
    Month = `0${Month}`;
  }
  if (Day.length === 1) {
    Day = `0${Day}`;
  }
  // const query = qs.stringify(removeEmpty(param));
  return await axios.get(
    `/tudalus-premium-users/count?endDate_gte=${Today.get(
      'year',
    )}-${Month}-${Day}&type=gold`,
  );
};

export const getTudalusSubscriberDate = async (date?) => {
  const Today = dayjs();
  let Month = String(dayjs().get('month') + 1);
  let Day = String(dayjs().get('date'));

  if (Month.length === 1) {
    Month = `0${Month}`;
  }
  if (Day.length === 1) {
    Day = `0${Day}`;
  }
  // const query = qs.stringify(removeEmpty(param));
  return await axios.get(
    `/tudalus-premium-users?created_at_gte=${Today.get(
      'year',
    )}-${Month}-${Day}&endDate_gte=${Today.get(
      'year',
    )}-${Month}-${Day}&type=gold`,
  );
};
