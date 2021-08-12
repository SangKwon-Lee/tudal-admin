import { Tag } from './schedule';

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
