export interface IHR {
  id: number;
  title: string;
  thumnail_text: string;
  price: number;
  category: string;
  intro: string;
  catchPhrase: string;
  summary: string;
  reason: string;
  contents: string;
  pdf_url: string;
  created_at: Date;
  updated_at: Date;
  expirationDate: Date;
  pdfUrl: string;
  hidden_report_image: IHRImage;
  hidden_report_views: [];
  tags: [];
  stocks: [];
  hidden_report_orders: [];
  hidden_report_likes: [];
  hidden_report_comments: [];
}

export interface IHRImage {
  id: number;
  name: string;
  thumbnailImageUrl: string;
  keyword: string;
  created_at: Date;
  updated_at: Date;
}
