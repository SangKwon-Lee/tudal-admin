import { CP_Master, CP_Hidden_Reporter } from './cp';
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
export enum IUserType {
  ADMIN = 'admin',
  CMS = 'cms',
  CP = 'cp',
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

export interface IUser {
  id: number;
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
  masters: CP_Master[];
  hidden_reporter: CP_Hidden_Reporter;
  phone_number: string;
  contact_email: string;
  type: IUserType
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
  role: number;
  nickname: string;
  type: string;
  contact_email: string;
  phone_number: string;
}
