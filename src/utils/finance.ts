export function getBidUnitByPrice(price){
  if( price < 1000 ){
    return 1;
  } else if( price < 5000 ){
    return 5;
  } else if( price < 10000 ){
    return 10;
  } else if( price < 50000 ){
    return 50;
  } else if( price < 100000 ){
    return 100;
  } else if( price < 500000 ){
    return 500;
  } else {
    return 1000
  }
}

export const priceFormat = (number) => {
  try {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return (number || 0).toString().replace(regexp, ',');
  } catch (err) {
    return number;
  }
};

export const ratioFormat = (number, digit=3, sign=true, fixed=2) => {
  try {
    let regexp = null;
    if( digit === 4){
      regexp = /\B(?=(\d{4})+(?!\d))/g;
    } else {
      regexp = /\B(?=(\d{3})+(?!\d))/g;
    }
    return (sign ? (number >= 0 ? '+' : '') : '') + number.toFixed(fixed).toString().replace(regexp, ',');
  } catch (err) {
    return number;
  }
};