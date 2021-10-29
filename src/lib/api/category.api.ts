import { AxiosResponse } from 'axios';
import axios from 'src/lib/axios';
import qs from 'qs';
import { Category } from 'src/types/schedule';
import { removeEmpty } from 'src/utils/helper';

export async function get(name: string) {
  return await axios.get<Category[]>(`/categories?name=${name}`);
}

export async function getList(params) {
  let query = qs.stringify(removeEmpty(params));
  return await axios.get<Category[]>(`/categories?${query}`);
}

export async function getListLength() {
  return await axios.get(`/categories/count`);
}

export async function postItem(
  name: string,
): Promise<AxiosResponse<Category>> {
  return await axios.post('/categories', { name });
}

export async function postItems(name: string[]): Promise<Category[]> {
  const promises = name.map((name) =>
    axios.post<Category>('/categories', { name }),
  );
  return await Promise.all(promises).then((responses) => {
    return responses.map((response) => {
      return response.data;
    });
  });
}

export async function update(
  id,
  body,
): Promise<AxiosResponse<Category>> {
  return await axios.put(`/categories/${id}`, body);
}

export async function remove(id): Promise<AxiosResponse<Category>> {
  return await axios.put(`/categories/${id}`, { isDeleted: true });
}
