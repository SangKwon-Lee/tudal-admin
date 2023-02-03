import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';
import dayjs from 'dayjs';

export const createTrading = async (input) => {
  return await axios.post(`/hankyung-tradings`, input);
};

export const getTradings = async (input) => {
  const query = qs.stringify(removeEmpty(input));
  return await axios.get(
    `/hankyung-tradings?${query}&_limit=100&_sort=created_at:DESC`,
  );
};

export const editTrading = async (id, input) => {
  return await axios.put(`/hankyung-tradings/${id}`, input);
};

export const deleteTrading = async (id) => {
  return await axios.delete(`/hankyung-tradings/${id}`);
};

export const getTradingInfo = async (id) => {
  return await axios.get(`/hankyung-tradings/${id}`);
};

export const getTradingTodayInfo = async (cateogry) => {
  return await axios.get(
    `/hankyung-tradings?created_at_gte=${dayjs().format(
      'YYYY-MM-DD',
    )}&created_at_lt=${dayjs()
      .add(1, 'day')
      .format('YYYY-MM-DD')}&category=${cateogry}`,
  );
};

export const createStocks = async (input) => {
  return await axios.post(`/hankyung-stocks`, input);
};

export const editStocks = async (id, input) => {
  return await axios.put(`/hankyung-stocks/${id}`, input);
};

export const deleteStocks = async (id) => {
  return await axios.put(`/hankyung-stocks/${id}`);
};
