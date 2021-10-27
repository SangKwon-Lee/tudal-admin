import axios from 'src/lib/axios';
import { removeEmpty } from 'src/utils/helper';
import qs from 'qs';
import { IPopUp } from 'src/types/popup';

export async function getList(params) {
  let query = qs.stringify(removeEmpty(params));
  return await axios.get<IPopUp[]>(`/popups?${query}`);
}

export async function getOpenList() {
  return await axios.get<IPopUp[]>(
    `/popups?isOpen=true&_sort=order:asc`,
  );
}

export async function getCount(params) {
  let query = qs.stringify(removeEmpty(params));
  return await axios.get<IPopUp[]>(`/popups/count?${query}`);
}
export async function createPopUp(popup) {
  return axios.post(`/popups`, popup);
}

export async function getPopUp(id) {
  return axios.get(`/popups/${id}`);
}

export async function editPopup(id, body) {
  return axios.put(`/popups/${id}`, body);
}
