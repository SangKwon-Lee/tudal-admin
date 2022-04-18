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
  return axios.get(`/users?masters_null=true`);
};

export const getUsersNoReporter = () => {
  return axios.get(`/users?hidden_reporter_null=true`);
};

export const getCpUsers = (params) => {
  let query = qs.stringify(removeEmpty(params));
  return axios.get(`/users?${query}`);
};

export const getCpUsersLegnth = (params) => {
  let query = qs.stringify(removeEmpty(params));
  return axios.get(`/users/count?${query}`);
};

//* 달인
export const postMaster = (input) => {
  return axios.post(`/masters`, input);
};

export const putMaster = (masterId, input) => {
  return axios.put(`/masters/${masterId}`, input);
};

export const getMaster = (masterId) => {
  return axios.get(`/masters/${masterId}`);
};

export const searchMasters = (params) => {
  let query = qs.stringify(removeEmpty(params));

  return axios.get(`/masters?${query}`);
};

//* 히든 리포터
export const getReporter = (reporterId) => {
  return axios.get(`/hidden-reporters/${reporterId}`);
};

export const searchReporter = (params) => {
  let query = qs.stringify(removeEmpty(params));

  return axios.get(`/hidden-reporters?${query}`);
};

export const postReporter = (input) => {
  return axios.post(`/hidden-reporters`, input);
};

export const putReporter = (reporterId, input) => {
  return axios.put(`/hidden-reporters/${reporterId}`, input);
};

//* cp 계정
export const postCp = (input) => {
  return axios.post(`/users`, input);
};

//* CP 문의사항
export const getQandA = (id) => {
  return axios.get(`/cp-question-answers/${id}`);
};

export const getQandAList = (params, filter, user) => {
  const query = qs.stringify(
    removeEmpty({ ...params, writer: user }),
  );
  return axios.get(
    `/cp-question-answers?${query}&${filter}&isAnswer=false`,
  );
};

export const getQandALength = (params, filter) => {
  const query = qs.stringify(removeEmpty(params));
  return axios.get(
    `/cp-question-answers/count?${query}&${filter}&isAnswer=false`,
  );
};

export const postQandA = (body) => {
  return axios.post(`/cp-question-answers`, body);
};
export const putQandA = (id, body) => {
  return axios.put(`/cp-question-answers/${id}`, body);
};
