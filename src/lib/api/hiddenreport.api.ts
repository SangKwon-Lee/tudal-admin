import axios, { apiServer } from 'src/lib/axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';
import { IHR, IHRImage } from 'src/types/hiddenreport';

/** 히든 리포트 */
export async function get(id) {
  return await axios.get<IHR>(`/master-reports/${id}`);
}

export async function getList(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<IHR[]>(`/master-reports?${query}`);
}
export async function getListLength(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<number>(`/master-reports/count?${query}`);
}

export async function create(body) {
  return await axios.post(`/master-reports`, body);
}

export async function createHidden(body) {
  return await axios.post(`/hidden-reports`, body);
}

export async function update(body) {
  return await axios.put(`/master-reports/${body.id}`, body);
}

export async function remove(id) {
  return await axios.delete(`/master-reports/${id}`);
}

export async function getOrders(reporterId) {
  return await axios.get(
    `/hidden-report-orders?hidden_report.hidden_reporter=${reporterId}&_limit=-1&_sort=created_at:DESC`,
  );
}

export async function getOrdersByReport(reportId) {
  return await axios.get(
    `/hidden-report-orders?hidden_report=${reportId}&_limit=-1&_sort=created_at:DESC`,
  );
}

/** 히든 리포트 이미지*/
export async function getImage(id) {
  return await axios.get<IHRImage>(`/hidden-report-images/${id}`);
}
export async function getImageList(param) {
  const query = qs.stringify(removeEmpty(param));

  return await axios.get<number>(`/hidden-report-images?${query}`);
}

export async function getImageListLength(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<IHRImage[]>(
    `/hidden-report-images/count?${query}`,
  );
}

export async function createImage(image) {
  return await axios.post(`/hidden-report-images`, image);
}

export async function editImage(id, image) {
  return await axios.put(`/hidden-report-images/${id}`, image);
}

export async function postReportComment(body) {
  return await apiServer.post('/hiddenReport/report/comments', body);
}

// 히든 리포트 정산
export async function getHiddenReportOrders(id, param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get(
    `/hidden-report-orders/reporter/${id}?${query}`,
  );
}
