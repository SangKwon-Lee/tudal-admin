export interface IGroup {
  id: number;
  user_id: number;
  name: string;
  show: boolean;
  numStocks: number;
  order: number;
  created_at: Date;
  updated_at: Date;
  description: string;
  premium: string;
  thumbnail: string;
}

export interface IGropuInput {
  id?: number;
  name: string;
  show: boolean;
  premium: boolean;
  description: string;
  subTitle: string;
  contents: string;
  // stocks: Stock[];
}
