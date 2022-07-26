export function priceToString(price?: any) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
