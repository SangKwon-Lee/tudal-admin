import { INews } from './news';
import { Tag } from './schedule';
import { IUser } from './user';

export interface IStockTags {
  id: number;
  stock_id: number;
  tag_id: number;
  value: number;
  created_at: Date;
  updated_at: Date;
  stock: IStockDetails;
  tag: Tag;
}

export interface IStockComment {
  id: number;
  message: string;
  datetime: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  stock: IStockDetails;
  author: IUser;
}

export interface IStockDetails {
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
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  short: boolean;
  sector_us: string;
  oneshot_total_strategy: string;
  in_code: string;
  in_name: string;
}

export interface IStockDetailsWithTag extends IStockDetails {
  tags: Tag[];
}

export interface IStockDetailsWithTagCommentNews
  extends IStockDetails {
  tags: Tag[];
  comments: IStockComment[];
  news: INews[];
}
