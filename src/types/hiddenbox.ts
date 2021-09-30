interface Tag {
  id: number;
  name: string;
}

interface Stock {
  code: string;
  name: string;
}

export interface Hiddenbox {
  likes: [];
  viewCount: number;
  id: number;
  title: string;
  description?: string;
  contents: string;
  startDate: string;
  endDate: string;
  publicDate: string;
  author: {
    id: number;
    username: string;
    email: string;
    nickname: string;
  };
  productId: string;
  stocks: Stock[];
  tags: Tag[];
  orders?: number;
}
