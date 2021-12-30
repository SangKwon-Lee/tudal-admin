import { apiServer } from 'src/lib/axios';
import qs from 'qs';
import {
  IGoldLedger,
  IGoldPostForm,
  IGoldWallet,
} from 'src/types/gold';
import { IGoldListQuery } from 'src/components/dashboard/gold/GoldList.Container';
import { removeEmpty } from 'src/utils/helper';

export async function getLegderList(params: IGoldListQuery) {
  params.searchWord &&
    (params.searchWord = '"' + params.searchWord + '"');

  const query = qs.stringify(removeEmpty(params));
  return await apiServer.get<{
    count: number;
    histories: IGoldLedger[];
  }>(`/golds/history?${query}`);
}

export async function getUserLedger(userId: number, page: number) {
  return await apiServer.get<{
    count: number;
    histories: IGoldLedger[];
  }>(`/golds/history?searchWord=${userId}&page=${page}&limit=5`);
}

export async function getUserWallet(userId: number) {
  return await apiServer.get<IGoldWallet>(`/golds/${userId}`);
}

export async function postAddGold(param: IGoldPostForm) {
  return await apiServer.post<IGoldWallet>(
    `/golds/${param.userId}/${
      param.type === 'add' ? 'add' : 'subtract'
    }`,
    param,
  );
}
