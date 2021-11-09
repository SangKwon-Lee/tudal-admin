import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';

export const getUsers = () => {
  return axios.get(`/users`);
};

export const getCpUsers = (params, filter) => {
  let query = qs.stringify(removeEmpty(params));
  return axios.get(`/users?${query}&${filter}`);
};

export const getCpUsersLegnth = (params, filter) => {
  let query = qs.stringify(removeEmpty(params));
  return axios.get(`/users/count?${query}&${filter}`);
};

export const postMaster = (input) => {
  return axios.post(`/masters`, input);
};

export const putMaster = (masterId, input) => {
  return axios.put(`/masters/${masterId}`, input);
};

export const postReporter = (input) => {
  return axios.post(`/hidden-reporters`, input);
};

export const getMaster = (masterId) => {
  return axios.get(`masters/${masterId}`);
};

export const getReporter = (reporterId) => {
  return axios.get(`/hidden-reporters/${reporterId}`);
};

export const putReporter = (reporterId, input) => {
  return axios.put(`/hidden-reporters/${reporterId}`, input);
};
