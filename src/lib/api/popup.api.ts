import axios from 'src/lib/axios';
import { removeEmpty } from 'src/utils/helper';
import qs from 'qs';

export async function createPopUp(popup) {
  return axios.post(`/popups`, popup);
}

export async function getPopUp(id) {
  return axios.get(`/popups/${id}`);
}
