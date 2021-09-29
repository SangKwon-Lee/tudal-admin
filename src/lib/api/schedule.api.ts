import qs from 'qs';
import axios from 'src/lib/axios';
import { Schedule, IScheduleForm } from 'src/types/schedule';

export async function getList(
  search: string,
  sort,
  startDate?,
  endDate?,
  start: number = 0,
  limit: number = 100,
) {
  let q: any = {};

  if (search) {
    q._q = search;
  }
  if (startDate) {
    q._startDate = startDate;
  }
  if (endDate) {
    q._endDate = endDate;
  }
  if (start) {
    q._start = start;
  }

  if (limit) {
    q._limit = limit;
  }

  return await axios.get<Schedule[]>(
    `/schedules?_sort=${sort}&${qs.stringify(q)}`,
  );
}

export async function create(schedule: IScheduleForm) {
  return await axios.post('/schedules', schedule);
}

export async function update(schedule) {
  return await axios.put(`/schedules`, schedule);
}

export async function deleteItem(id: number) {
  return await axios.delete<Schedule>(`/schedules/${id}`);
}
