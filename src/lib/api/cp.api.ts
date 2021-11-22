import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';

//* 유저 관련
export const getUsers = () => {
  return axios.get(`/users`);
};

export const getUser = (id) => {
  return axios.get(`/users/${id}`);
};

export const getUsersNoMaster = () => {
  return axios.get(`/users?master_null=true`);
};

export const getUsersNoReporter = () => {
  return axios.get(`/users?hidden_reporter_null=true`);
};

export const getCpUsers = (params, filter) => {
  let query = qs.stringify(removeEmpty(params));
  return axios.get(`/users?${query}&${filter}`);
};

export const getCpUsersLegnth = (params, filter) => {
  let query = qs.stringify(removeEmpty(params));
  return axios.get(`/users/count?${query}&${filter}`);
};

//* 달인
export const postMaster = (input) => {
  return axios.post(`/masters`, input);
};

export const putMaster = (masterId, input) => {
  return axios.put(`/masters/${masterId}`, input);
};

export const getMaster = (masterId) => {
  return axios.get(`masters/${masterId}`);
};

//* 히든 리포터
export const postReporter = (input) => {
  return axios.post(`/hidden-reporters`, input);
};

export const getReporter = (reporterId) => {
  return axios.get(`/hidden-reporters/${reporterId}`);
};

export const putReporter = (reporterId, input) => {
  return axios.put(`/hidden-reporters/${reporterId}`, input);
};

//* cp 계정
export const postCp = (input) => {
  return axios.post(`/users`, input);
};

//* 달인 채널 생성
export const postMasterChannel = (input) => {
  return axios.post(`/master-channels`, input);
};
