export interface CP_Master {
  id?: number | string;
  nickname: string;
  profile_image_url: string;
  intro: string;
  keyword: string;
  user: any;
  created_at?: string;
}

export interface CP_Hidden_Reporter {
  id?: number | string;
  nickname: string;
  intro: string;
  imageUrl: string;
  tudalRecommendScore?: number;
  catchPhrase: string;
  user: any;
  created_at?: string;
}
