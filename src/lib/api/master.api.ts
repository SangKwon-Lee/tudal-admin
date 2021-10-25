import { cmsServer } from './../axios';
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

export async function getDetailFeed(feedId) {
  return await axios.get(`/master-feeds/${feedId}`);
}

export async function getDetailFeedLike(feedId) {
  return await axios.get(
    `/master-feed-likes?master_feed.id=${feedId}`,
  );
}

export async function getMasterChannel(userId) {
  return await axios.get(`/master-channels?master.id=${userId}`);
}

export async function getMasterRoom(channelId) {
  return await axios.get(
    `/master-rooms?master_channel=${channelId}&isDeleted=0`,
  );
}

export async function getAllSubscribe(masterId) {
  return await axios.get(
    `/master-subscriptions?master.id=${masterId}`,
  );
}

export async function getYearSubscribe(year, masterId) {
  let monthArr = [];
  if (Number(year) === new Date().getFullYear()) {
    for (let i = 1; i < new Date().getMonth() + 2; i++) {
      if (i.toString().length === 1) {
        monthArr.push('0' + i.toString());
      } else {
        monthArr.push(i.toString());
      }
    }
  } else {
    monthArr = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
  }

  const data = await Promise.all(
    monthArr.map(async (month) => {
      let date = new Date(year, Number(month), 0).getDate();
      return await axios.get(
        `/master-subscriptions?startDate_gte=2020-01-01&startDate_lte=${year}-${month}-${date}&master.id=${masterId}`,
      );
    }),
  );
  return data;
}

export async function getThisMonth(masterId) {
  const year = new Date().getFullYear();
  const thisMonth = new Date().getMonth() + 1;
  const lastMonth = new Date().getMonth();
  const thisDate = new Date(year, thisMonth, 0).getDate();
  const lastDate = new Date(year, lastMonth, 0).getDate();
  const This = await axios.get(
    `/master-subscriptions/?startDate_gte=${year}-${thisMonth}-01&startDate_lte=${year}-${thisMonth}-${thisDate}&master.id=${masterId}`,
  );
  const Last = await axios.get(
    `/master-subscriptions/?startDate_gte=${year}-0${lastMonth}-01&startDate_lte=${year}-0${lastMonth}-${lastDate}&master.id=${masterId}`,
  );

  return [This, Last];
}
