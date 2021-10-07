import axios from '../axios';

export async function getList() {
  const expertFeeds = await axios.get(
    `/expert-feeds?&_sort=created_at:DESC&_start=0&_limit=10000`,
  );

  return expertFeeds;
}

export async function getCPList() {
  const CPFeeds = await axios.get(
    `/cp-feeds?&_sort=created_at:DESC&_start=0&_limit=10000&isDeleted=0`,
  );
  return CPFeeds;
}
