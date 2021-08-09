import axios from "src/lib/axios"
import { Category } from "src/types/schedule"

export async function getList() {
  return await axios.get(`/categories`)
}

export async function postItems(name: string[]): Promise<Category[]> {
  const promises = name.map((name) => axios.post<Category>("/categories", { name }))
  return await Promise.all(promises).then((responses) => {
    return responses.map((response) => {
      return response.data
    })
  })
}
