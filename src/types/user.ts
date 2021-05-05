export interface User {
  id: string;
  avatar: string;
  email: string;
  name: string;
  username?: string;
  [key: string]: any;
}