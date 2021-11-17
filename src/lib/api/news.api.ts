import qs from 'qs';
import axios from 'src/lib/axios';
import { INews, INewsComment } from 'src/types/news';
import { removeEmpty } from 'src/utils/helper';

export async function getNews(newsId) {
  return await axios.get<INews>(
    `/general-news-with-stocks?_where[id]=${newsId}`,
  );
}

export async function getList(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<INews[]>(
    `/general-news-with-stocks?${query}`,
  );
}
export async function getListCount(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<INews[]>(`/general-news/count?${query}`);
}

export async function getComments(newsId: number) {
  return await axios.get<INews[]>(
    `/general-news-comments?_where[general_news]=${newsId}`,
  );
}

export async function updateIsSelected(
  id: number,
  isSelected: boolean,
  user_id: number,
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
  stockcode: string,
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

export async function addTags(id, tagIds: number[]) {
  return await axios.put(`/general-news/tags/${id}`, {
    tags: tagIds,
  });
}

export async function addCategories(id, categories: number[]) {
  return await axios.put(`/general-news/categories/${id}`, {
    categories,
  });
}

export async function update(id, body) {
  return await axios.put(`/general-news/${id}`, body);
}

export async function createAndSelectByHand(news, author) {
  return await axios.post<INews>('/general-news', {
    ...news,
    isSelected: true,
    isSelectedBy: author,
  });
}

export async function createAndSelectByURL(
  url,
  publishDate,
  stockcode,
  author,
) {
  return await axios.post(`/general-news/custom`, {
    url,
    publishDate,
    stockcode,
    author,
    source: 'manual',
  });
}
