import { AxiosResponse } from 'axios';
import axios from 'src/lib/axios';
import qs from 'qs';
import { Category } from 'src/types/schedule';

export async function getList(
  search: string,
  _start: number = 0,
  _limit: number = 100,
) {
  const q: any = { _start, _limit };
  if (search) {
    q._q = search;
  }
  return await axios.get<Category[]>(
    `/categories?` + qs.stringify(q),
  );
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
