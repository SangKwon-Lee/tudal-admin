import axios from 'src/lib/axios';
import { INews } from 'src/types/news';
import { Schedule } from 'src/types/schedule';

export async function getNews() {
  return await axios.get<INews[]>(
    '/general-news?_sort=created_at:DESC&isSelected=1&_limit=10',
  );
}

export async function getSchedules(today) {
  return await axios.get<Schedule[]>(
    `/schedules?_startDate=${today}&_limit=5&_sort=priority:DESC`,
  );
}
