import dayjs from 'dayjs';
export function isUseDay(endDay) {
  return dayjs(endDay).format() > dayjs(new Date()).format()
    ? true
    : false;
}
