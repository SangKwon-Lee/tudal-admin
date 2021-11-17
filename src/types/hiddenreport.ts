import { CP_Hidden_Reporter } from './cp';
import { Stock, Tag } from './schedule';

export interface IHR {
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
  hidden_report_comments: [];
  hidden_reporter: CP_Hidden_Reporter;
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
