import axios from '../axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';

/** 구 버전 달인 (에디터) */
// export async function getList() {
//   const expertFeeds = await axios.get(
//     `/expert-feeds?&_sort=created_at:DESC&_start=0&_limit=10000`,
//   );

//   return expertFeeds;
// }

export async function getFeeds(params) {
  let query = qs.stringify(removeEmpty(params));
  return await axios.get(`/master-feeds?${query}`);
}
export async function getFeedLength(masterId) {
  return await axios.get(
    `/master-feeds/count?master.id=${masterId}&isDeleted=0`,
  );
}

export async function getRooms(userId) {
  return await axios.get(`/master-rooms?master.id=${userId}`);
}

export async function getChannels(userId) {
  return await axios.get(`/master-channels?master.id=${userId}`);
}

export async function deleteFeed(id) {
  return axios.put(`/master-feeds/${id}`, { isDeleted: true });
}
