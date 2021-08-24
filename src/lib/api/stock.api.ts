import qs from 'qs';
import { cmsServer, apiServer } from 'src/lib/axios';
import { Stock } from 'src/types/schedule';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';

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
