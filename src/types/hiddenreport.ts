import { IMaster } from './master';
import { Stock, Tag } from './schedule';

export interface IHR {
  readingTime: number;
  id: number;
  title: string;
  price: number;
  subject: string; // 대상 (카테고리)
  type: string; // 유형 (카테고리)
  counter: string; // 대응 전략 (카테고리)
  intro: string;
  catchphrase: string;
  summary: string;
  reason: string;
  contents: string;
  created_at?: Date;
  updated_at?: Date;
  expirationDate: Date;
  pdfUrl: string;
  hidden_report_image: IHRImage;
  hidden_report_views?: [];
  tags: Tag[];
  stocks: Stock[];
  hidden_report_orders: [];
  hidden_report_likes: [];
  hidden_report_comments: IHRComment[];
  hidden_reporter: IHiddenReporter;
  master_id?: IMaster;
  numOfLikes: number;
  numOfOrders: number;
  numOfViews: number;
}

export interface IHiddenReporter {
  id?: number | string;
  nickname: string;
  intro: string;
  imageUrl: string;
  tudalRecommendScore?: number;
  catchphrase: string;
  user?: any;
  created_at?: string;
}

export interface IHRImage {
  id: number;
  name: string;
  thumbnailImageUrl: string;
  squareImageUrl: string;
  keyword: string;
  created_at: Date;
  updated_at: Date;
}

export interface IHROrders {
  id: number;
  hidden_report: IHR;
  userId: string;
  created_at: Date;
  updated_at: Date;
}

export interface IHRComment {
  id: number;
  hidden_report: number;
  userId: string;
  comment: string;
  parentId: string;
  created_at: string;
  updated_at: string;
}
