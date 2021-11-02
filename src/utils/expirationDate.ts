import dayjs from 'dayjs';

export const expirationDate = (value) => {
  let newDate = dayjs();
  if (value === '7일') {
    newDate = newDate.add(7, 'day');
  } else if (value === '30일') {
    newDate = newDate.add(1, 'month');
  } else if (value === '60일') {
    newDate = newDate.add(2, 'month');
  } else if (value === '90일') {
    newDate = newDate.add(3, 'month');
  } else if (value === '6개월') {
    newDate = newDate.add(6, 'month');
  } else if (value === '1년') {
    newDate = newDate.add(12, 'month');
  }
  return newDate.format();
};
