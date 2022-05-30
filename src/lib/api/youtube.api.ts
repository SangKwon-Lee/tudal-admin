import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';

export const createYoutube = async (input) => {
  return axios.post(`/youtubes`, input);
};

export const getYoutubeList = async (param) => {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(`/youtubes?${query}`);
};

export async function getYoutubeListLength(param?) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(`/youtubes/count?${query}`);
}

export const getYoutube = async (youtubeId) => {
  return await axios.get(`/youtubes/${youtubeId}`);
};

export const putYoutube = async (input, youtubeId) => {
  return await axios.put(`/youtubes/${youtubeId}`, input);
};

export const deleteYoutube = async (youtubeId) => {
  return await axios.delete(`/youtubes/${youtubeId}`);
};
