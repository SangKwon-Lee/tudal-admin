import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';

export const createSideBanner = async (input) => {
  return axios.post(`/side-banners`, input);
};

export const getSideBannerList = async (param) => {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(`/side-banners?${query}`);
};

export async function getSideBannerListLength(param?) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(`/side-banners/count?${query}`);
}

export const getSideBanner = async (bannerId) => {
  return await axios.get(`/side-banners/${bannerId}`);
};

export const putSideBanner = async (input, bannerId) => {
  return await axios.put(`/side-banners/${bannerId}`, input);
};

export const deleteSideBanner = async (bannerId) => {
  return await axios.delete(`/side-banners/${bannerId}`);
};
