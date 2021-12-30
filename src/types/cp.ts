import { IUser } from './user';

export interface CP_Master {
  id?: number | string;
  nickname: string;
  profile_image_url: string;
  intro: string;
  keyword: string;
  user: any;
  created_at?: string;
  type: 'free' | 'paid';
}

export interface CP_Hidden_Reporter {
  id?: number | string;
  nickname: string;
  intro: string;
  imageUrl: string;
  tudalRecommendScore?: number;
  catchphrase: string;
  user?: any;
  created_at?: string;
}

export interface ICPQuestion {
  id: number;
  title: string;
  category: string;
  description: string;
  isAnswer: boolean;
  isCompleted: boolean;
  answeredBy: IUser;
  writer: IUser;
  created_at: Date;
  updated_by: Date;
  answers: ICPQuestion[];
}
