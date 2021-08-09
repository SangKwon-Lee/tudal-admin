import qs from "qs"
import axios from "src/lib/axios"
import { Schedule, IScheduleForm } from "src/types/schedule"

export async function getList(search: string) {
  let q: any = {}
  if (search) {
    q._q = search
  }
  return await axios.get<Schedule[]>(`/schedules?${qs.stringify(q)}`)
}

export async function create(schedule: IScheduleForm) {
  return await axios.post("/schedules", schedule)
}

export async function deleteItem(id: number) {
  return await axios.delete<Schedule>(`/schedules/${id}`)
}
