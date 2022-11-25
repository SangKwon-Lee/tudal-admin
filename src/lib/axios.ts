import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const { REACT_APP_API_URL, REACT_APP_CMS_URL, REACT_APP_CMS_TOKEN } =
  process.env;

export const CMSURL = REACT_APP_CMS_URL
  ? REACT_APP_CMS_URL
  : 'https://cms.tudal.co.kr';
export const CMS_TOKEN = REACT_APP_CMS_TOKEN
  ? REACT_APP_CMS_TOKEN
  : 'xnwkdmlekfdlsuser@020';
export const APIURL = REACT_APP_API_URL;

console.log(REACT_APP_CMS_URL, REACT_APP_CMS_TOKEN);
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
