import axios from 'src/lib/axios';

export const postOneImage = async (input) => {
  return axios.post(`/settings/hidden-report/banners`, input);
};

export const getBanners = async () => {
  return axios.get(`/settings/hidden-report/banners`);
};

export const putBanner = async (input) => {
  return axios.put(`/settings/hidden-report/banners`, input);
};
