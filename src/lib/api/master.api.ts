import axios from '../axios';
import qs from 'qs';
import { removeEmpty } from 'src/utils/helper';
import {
  IMasterChannel,
  IMasterFeed,
  IMasterRoom,
} from 'src/types/master';

/** 구 버전 달인 (에디터) */
// export async function getList() {
//   const expertFeeds = await axios.get(
//     `/expert-feeds?&_sort=created_at:DESC&_start=0&_limit=10000`,
//   );

//   return expertFeeds;
// }

export async function getFeeds(params, userId) {
  let query = qs.stringify(removeEmpty(params));
  return await axios.get<IMasterFeed[]>(
    `/master-feeds?master.id=${userId}&${query}`,
  );
}

export async function getFeedLength(masterId, roomId) {
  return await axios.get(
    `/master-feeds/count?master.id=${masterId}&isDeleted=0&master_room.id=${roomId}`,
  );
}

export async function getRooms(userId, channelId) {
  return await axios.get<IMasterRoom[]>(
    `/master-rooms?master.id=${userId}&master_channel.id=${channelId}`,
  );
}

export async function getChannels(userId) {
  return await axios.get<IMasterChannel[]>(
    `/master-channels?master.id=${userId}`,
  );
}

export async function deleteFeed(id) {
  return axios.put(`/master-feeds/${id}`, { isDeleted: true });
}
