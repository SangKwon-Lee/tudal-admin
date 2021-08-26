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
  const response = await axios.get<INews[]>(
    `/general-news-with-stocks?_sort=publishDate:DESC&${qs.stringify(
      q,
    )}`,
  );

  return response;
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
    isSelectedBy: user_id,
  });
}

export async function createComment(comment) {
  return await axios.post<INewsComment>(
    `/general-news-comments`,
    comment,
  );
}

export async function deleteByStockAndNews(
  stockcode: number,
  newsId: number,
) {
  return await axios.delete(
    `/stock-news?${qs.stringify({ stockcode, newsId })}`,
  );
}

export async function createStockNews(
  stockcode: string,
  stockname: string,
  newsId: number,
) {
  return await axios.post(`/stock-news-original`, {
    newsId,
    stockcode,
    keyword: stockname,
  });
}

export async function update(id, body) {
  return await axios.put(`/general-news/${id}`, body);
}

export async function postOrSelectCustomNews(url, stockcode, author) {
  return await axios.post(`/general-news/custom`, {
    url,
    stockcode,
    author,
  });
}
