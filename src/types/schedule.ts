export interface Tag {
  id: number;
  name: string;
  isNew?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  code?: string;
  name?: string;
  stockcode?: string;
  stockname?: string;
}

export interface Category {
  id: number;
  name: string;
  isNew?: boolean;
}

export enum Priority {
  LOW = 1,
  MIDDLE = 3,
  HIGH = 5,
}
export interface Schedule {
  id: number;
  title: string;
  author: {
    id: number;
    email: string;
    username: string;
    avatar: string;
    blocked: boolean;
    confirmed: boolean;
    provider: string;
    role: number;
  };
  comment?: string;
  priority: Priority;
  categories?: Category[];
  keywords?: Tag[];
  stocks?: Stock[];
  startDate: string;
  endDate: string;
  publicDate: string;
}

export interface IScheduleForm {
  title: string;
  comment: string;
  stockCodes: string[];
  author: string; //id
  keywords: number[];
  categories: number[];
  priority: Priority;
  startDate: string;
  endDate: string;
}
