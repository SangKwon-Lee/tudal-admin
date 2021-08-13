import { apiServer } from 'src/lib/axios';
import { Stock } from 'src/types/schedule';

export async function getList() {
  try {
    return await apiServer.get<Stock[]>('/stocks/stkNmCd');
  } catch (e) {
    return [];
  }
}
