import qs from 'qs';
import axios from 'src/lib/axios';
import { INews, INewsComment } from 'src/types/news';

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

export async function getComments(newsId: number) {
  return await axios.get<INews[]>(
    `/general-news-comments?_where[general_news]=${newsId}`,
  );
}

export async function updateIsSelected(
  id: number,
  isSelected: boolean,
  user_id: string,
) {
  return await axios.put(`/general-news/${id}`, {
    isSelected: !isSelected,
    selected_by: user_id,
  });
}

export async function createComment(comment) {
  return await axios.post<INewsComment>(
    `/general-news-comments`,
    comment,
  );
}

export async function deleteItem(id: number) {
  return await axios.delete<INews>(`/schedules/${id}`);
}
