import axios from 'src/lib/axios';

export const postOneImage = async (input) => {
  return axios.post(`/settings/master-report/banners`, input);
};

export const getBanners = async () => {
  return axios.get(`/settings/master-report/banners`);
};

export const putBanner = async (input) => {
  return axios.put(`/settings/master-report/banners`, input);
};
