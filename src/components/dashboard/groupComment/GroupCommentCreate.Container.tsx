import { useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import useAuth from 'src/hooks/useAuth';
import { APIGroupComment } from 'src/lib/api';
import { GroupComment, GroupDetail } from 'src/types/groupComment';
import GroupCommentCreatePresenter from './GroupCommentCreate.Presenter';

export enum GroupCommentCreateActionKind {
  LOADING = 'LOADING',
  GET_GROUP_DETAIL = 'GET_GROUP_DETAIL',
  GET_GROUP_COMMENT = 'GET_GROUP_COMMENT',
  CHANGE_COMMENT = 'CHANGE_COMMENT',
}

export interface GroupCommentCreateAction {
  type: GroupCommentCreateActionKind;
  payload?: any;
}

export interface GroupCommentCreateState {
  loading: boolean;
  group: GroupDetail;
  comments: GroupComment[];
  comment: string;
}

const initialState: GroupCommentCreateState = {
  loading: true,
  group: {
    id: 0,
    user_id: 0,
    name: '',
    order: 0,
    numStocks: 0,
    premium: false,
    show: false,
    description: '',
    created_at: '',
    updated_at: '',
  },
  comments: [],
  comment: '',
};

const GroupCommentCreateReducer = (
  state: GroupCommentCreateState,
  action: GroupCommentCreateAction,
): GroupCommentCreateState => {
  const { type, payload } = action;
  switch (type) {
    case GroupCommentCreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case GroupCommentCreateActionKind.GET_GROUP_DETAIL:
      return {
        ...state,
        group: payload,
        loading: false,
      };
    case GroupCommentCreateActionKind.GET_GROUP_COMMENT:
      return {
        ...state,
        comments: payload,
        loading: false,
      };
    case GroupCommentCreateActionKind.CHANGE_COMMENT:
      return {
        ...state,
        comment: payload,
      };
  }
};
const GroupCommentCreateCotainer = () => {
  const [groupCommentCreateState, dispatch] = useReducer(
    GroupCommentCreateReducer,
    initialState,
  );

  const { groupCommentId } = useParams();
  const { user } = useAuth();

  //* 그룹 상세 보기 내용
  const getGroupDetail = useCallback(async () => {
    dispatch({
      type: GroupCommentCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { status, data } = await APIGroupComment.getGroupDetail(
        groupCommentId,
      );
      if (status === 200) {
        dispatch({
          type: GroupCommentCreateActionKind.GET_GROUP_DETAIL,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [groupCommentId]);
  //* 그룹 코멘트
  const getGroupComment = useCallback(async () => {
    dispatch({
      type: GroupCommentCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { status, data } = await APIGroupComment.getGroupComment(
        groupCommentId,
      );
      if (status === 200) {
        dispatch({
          type: GroupCommentCreateActionKind.GET_GROUP_COMMENT,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [groupCommentId]);

  const handleWriteGroupComment = async (comment: string) => {
    dispatch({
      type: GroupCommentCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const newInput = {
        comment: comment,
        user: user.id,
        tudal_group: groupCommentId,
      };
      const { status } = await APIGroupComment.WriteGroupComment(
        groupCommentId,
        newInput,
      );
      if (status === 200) {
        dispatch({
          type: GroupCommentCreateActionKind.LOADING,
          payload: false,
        });
        getGroupComment();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGroupComment = async (commentId: number) => {
    dispatch({
      type: GroupCommentCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { status } = await APIGroupComment.DeleteGroupComment(
        commentId,
      );
      if (status === 200) {
        dispatch({
          type: GroupCommentCreateActionKind.LOADING,
          payload: false,
        });
        getGroupComment();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateGroupComment = async (
    commentId: number,
    comment: string,
  ) => {
    dispatch({
      type: GroupCommentCreateActionKind.LOADING,
      payload: true,
    });
    try {
      const { status } = await APIGroupComment.UpdateGroupComment(
        commentId,
        comment,
      );
      if (status === 200) {
        dispatch({
          type: GroupCommentCreateActionKind.LOADING,
          payload: false,
        });
        getGroupComment();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (groupCommentId) {
      getGroupDetail();
      getGroupComment();
    }
  }, [groupCommentId, getGroupDetail, getGroupComment]);

  return (
    <GroupCommentCreatePresenter
      dispatch={dispatch}
      groupCommentCreateState={groupCommentCreateState}
      handleWriteGroupComment={handleWriteGroupComment}
      handleDeleteGroupComment={handleDeleteGroupComment}
      handleUpdateGroupComment={handleUpdateGroupComment}
    />
  );
};

export default GroupCommentCreateCotainer;
