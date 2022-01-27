import { IUser } from './user';

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
