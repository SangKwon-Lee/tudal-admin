import _ from 'lodash';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import toast from 'react-hot-toast';
import { errorMessage } from 'src/common/error';
import useAsync from 'src/hooks/useAsync';
import useAuth from 'src/hooks/useAuth';
import { APICategory } from 'src/lib/api';
import { Category } from 'src/types/schedule';
import { IRoleType } from 'src/types/user';
import CategoryListPresenter from './CategoryList.Presenter';

export enum CategoryListActionKind {
  LOADING = 'LOADING',
  GET_CATEGORY = 'GET_CATEGORY',
  GET_CATEGORY_LENGTH = 'GET_CATEGORY_LENGTH',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_TARGET_CATEGORY = 'CHANGE_TARGET_CATEGORY',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  CHANGE_NEW_CATEGORY = 'CHANGE_NEW_CATEGORY',
  CHANGE_OPEN_UPDATE = 'CHANGE_OPEN_UPDATE',
  CHANGE_OPEN_DELETE = 'CHANGE_OPEN_DELETE',
}

export interface CategoryListAction {
  type: CategoryListActionKind;
  payload?: any;
}

export interface CategoryListState {
  loading: boolean;
  categoryList: Category[];
  categoryListLength: number;
  newCategory: Category;
  targetCategory: Category;
  query: {
    _q: string;
    _start: number;
    _limit: number;
  };
  page: number;
  loadMore: boolean;
  openUpdate: boolean;
  openDeleteTag: boolean;
}

const initialState: CategoryListState = {
  loading: false,
  categoryList: [],
  categoryListLength: 0,
  newCategory: null,
  targetCategory: null,
  query: {
    _q: '',
    _start: 0,
    _limit: 20,
  },
  page: 1,
  loadMore: false,
  openUpdate: false,
  openDeleteTag: false,
};

const CategoryListReducer = (
  state: CategoryListState,
  action: CategoryListAction,
): CategoryListState => {
  const { type, payload } = action;
  switch (type) {
    case CategoryListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case CategoryListActionKind.GET_CATEGORY:
      return {
        ...state,
        categoryList: payload,
        loading: false,
      };
    case CategoryListActionKind.GET_CATEGORY_LENGTH:
      return {
        ...state,
        categoryListLength: payload,
        loading: false,
      };
    case CategoryListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * 20,
        },
      };
    case CategoryListActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          _q: payload,
        },
      };
    case CategoryListActionKind.CHANGE_LIMIT:
      return {
        ...state,
        query: { ...state.query, _limit: payload },
      };
    case CategoryListActionKind.CHANGE_NEW_CATEGORY:
      return {
        ...state,
        newCategory: payload,
      };
    case CategoryListActionKind.CHANGE_OPEN_UPDATE:
      return {
        ...state,
        openUpdate: payload,
      };
    case CategoryListActionKind.CHANGE_OPEN_DELETE:
      return {
        ...state,
        openDeleteTag: payload,
      };
    case CategoryListActionKind.CHANGE_TARGET_CATEGORY:
      return {
        ...state,
        targetCategory: payload,
      };
  }
};

const CategoryListContainer = () => {
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const categoryCreateRef = useRef(null);

  const [categoryListState, dispatch] = useReducer(
    CategoryListReducer,
    initialState,
  );

  const getTagList = useCallback(() => {
    const value = categoryCreateRef.current
      ? categoryCreateRef.current.value
      : '';
    return APICategory.getList({ _q: value });
  }, []);

  const [
    { data: categoryList, loading: categoryListLoading },
    refetchCategory,
  ] = useAsync<Category[]>(getTagList, [], []);

  const handleCreateInput = _.debounce(refetchCategory, 300);

  const getList = useCallback(async () => {
    dispatch({ type: CategoryListActionKind.LOADING });
    try {
      const { data, status } = await APICategory.getList(
        categoryListState.query,
      );
      if (status === 200) {
        dispatch({
          type: CategoryListActionKind.GET_CATEGORY,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [categoryListState.query]);

  const getListLength = useCallback(async () => {
    dispatch({ type: CategoryListActionKind.LOADING });
    try {
      const { data, status } = await APICategory.getListLength(
        categoryListState.query,
      );
      if (status === 200) {
        dispatch({
          type: CategoryListActionKind.GET_CATEGORY_LENGTH,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [categoryListState.query]);

  const handleCreate = async () => {
    try {
      if (!categoryListState.newCategory) {
        toast.error('입력을 확인해주세요.');
        return;
      }
      if (!categoryListState.newCategory.isNew) {
        toast.error('이미 등록된 카테고리입니다.');
        return;
      }
      const value = categoryListState.newCategory.inputValue;
      const { status } = await APICategory.postItem(value);
      if (status === 200) {
        toast.success('추가되었습니다.');
        dispatch({
          type: CategoryListActionKind.CHANGE_QUERY,
          payload: '',
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (id, body) => {
    try {
      if (!body && !body.name) {
        toast.error('카테고리를 입력해주세요');
        return;
      }
      const { data, status } = await APICategory.get(body.name);
      if (status !== 200) {
        toast.error(errorMessage.TEMP_SERVER_ERROR);
        return;
      }
      if (data && !_.isEmpty(data)) {
        toast.error('중복된 카테고리 입니다.');
        return;
      }
      await APICategory.update(id, body);
      dispatch({
        type: CategoryListActionKind.CHANGE_OPEN_UPDATE,
        payload: false,
      });
      dispatch({
        type: CategoryListActionKind.CHANGE_TARGET_CATEGORY,
        payload: null,
      });
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      if (user.role.type === IRoleType.Author) {
        toast.error('삭제는 관리자 권한이 필요합니다.');
      } else {
        const { status, data } = await APICategory.update(
          category.id,
          {
            isDeleted: !category.isDeleted,
          },
        );
        if (status === 200) {
          toast.success(
            data.isDeleted ? '삭제되었습니다.' : '복구되었습니다.',
          );
          getList();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({
        type: CategoryListActionKind.CHANGE_OPEN_DELETE,
        payload: false,
      });
      dispatch({
        type: CategoryListActionKind.CHANGE_TARGET_CATEGORY,
        payload: null,
      });
    }
  };

  useEffect(() => {
    getList();
    getListLength();
  }, [getList, getListLength]);

  useEffect(() => {
    scrollRef.current &&
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [categoryListState.page]);

  const category = categoryListState.newCategory
    ? categoryListState.newCategory.isNew
      ? categoryListState.newCategory.inputValue
      : categoryListState.newCategory.name
    : '';

  return (
    <CategoryListPresenter
      categoryListState={categoryListState}
      dispatch={dispatch}
      category={category}
      categoryCreateRef={categoryCreateRef}
      handleCreateInput={handleCreateInput}
      categoryList={categoryList}
      categoryListLoading={categoryListLoading}
      handleCreate={handleCreate}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      getList={getList}
    />
  );
};

export default CategoryListContainer;
