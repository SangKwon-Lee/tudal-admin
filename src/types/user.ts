import { Hiddenbox } from './hiddenbox';
import { Schedule } from './schedule';

interface Avatar {
  url: string;
}

export enum IRoleType {
  AUTHENTICATED = 'authenticated',
  Public = 'public',
  Author = 'author',
}

interface IRole {
  Lv: number;
  id: number;
  name: string;
  type: IRoleType;
  hiddenbox: boolean;
  expert: boolean;
  lms: boolean;
}

export interface User {
  id: string;
  avatar?: Avatar;
  email: string;
  username: string;
  nickname?: string;
  hiddenboxes: Hiddenbox[];
  blocked: boolean;
  confirmed: boolean;
  role: IRole;
  schedules: Schedule[];
  [key: string]: any;
}
