import qs from 'qs';
import { cmsServer, apiServer } from 'src/lib/axios';
import { Stock } from 'src/types/schedule';

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

export async function getDetails(stockcode: string) {
  console.log('stockcode', stockcode);
  return await cmsServer.get(
    `/stocks/summary?_where[code]=${stockcode}`,
  );
}
export async function getListDetails(
  search: string,
  start: number = 0,
) {
  let _query: any = { _start: start };
  if (search) {
    _query._q = search;
  }

  return await cmsServer.get(
    `/stocks/summary?_limit=30&${qs.stringify(_query)}`,
  );
}

export async function getStockComments(stockcode, query = {}) {
  const _query = qs.stringify(query);
  return await cmsServer.get(
    `/stock-comments?_where[stock]=${stockcode}&${_query}`,
  );
}

export async function getStockNews(stockcode, query = {}) {
  const _query = qs.stringify(query);
  return await cmsServer.get(
    `/stock-news-detail?_where[stockcode]=${stockcode}&${_query}`,
  );
}

export async function updateStockTag(stockcode, tagName) {
  return await cmsServer.post(`/stocks/code/${stockcode}/tag`, {
    tagName: tagName,
  });
}

export async function postStockComment(
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

export async function deleteTag(code: string, tagId: number) {
  return await cmsServer.delete(`/stocks/code/${code}/tag/${tagId}`);
}
