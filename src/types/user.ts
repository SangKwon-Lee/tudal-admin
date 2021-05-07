interface Avatar {
  url: string;
}

export interface User {
  id: string;
  avatar?: Avatar;
  email: string;
  username: string;
  nickname?: string;
  [key: string]: any;
}