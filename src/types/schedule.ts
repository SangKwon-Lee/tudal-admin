// APIS

export interface Tag {
  id: number;
  name: string;
  summary: string;
  description: string;
  created_at: string;
  updated_at: string;
  alias?: ITagAlias[];
  isDeleted: boolean;

  // 자동완성을 위한 property
  isNew?: boolean;
  inputValue?: string;
}

export interface ITagAlias {
  id: number;
  tagId: number;
  aliasName: string;
}

export interface Stock {
  id?: number;
  code?: string;
  name?: string;
  stockcode?: string;
  stockname?: string;
}

export interface Category {
  id: number;
  name: string;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;

  // 자동완성을 위한 property
  isNew?: boolean;
  inputValue?: string;
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
  author: number; //id
  keywords: number[];
  categories: number[];
  priority: Priority;
  startDate: string;
  endDate: string;
}
