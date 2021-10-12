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
