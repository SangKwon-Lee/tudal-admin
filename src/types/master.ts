import { IStockDetails } from './stock';
import { Tag } from './schedule';
import { IUser } from './user';
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
  contents: string;
  source: string;
  msgId: string;
  external_link: string;
  viewCount: string;
  isDeleted: boolean;
  master_room: IMasterRoom;
  master: IMaster;
  created_at: string;
  updated_at: string;
  stocks: IStockDetails[];
  tags: Tag[];
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

export interface IMasterChannel {
  id?: number;
  name?: string;
  master?: IMaster;
  created_at?: string;
  updated_at?: string;
  master_rooms?: IMasterRoom[];
}

export interface IMasterFeedLikes {
  id: number;
  userId: number;
  master_feed: IMasterFeed;
}

export interface IMasterSubscription {
  userId?: number;
  masterId?: number;
  startDate?: Date;
  endData?: string;
}

export interface IMaster {
  id: number;
  intro: string;
  keyword: string;
  nickname: string;
  profile_image_url: string;
  user: number;
  created_at: Date;
  updated_at: Date;
}
