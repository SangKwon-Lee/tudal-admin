import _ from 'lodash';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAsync from 'src/hooks/useAsync';
import { APIGroup, APIStock } from 'src/lib/api';
import { IGropuInput } from 'src/types/group';
import { Stock } from 'src/types/schedule';
import GroupCreatePresenter from './GroupCreate.Presenter';

interface GroupCreateContainerProps {
  mode: string;
  groupId?: number;
  pageTopRef: React.RefObject<HTMLDivElement>;
}

export enum GroupCreateActionKind {
  LOADING = 'LOADING',
  GET_GROUP = 'GET_GROUP',
  GET_FAVORITES = 'GET_FAVORITES',
  GET_GROUP_LENGTH = 'GET_GROUP_LENGTH',
  CHANGE_STOCKS = 'CHANGE_STOCKS',
}

export interface GroupCreateAction {
  type: GroupCreateActionKind;
  payload?: any;
}

export interface GroupCreateState {
  loading: boolean;
  newGroup: IGropuInput;
  groupLength: number;
  stocks: Stock[];
}
const initialState: GroupCreateState = {
  loading: false,
  newGroup: {
    name: '',
    description: '',
    premium: false,
    show: true,
    id: 0,
  },
  stocks: [],
  groupLength: 0,
};

const GroupCreateReducer = (
  state: GroupCreateState,
  action: GroupCreateAction,
): GroupCreateState => {
  const { type, payload } = action;
  switch (type) {
    case GroupCreateActionKind.LOADING:
      return {
        ...state,
        loading: payload,
      };
    case GroupCreateActionKind.CHANGE_STOCKS:
      return {
        ...state,
        stocks: payload,
      };
    case GroupCreateActionKind.GET_GROUP:
      return {
        ...state,
        newGroup: payload,
      };
    case GroupCreateActionKind.GET_FAVORITES:
      return {
        ...state,
        stocks: payload,
      };
    case GroupCreateActionKind.GET_GROUP_LENGTH:
      return {
        ...state,
        groupLength: payload,
      };
  }
};

const GroupCreateContainer: React.FC<GroupCreateContainerProps> = ({
  mode,
  groupId,
}) => {
  const [groupCreateState, dispatch] = useReducer(
    GroupCreateReducer,
    initialState,
  );
  const navigate = useNavigate();
  const stockInput = useRef(null);
  const { stocks } = groupCreateState;

  // * 그룹 길이
  const groupLength = async () => {
    try {
      const { data } = await APIGroup.getGroupLength();
      dispatch({
        type: GroupCreateActionKind.GET_GROUP_LENGTH,
        payload: data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //* 기존 데이터 불러오기

  const getGroup = useCallback(async () => {
    if (mode === 'edit') {
      try {
        const { data } = await APIGroup.getGroup(groupId);
        dispatch({
          type: GroupCreateActionKind.GET_GROUP,
          payload: data,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [mode, groupId]);

  // * 새로운 그룹 생성
  const groupCreate = async (data: IGropuInput) => {
    const newGroup = {
      name: data.name,
      description: data.description,
      premium: data.premium,
      show: data.show,
      order: groupCreateState.groupLength,
      user_id: '29020',
      numStocks: stocks.length,
    };
    try {
      if (mode === 'create') {
        const { data } = await APIGroup.postGroup(newGroup);
        await Promise.all(
          stocks.map(async (stock) => {
            let newFavorites = {
              stockcode: '',
              stockname: '',
              group_id: 0,
            };
            newFavorites.stockcode = stock.code;
            newFavorites.stockname = stock.name;
            newFavorites.group_id = data.id;
            return await APIGroup.postFavorites(newFavorites);
          }),
        );
        toast.success('데일리가 생성됐습니다.');
        navigate(`/dashboard/groups`);
      } else {
        const { data } = await APIGroup.putGroup(newGroup, groupId);
        const { data: Favorites } = await APIGroup.getFavorites(
          groupId,
        );
        await Promise.all(
          Favorites.map(async (favorites) => {
            return await APIGroup.deleteFavorites(favorites.id);
          }),
        );
        await Promise.all(
          stocks.map(async (stock) => {
            let newFavorites = {
              stockcode: '',
              stockname: '',
              group_id: 0,
            };
            newFavorites.stockcode = stock.code;
            newFavorites.stockname = stock.name;
            newFavorites.group_id = data.id;
            return await APIGroup.postFavorites(newFavorites);
          }),
        );
        toast.success('데일리가 수정됐습니다.');
        navigate(`/dashboard/groups`);
      }
    } catch (e) {
      toast.error('오류가 생겼습니다.');
      navigate(`/dashboard/groups`);
      console.log(e);
    }
  };

  // *종목 변경
  const onStockChange = (event, stock: Stock[], reason, item) => {
    switch (reason) {
      case 'selectOption':
        dispatch({
          type: GroupCreateActionKind.CHANGE_STOCKS,
          payload: [...groupCreateState.stocks, item.option],
        });
        break;
      case 'removeOption':
        dispatch({
          type: GroupCreateActionKind.CHANGE_STOCKS,
          payload: groupCreateState.stocks.filter(
            (stocks) => stocks.id !== item.option.id,
          ),
        });
        break;
      case 'clear':
        dispatch({
          type: GroupCreateActionKind.CHANGE_STOCKS,
          payload: [],
        });
        break;
    }
  };

  // * 종목 관련
  const getStockList = useCallback(() => {
    return APIStock.getSimpleList();
  }, []);
  const [{ data: stockList, loading: stockLoading }, refetchStock] =
    useAsync<any>(getStockList, [], []);
  const handleStockChange = _.debounce(refetchStock, 300);

  useEffect(() => {
    groupLength();
  }, []);

  useEffect(() => {
    if (mode === 'edit') {
      getGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  return (
    <GroupCreatePresenter
      groupCreate={groupCreate}
      mode={mode}
      stockList={stockList}
      stockLoading={stockLoading}
      stockInput={stockInput}
      onStockChange={onStockChange}
      handleStockChange={handleStockChange}
      groupCreateState={groupCreateState}
    />
  );
};

export default GroupCreateContainer;
