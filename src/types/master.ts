import { expirationDate } from 'src/utils/expirationDate';
import { IStockDetails } from './stock';
import { Tag } from './schedule';

export interface Expert {
  id?: number;
  title?: string;
  author?: any;
  expert?: string;
  description?: string;
  image?: string;
  link?: string;
  msgId?: string;
  source?: string;
  tags?: [];
  thumbnail?: [];
  type?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
  likes?: [];
  viewCount?: string;
  master_feed_histories?: [];
  master_feed_likes?: [];
  master_room?: IMasterRoom;
  contents?: string;
  isDeleted?: boolean;
}

export interface IMasterFeed {
  id: number;
  title: string;
  description: string;
  source: string;
  msgId: string;
  url: string;
  datetime: Date;
  viewCount: string;
  isDeleted: boolean;
  master_room: IMasterRoom;
  master: IMaster;
  created_at: string;
  updated_at: string;
  stocks: IStockDetails[];
  tags: Tag[];
  mater_feed_images: IMasterFeedImage[];

  master_feed_likes: [];
}

export interface IMasterRoom {
  id?: number;
  title?: string;
  author?: string;
  type?: string;
  order?: number;
  isDeleted?: boolean;
  master?: IMaster;
  master_channel?: any;
}

export interface IMasterFeedLikes {
  id: number;
  userId: number;
  master_feed: IMasterFeed;
}

export interface IMasterSubscription {
  // * 22-07-04 debugging CSubnumchart Logic. Currently showing -1 index.
  id: number;
  userId?: number;
  masterId?: number;
  startDate?: Date;
  endData?: string;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
  master: IMaster;
  isSub: number;
}

export interface IMaster {
  id: number;
  intro: string;
  keyword: string;
  nickname: string;
  profile_image_url: string;
  user: number;
  master_rooms?: IMasterRoom[];
  price_gold: number;
  catchphrase: string;
  subscription_days: number;
  type: string;
  created_at: Date;
  group: string;
  updated_at: Date;
}

export interface IMasterCreateForm {
  id?: number | string;
  nickname: string;
  profile_image_url: string;
  price_gold: number;
  subscription_days: number;
  profile: string;
  keyword: string;
  user?: any;
  created_at?: string;
  catchphrase: string;
  type: 'free' | 'paid';
  group: string;
  intro: any;
}

export interface IMasterFeedImage {
  image_url: string;
  master_feed: IMasterFeed;
}

export interface IMasterNotice {
  title: string;
  id: number;
  contents: string;
  master: any;
  created_at?: string;
  summary: string;
  type: string;
}

export interface IMasterPayment {
  id: number;
  master?: number;
  userId: number;
  startDate: string;
  endDate: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface IMasterReporter {
  id: string;
  title: string;
  price: number;
  pdfURL?: string;
  contents?: string;
  expirationDate: string;
  readingTime: number;
  reason: string;
  intro: string;
  subject: string;
  type: string;
  master_id: number;
  hidden_report_image: number;
  summary: string;
  catchphrase?: string;
  counter: string;
  strategy?: string;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}
