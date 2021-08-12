import qs from 'qs';
import axios from 'src/lib/axios';
import { INews } from 'src/types/news';

export async function getList(search: string, start?: number) {
  let q: any = {};
  if (search) {
    q._q = search;
  }
  if (start) {
    q._start = start;
  }
  return await axios.get<INews[]>(
    `/general-news?_sort=publishDate:DESC&${qs.stringify(q)}`,
  );
}

export async function updateIsSelected(
  id: number,
  isSelected: boolean,
) {
  return await axios.put(`/general-news/${id}`, {
    isSelected: !isSelected,
  });
}

export async function deleteItem(id: number) {
  return await axios.delete<INews>(`/schedules/${id}`);
}
