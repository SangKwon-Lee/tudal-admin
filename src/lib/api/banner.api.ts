import axios from 'src/lib/axios';

export const postOneImage = async (input) => {
  return axios.post(`/setting/hidden-report-banners`, input);
};

// export const deleteBanner = async (id) =>{
//   return axios
// }
