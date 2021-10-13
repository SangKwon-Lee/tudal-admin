import qs from 'qs';
import { IScheduleListStatus } from 'src/components/dashboard/schedule/ScheduleList.Container';
import axios from 'src/lib/axios';
import { Schedule, IScheduleForm } from 'src/types/schedule';
import { removeEmpty } from 'src/utils/helper';

export async function getList(params: IScheduleListStatus) {
  const query = qs.stringify(removeEmpty(params));
  return await axios.get<Schedule[]>(`/schedules?${query}`);
}

export async function getTotalCount() {
  return await axios.get<number>(`/schedules/count`);
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
