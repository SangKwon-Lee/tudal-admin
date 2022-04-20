import axios from 'src/lib/axios';
import qs from 'qs';
import { IGroup } from 'src/types/group';
import { removeEmpty } from 'src/utils/helper';

export async function getGroups(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<IGroup[]>(`/tudal-groups?${query}`);
}

export async function getGroupLength(param?) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<IGroup[]>(`/tudal-groups/count?${query}`);
}

export async function postGroup(input) {
  return await axios.post(`/tudal-groups`, input);
}

export async function putGroup(input, groupId) {
  return await axios.put(`/tudal-groups/${groupId}`, input);
}

export async function deleteGroup(groupId) {
  return await axios.delete(`/tudal-groups/${groupId}`);
}

export async function postFavorites(input) {
  return await axios.post(`/tudal-favorites`, input);
}

export async function getGroup(groupId) {
  return await axios.get(`/tudal-groups/${groupId}`);
}
export async function getFavorites(groupId) {
  return await axios.get(`/tudal-favorites?group_id=${groupId}`);
}
export async function deleteFavorites(groupId) {
  return await axios.delete(`/tudal-favorites/${groupId}`);
}
