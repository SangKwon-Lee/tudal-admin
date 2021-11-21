import { IUser } from './user';

export interface CouponType {
  id: number;
  name: string;
  displayName: string;
  agency: string;
  type: string;
  applyDays: number;
  issuedBy: IUser;
  created_at: string;
}

export interface IssuedCoupon {
  id: number;
  code: string;
  usedDate: string;
  issuedDate: string;
  expirationDate: string;
  userId: number;
  isUsed: boolean;
  type: string;
  issuedBy: IUser;
  coupon: number;
}
