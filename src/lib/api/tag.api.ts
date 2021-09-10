import { AxiosResponse } from 'axios';
import qs from 'qs';
import axios from 'src/lib/axios';
import { Tag } from 'src/types/schedule';

export async function getList(
  search: string,
  start: number = 0,
  limit: number = 100,
) {
  const q: any = { _limit: limit, _start: start };
  if (search) {
    q._q = search;
  }
  return await axios.get<Tag[]>('/tags?' + qs.stringify(q));
}

export async function postItem(
  name: string,
): Promise<AxiosResponse<Tag>> {
  return await axios.post('/tags', { name });
}

export async function postItems(name: string[]): Promise<Tag[]> {
  const promises = name.map((name) =>
    axios.post<Tag>('/tags', { name }),
  );

  return await Promise.all(promises).then((responses) => {
    return responses.map((response) => {
      return response.data;
    });
  });
}

export async function update(
  id: number,
  name: string,
): Promise<AxiosResponse<Tag>> {
  return await axios.put<Tag>(`/tags/${id}`, { name });
}

export async function remove(
  id: number,
): Promise<AxiosResponse<Tag>> {
  return await axios.delete<Tag>(`/tags/${id}`);
}

export async function findKeywords(tags: string[]): Promise<Tag[]> {
  const promises = tags.map((tag) => {
    return axios.get(`/tags-excluded?_where[name]=${tag}`);
  });

  return await Promise.all(promises).then((response) => {
    return response
      .filter((response) => response.data.length === 1)
      .map((response) => response.data[0]);
  });
}
