import qs from 'qs';
import { cmsServer, apiServer } from 'src/lib/axios';
import { Stock } from 'src/types/schedule';
import { removeEmpty } from 'src/utils/helper';

export async function getList() {
  const { data, status } = await apiServer.get<Stock[]>(
    '/stocks/stkNmCd',
  );
  data.forEach((stock) => {
    stock.code = stock.stockcode;
    stock.name = stock.stockname;
  });

  return { data, status };
}

export async function getSimpleList() {
  return await cmsServer.get<Stock[]>('/stocks?relations=&_limit=-1');
}

/** 종목 디테일 */
export async function getDetail(stockcode: string) {
  return await cmsServer.get(`/stocks/detail/${stockcode}`);
}

export async function getDetailList(params) {
  let query = qs.stringify(removeEmpty(params));
  return await cmsServer.get(`/stocks/detail?${query}`);
}

export async function getStockNews(stockcode, query = {}) {
  const _query = qs.stringify(query);
  return await cmsServer.get(
    `/stock-news-detail?_where[stockcode]=${stockcode}&${_query}`,
  );
}

/** 종목 코멘트 */
export async function postComment(
  message,
  stockcode,
  author,
  datetime,
) {
  return await cmsServer.post(`/stock-comments`, {
    message,
    stock: stockcode,
    author,
    datetime,
  });
}

export async function updateComment(id, body) {
  return await cmsServer.put(`/stock-comments/${id}`, body);
}

export async function deleteComment(id) {
  return await cmsServer.delete(`/stock-comments/${id}`);
}

/** 종목 태그 */
export async function getStockTags(page = 0, limit = 50) {
  return await cmsServer.get(
    `/stock-tags/latest?page=${page}&limit=${limit}`,
  );
}

export async function getStockTagsLength() {
  return await cmsServer.get(`/stock-tags/count`);
}
export async function createTag(stockcode, tagName) {
  return await cmsServer.put(`/stocks/code/${stockcode}/tag`, {
    tagName: tagName,
  });
}
export async function updateTag(stockcode, tagName) {
  return await cmsServer.post(`/stocks/code/${stockcode}/tag`, {
    tagName: tagName,
  });
}

export async function deleteTag(code: string, tagId: number) {
  return await cmsServer.delete(`/stocks/code/${code}/tag/${tagId}`);
}

//** 종목 코멘트 */

export async function getStockComment(start = 0, limit = 50) {
  return await cmsServer.get(
    `/stock-comments?_start=${start}&_limit=${limit}&_sort=created_at:DESC`,
  );
}

export async function getStockCommentLength(start = 0, limit = 50) {
  return await cmsServer.get(`/stock-comments/count`);
}
