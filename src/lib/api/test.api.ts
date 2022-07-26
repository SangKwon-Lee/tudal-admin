import axios from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';

export const createTest = async (input) => {
  return axios.post(`/tests`, input);
};
export const getTestList = async (param) => {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(`/tests?${query}`);
};

export async function getTestListLength(param?) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(`/tests/count?${query}`);
}

export const getTest = async (testId) => {
  return await axios.get(`/youtubes/${testId}`);
};

export const putTest = async (input, testId) => {
  return await axios.put(`/youtubes/${testId}`, input);
};

export const deleteTest = async (testId) => {
  return await axios.delete(`/tests/${testId}`);
};
