export interface IGoldLedger {
  id: number;
  userId: number;
  amount: number;
  type: string;
  datetime: Date;
  category: string;
  code: string;
  isExpired: boolean;
  bonusAmount: number;
  payment: any;
}

export interface IGoldWallet {
  id: number;
  userId: number;
  gold: number;
  bonusGold: number;
}

export interface IGoldPostForm {
  userId: number;
  amount: number;
  bonusAmount: number;
  type: string;
  category: string;
  isExpired: number;
  datetime: string;
  code: string;
}
