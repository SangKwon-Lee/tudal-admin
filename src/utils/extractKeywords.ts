import { Stock } from 'src/types/schedule';
import { findKeywords } from 'src/lib/api/tag.api';

export const tokenize = (sentence: string) => {
  if (typeof sentence !== 'string') return false;
  return sentence
    .replace(/\n/g, ' ')
    .replace(/,/g, ' ')
    .replace(/&/g, ' ')
    .split(' ')
    .filter((token) => Boolean(token));
};

export const extractStocks = (stocks, tokenized: string[]) => {
  const extractedStocks = [];
  const createStockNameMap = (stockList: Stock[]) => {
    let map = {};
    for (let stock of stockList) {
      map[stock.stockname] = stock;
    }
    return map;
  };
  const stockMap = createStockNameMap(stocks);

  for (let i = tokenized.length; i >= 0; i--) {
    if (stockMap[tokenized[i]]) {
      extractedStocks.push(stockMap[tokenized[i]]);
      tokenized.splice(i, 1);
      continue;
    }
  }
  return { extractedStocks, tokenized };
};

export const extractKeywords = async (tokens) => {
  return await findKeywords(tokens);
};
