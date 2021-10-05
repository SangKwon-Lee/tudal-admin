import axios from '../axios';
import { apiServer, cmsServer } from '../axios';

export async function getList() {
  return await axios.get(
    `/expert-feeds?&_sort=created_at:DESC&_start=0&_limit=10000`,
  );
}
