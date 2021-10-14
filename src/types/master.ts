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
  master_room?: Room;
  contents?: string;
  isDeleted?: boolean;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: number;
  created_at: Date;
  updated_at: Date;
  nickname: string;
  type: string;
  isHiddenboxAvailable: boolean;
  isMasterAvailable: boolean;
  cpLevel: number;
  avatar: string;
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
  master: IUser;
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
  openType?: string;
  order?: number;
  isDeleted?: boolean;
  master?: any;
  master_channel?: any;
}

export interface IMasterChannel {
  id?: number;
  name?: string;
  master?: string;
  created_at?: string;
  updated_at?: string;
  master_rooms?: [];
}

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
  master_room?: Room;
  contents?: string;
  isDeleted?: boolean;
}

export interface Master {
  id?: number;
  title?: string;
  author?: any;
  expert?: string;
  description?: string;
  image?: string;
  link?: string;
  msgId?: string;
  source?: string;
  tags?: any;
  thumbnail?: [];
  type?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
  likes?: [];
  viewCount?: string;
  master_feed_histories?: [];
  master_feed_likes?: [];
  master_room?: any;
  contents?: string;
  external_link?: string;
  master?: any;
  stocks?: any;
  master_channels?: [];
  isDeleted?: boolean;
}

export interface Room {
  id?: number;
  title?: string;
  author?: string;
  openType?: string;
  order?: number;
  isDeleted?: boolean;
  master?: any;
  master_channel?: any;
}

export interface Channel {
  id?: number;
  name?: string;
  master?: string;
  created_at?: string;
  updated_at?: string;
  master_rooms?: [];
}

export interface IMasterFeedLikes {
  id: number;
  userId: number;
  master_feed: IMasterFeed;
}
