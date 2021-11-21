import axios from 'src/lib/axios';
import qs from 'qs';
import { IGroup } from 'src/types/group';
import { removeEmpty } from 'src/utils/helper';

export async function getGroups(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<IGroup[]>(`/tudal-groups?${query}`);
}

export async function getGroupLength(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<IGroup[]>(`/tudal-groups/count?${query}`);
}
