import dayjs from 'dayjs';

export const expirationDate = (value) => {
  let newDate = dayjs();
  if (value === '7일') {
    newDate = newDate.add(7, 'day');
  } else if (value === '30일') {
    newDate = newDate.add(30, 'day');
  } else if (value === '60일') {
    newDate = newDate.add(60, 'day');
  } else if (value === '90일') {
    newDate = newDate.add(90, 'day');
  } else if (value === '6개월') {
    newDate = newDate.add(180, 'day');
  } else if (value === '1년') {
    newDate = newDate.add(365, 'day');
  }
  return newDate.format('YYYY-MM-DD HH:mm:ss');
};
