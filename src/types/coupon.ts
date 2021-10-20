import { User } from './user';

export interface Coupon {
  id: number;
  code: string;
  name: string;
  displayName: string;
  usedDate: string;
  issuedDate: string;
  expirationDate: string;
  agency: string;
  userId: number;
  isUsed: boolean;
  type: string;
  applyDays: number;
  issuedBy: User;
}
