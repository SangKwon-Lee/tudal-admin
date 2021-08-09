import { apiServer } from "src/lib/axios"
import { Stock } from "src/types/schedule"

export async function getList() {
  return await apiServer.get<Stock[]>("/stocks/stkNmCd")
}
