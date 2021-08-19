import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const {
  REACT_APP_CMS_TOKEN,
  REACT_APP_CMS_URL,
  REACT_APP_API_URL,
  REACT_APP_DEV_CMS_URL,
} = process.env;

export const CMSURL =
  process.env.NODE_ENV === 'development'
    ? REACT_APP_DEV_CMS_URL
    : REACT_APP_CMS_URL;

export const CMS_TOKEN = REACT_APP_CMS_TOKEN;
export const APIURL = REACT_APP_API_URL;

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

export const mock = new AxiosMockAdapter(axiosInstance, {
  delayResponse: 0,
});

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
