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
  page: number,
  limit: number,
  search?: string,
) {
  let _query: any = { _start: (page + 1) * limit };
  if (search) {
    _query._q = search;
  }

  try {
    const { data, status } = await cmsServer.get(
      `/stocks?relations=tags&_limit=60&${qs.stringify(_query)}`,
    );

    if (status === 200) {
      for (let i = 0; i < data.length; i++) {
        const { data: comments } = await getStockComments(
          data[i].code,
        );
        const { data: stockNews } = await getStockNews(data[i].code, {
          _limit: 5,
        });

        data[i].news = stockNews.map((entity) => entity.news) || [];
        data[i].comments = comments || [];
      }
    }
    return { data, status };
  } catch (error) {
    console.log(error);
  }
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
