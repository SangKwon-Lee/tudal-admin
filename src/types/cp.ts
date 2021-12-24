export interface CP_Master {
  id?: number | string;
  nickname: string;
  profile_image_url: string;
  price_gold: number;
  subscription_days: number;
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
  user: any;
  created_at?: string;
}
