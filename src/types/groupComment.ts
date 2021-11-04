import { User } from './user';

export interface GroupDetail {
  id: number;
  user_id: number;
  name: string;
  show: boolean;
  numStocks: number;
  order: number;
  created_at: string;
  updated_at: string;
  description: string;
  premium: boolean;
}

export interface GroupComment {
  id: number;
  user: User;
  tudal_group: GroupDetail;
  comment: string;
  published_at: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}
