import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';

export const createOpeningTrading = async (input) => {
  return await axios.post(`/opening-tradings`, input);
};

export const getOpeningTradings = async (input) => {
  const query = qs.stringify(removeEmpty(input));
  return await axios.get(`/opening-tradings?${query}&_limit=100`);
};

export const editOpeningTrading = async (id, input) => {
  return await axios.put(`/opening-tradings/${id}`, input);
};

export const deleteOpeningTrading = async (id) => {
  return await axios.delete(`/opening-tradings/${id}`);
};

export const createClosingTrading = async (input) => {
  return await axios.post(`/closing-tradings`, input);
};

export const getClosingTradings = async (input) => {
  const query = qs.stringify(removeEmpty(input));
  return await axios.get(`/closing-tradings?${query}&_limit=100`);
};

export const editClosingTrading = async (id, input) => {
  return await axios.put(`/closing-tradings/${id}`, input);
};

export const deleteClosingTrading = async (id) => {
  return await axios.delete(`/closing-tradings/${id}`);
};

export const createIntradayTrading = async (input) => {
  return await axios.post(`/intraday-tradings`, input);
};

export const getIntradayTradings = async (input) => {
  const query = qs.stringify(removeEmpty(input));
  return await axios.get(`/intraday-tradings?${query}&_limit=100`);
};

export const editIntradayTrading = async (id, input) => {
  return await axios.put(`/intraday-tradings/${id}`, input);
};

export const deleteIntradayTrading = async (id) => {
  return await axios.delete(`/intraday-tradings/${id}`);
};

export const getListInfo = async (id, category) => {
  if (category === '시초먹기') {
    return await axios.get(`/opening-tradings/${id}`);
  } else if (category === '내일먹기') {
    return await axios.get(`/closing-tradings/${id}`);
  } else if (category === '장중먹기') {
    return await axios.get(`/intraday-tradings/${id}`);
  }
};

export const createStocks = async (input) => {
  return await axios.post(`/hankyung-stocks`, input);
};

export const editStocks = async (id, input) => {
  return await axios.put(`/hankyung-stocks/${id}`, input);
};
