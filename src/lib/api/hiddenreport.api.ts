import axios from 'src/lib/axios';
import qs from 'qs';
import { IGroup } from 'src/types/group';
import { removeEmpty } from 'src/utils/helper';
import { IHRImage } from 'src/types/hiddenreport';

export async function getImage(id) {
  return await axios.get<IHRImage>(`/hidden-report-images/${id}`);
}
export async function getImageList(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<IHRImage[]>(
    `/hidden-report-images?${query}`,
  );
}

export async function getImageListLength(param) {
  const query = qs.stringify(removeEmpty(param));
  return await axios.get<IHRImage[]>(
    `/hidden-report-images/count?${query}`,
  );
}

export async function createImage(image) {
  return await axios.post(`/hidden-report-images`, image);
}
