import axios from 'src/lib/axios';

export const getGroupDetail = async (groupId) => {
  return await axios.get(`tudal-groups/${groupId}`);
};

export const getGroupComment = async (groupId) => {
  return await axios.get(
    `tudal-group-comments/?tudal_group.id=${groupId}`,
  );
};

export const WriteGroupComment = async (groupId, input) => {
  return await axios.post(
    `tudal-group-comments/?tudal_group.id=${groupId}`,
    input,
  );
};

export const DeleteGroupComment = async (commentId) => {
  return await axios.delete(`tudal-group-comments/${commentId}`);
};

export const UpdateGroupComment = async (commentId, comment) => {
  return await axios.put(`tudal-group-comments/${commentId}`, {
    comment,
  });
};
