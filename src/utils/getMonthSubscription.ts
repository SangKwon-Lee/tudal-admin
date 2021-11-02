import dayjs from 'dayjs';

export const getMonthSubscription = (endDate, year) => {
  endDate = endDate.map((data, index) =>
    data.filter(
      (data) =>
        dayjs(data.endDate) >
          dayjs().set('year', year).set('month', index) ||
        data.endDate === null,
    ),
  );
  return endDate;
};
