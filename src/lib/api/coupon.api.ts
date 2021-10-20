import axios from 'src/lib/axios';
import { removeEmpty } from 'src/utils/helper';
import qs from 'qs';

export async function getCoupons(params, sort) {
  let query = qs.stringify(removeEmpty(params));
  return await axios.get(`/coupons?${query}&_sort=${sort}`);
}

export async function getCouponLength() {
  return await axios.get(`/coupons/count`);
}

export async function deleteCoupon(couponId) {
  return axios.delete(`/coupons/${couponId}`);
}

export async function createCoupon(coupon) {
  return axios.post(`/coupons`, coupon);
}
