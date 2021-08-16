import { Category, Stock, Tag } from './schedule';
import { User } from './user';

export interface INews {
  id: number;
  url: string;
  title: string;
  mediaName: string;
  publishDate: string;
  summarized: string;
  source: string;
  created_at: Date;
  updated_at: Date;
  newsId: string;
  photo: string;
  officeId: string;
  tags: Tag[];
  isSelected: boolean;
}

interface ISimpleNews {
  id: number;
  url: string;
  title: string;
  mediaName: string;
  publishDate: string;
  summarized: string;
  source: string;
  created_at: string;
  updated_at: string;
  newsId: string;
  photo: string;
  officeId: string;
  isSelected: boolean;
}

export interface INewsComment {
  id: number;
  general_news: ISimpleNews;
  comment: string;
  author: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    role: number;
    created_at: string;
    updated_at: string;
    nickname: string;
    avatar: string;
  };
  created_at: string;
  updated_at: string;
  keywords: Tag[];
  stocks: {
    id: number;
    code: string;
    name: string;
    category: string;
    per: number;
    pbr: number;
    marketCap: number;
    avgVolume: string;
    perCompEst: string;
    pbrCompEst: string;
    perComp: number;
    pbrComp: number;
    mainSupply: string;
    shortTrend: string;
    created_at: string;
    updated_at: string;
    short: boolean;
    sector_us: string;
    oneshot_total_strategy: string;
  }[];
  categories: Category[];
}
