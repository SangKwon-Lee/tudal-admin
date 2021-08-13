import axios from 'axios';

export const CMSURL = 'http://103.244.108.203:1337';
export const CMS_TOKEN = 'sbcnepqm22@0';
export const APIURL = 'http://103.244.108.41:3000/api';

const axiosInstance = axios.create({
  baseURL: CMSURL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) ||
        `Something went wrong`,
    ),
);

export const apiServer = axios.create({
  baseURL: APIURL,
});

export const cmsServer = axios.create({
  baseURL: CMSURL,
});

apiServer.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) ||
        `Something went wrong`,
    ),
);

const pureAxiosInstance = axios.create({
  baseURL: CMSURL,
});

pureAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) ||
        `Something went wrong`,
    ),
);

export default pureAxiosInstance;
