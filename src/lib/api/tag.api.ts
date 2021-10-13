import { AxiosResponse } from 'axios';
import qs from 'qs';
import { IKeywordListStatus } from 'src/components/dashboard/keyword/KeywordList.Container';
import axios from 'src/lib/axios';
import { Tag } from 'src/types/schedule';
import { removeEmpty } from 'src/utils/helper';

export async function find(name) {
  return await axios.get<Tag[]>(`/tags?name=${name}`);
}

export async function getList(params: IKeywordListStatus) {
  const query = qs.stringify(removeEmpty(params));
  return await axios.get<Tag[]>(`/tag-excluded?${query}`);
}

export async function getListCount() {
  return await axios.get<Number>(`/tags/count`);
}

export async function getItem(id: number) {
  const q: any = { id, _alias: true };
  return await axios.get<Tag[]>('/tags?' + qs.stringify(q));
}

export async function postItem(
  name: string,
): Promise<AxiosResponse<Tag>> {
  return await axios.post('/tags', { name });
}

export async function postAlias(tagId: number, aliasName: string) {
  return await axios.post('/tag-aliases', { tagId, aliasName });
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
  body: object,
): Promise<AxiosResponse<Tag>> {
  return await axios.put<Tag>(`/tags/${id}`, body);
}

export async function remove(
  id: number,
): Promise<AxiosResponse<Tag>> {
  return await axios.delete<Tag>(`/tags/${id}`);
}

export async function removeAlias(tagId: number) {
  return await axios.delete(`/tag-aliases/${tagId}`);
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
