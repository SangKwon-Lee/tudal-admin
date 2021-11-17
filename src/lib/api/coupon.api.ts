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

export async function createIssuedCoupon(coupon) {
  return axios.post(`/issued-coupons`, coupon);
}

export async function getIssuedCoupon(params, sort, id) {
  let query = qs.stringify(removeEmpty(params));
  return axios.get(
    `/issued-coupons?coupon.id=${id}&${query}&_sort=${sort}`,
  );
}

export async function getIssuedCouponLength(id) {
  return axios.get(`/issued-coupons/count?coupon.id=${id}`);
}
export async function getCouponDetail(id) {
  return axios.get(`/coupons/${id}`);
}

export async function getIsusedCouponLength(id) {
  return axios.get(`/issued-coupons?coupon.id=${id}&isUsed=1`);
}

export async function deleteIssuedCoupon(couponId) {
  return axios.delete(`/issued-coupons/${couponId}`);
}

export async function getAllList(id) {
  return axios.get(`/issued-coupons/?coupon.id=${id}&_limit=-1`);
}
