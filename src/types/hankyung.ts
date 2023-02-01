export interface TripleA {
  capturePrice: number;
  captureTime: string;
  close: number;
  createdAt: string;
  groupId: string;
  high: number;
  high3m: number;
  high52w: number;
  jnilclose: number;
  keywords: string[];
  low: number;
  low52w: number;
  marketCap: number;
  open: number;
  ratio: number;
  ratio3mByCapturePrice: number;
  ratioByCapturePrice: number;
  sectorCode: string;
  sectorName: string;
  stockCode: string;
  stockName: string;
  updatedAt: string;
  volume: number;
}

export interface HankyungList {
  category: string;
  comment: string;
  created_at: string;
  id: number;
  title: string;
  updated_at: string;
  stocks: HankyungStocks[];
}

export interface HankyungStocks {
  closePrice: number;
  created_at: string;
  diff: number;
  highPrice: number;
  highRatio: number;
  id: number;
  idea: string;
  lowPrice: number;
  openPrice: number;
  opening_trading: number;
  price: number;
  recoPrice: number;
  standardPrcie: number;
  stockCode: string;
  stockName: string;
  stoplossPrice: number;
  targetPrice: number;
  updated_at: string;
  code?: string;
  name?: string;
  stockcode?: string;
  stockname?: string;
}
