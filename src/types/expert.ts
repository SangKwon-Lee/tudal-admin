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

export interface Room {
  id?: number;
  title?: string;
  author?: string;
  openType?: string;
  order?: number;
  isDeleted?: boolean;
}
