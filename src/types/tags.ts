export interface Tags {
  id: number;
  tag_aliases: Aliases[];
  created_at: string;
  description: string;
  name: string;
  summary: string;
  stocks: TagStocs[];
  updated_at: string;
  isDeleted: boolean;
}

export interface SortTags {
  id: number;
  created_at: string;
  description: string;
  name: string;
  summary: string;
  updated_at: string;
}

export interface Aliases {
  created_at: string;
  id: number;
  name: string;
  tag: number;
  updated_at: string;
}

export interface TagStocs {
  avgVolume: string;
  category: string;
  code: string;
  created_at: string;
  day_disclosure_cnt: any;
  day_news_cnt: any;
  day_report_cnt: any;
  except: any;
  id: number;
  in_code: any;
  in_name: any;
  mainSupply: string;
  marketCap: number;
  name: string;
  oneshot_total_strategy: string;
  pbr: number;
  pbrComp: number;
  pbrCompEst: string;
  per: number;
  perComp: number;
  perCompEst: string;
  sector_us: any;
  short: any;
  shortTrend: any;
  updated_at: string;
}
