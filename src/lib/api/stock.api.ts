import qs from 'querystring';
import { cmsServer, apiServer } from 'src/lib/axios';
import { Stock } from 'src/types/schedule';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';

export async function getList() {
  const { data, status } = await apiServer.get<Stock[]>('/stocks/stkNmCd');
  data.forEach((stock) => {
    stock.code = stock.stockcode;
    stock.name = stock.stockname;
  });

  return { data, status };
}

export async function getListDetails(query = {}) {
  const queryParams = qs.stringify(query);

  try {
    const { data, status } = await cmsServer.get(`/stocks?relations=tags&${queryParams}`);

    if (status === 200) {
      data.forEach(async (stock) => {
        const { data: comments } = await getStockComments(stock.id);
        const { data: stockNews } = await getStockNews(stock.id);

        stock.news = stockNews.news || [];
        stock.comments = comments || [];
      });
    }

    return { data, status };
  } catch (error) {
    console.log(error);
  }
}

export async function getStockComments(stockId) {
  return await cmsServer.get(`/stock-comments?_where[stock]=${stockId}`);
}

export async function getStockNews(stockId) {
  return await cmsServer.get(`/stock-news-detail?_where[stockcode]=${stockId}`);
}
