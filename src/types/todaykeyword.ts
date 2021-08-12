export interface Stock {
  change: string;
  drate: string;
  ename: string;
  high: number;
  hname: string;
  jnilclose: number;
  low: number;
  open: number;
  price: number;
  shcode: string;
  sign: string;
  value: number;
}

export interface Tag {
  name: string;
  value: number;
}

export interface TagData {
  label: string;
  svalue: number;
  value: number;
  fillColor: string;
}
