import axios from 'src/lib/axios';

export const getUsers = () => {
  return axios.get(`/users`);
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
