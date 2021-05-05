import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const axiosInstance = axios.create({
  baseURL: 'http://103.244.108.203:1337/',
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((
    error.response && error.response.data
  ) || `Something went wrong`)
);

export const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 0 });

const pureAxiosInstance = axios.create({
  baseURL: 'http://103.244.108.203:1337/',
});

pureAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((
    error.response && error.response.data
  ) || `Something went wrong`)
);


export const token = 'sbcnepqm22@0';
export default pureAxiosInstance;