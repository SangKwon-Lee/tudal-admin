import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';

export const createTudalusContents = async (input) => {
  return await axios.post(`/tudal-us-contents`, input);
};

export const getTudalusContents = async (input) => {
  return await axios.get(`/tudal-us-contents/${input}`);
};

export const editTudalusContents = async (id, input) => {
  return await axios.put(`/tudal-us-contents/${id}`, input);
};

export const getTudalusContentsList = async (param) => {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(`/tudal-us-contents?${query}`);
};

export const getTudalusContentsListCount = async (param) => {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(`/tudal-us-contents/count?${query}`);
};

export const deleteTudalusContents = async (id) => {
  return await axios.delete(`/tudal-us-contents/${id}`);
};
