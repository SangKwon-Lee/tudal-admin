import qs from "qs"
import axios from "src/lib/axios"
import { Tag } from "src/types/schedule"

export async function getList(search: string) {
  const q: any = { _limit: 30 }
  if (search) {
    q._q = search
  }
  return await axios.get<Tag[]>("/tags?" + qs.stringify(q))
}

export async function postItems(name: string[]): Promise<Tag[]> {
  const promises = name.map((name) => axios.post<Tag>("/tags", { name }))
  return await Promise.all(promises).then((responses) => {
    return responses.map((response) => {
      return response.data
    })
  })
}
