import { AxiosResponse } from 'axios';
import axios from 'src/lib/axios';
import { Category } from 'src/types/schedule';

export async function getList() {
  return await axios.get(`/categories`);
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
