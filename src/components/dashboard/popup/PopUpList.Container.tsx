import { FC, useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { APIOverview, APIPopUp } from 'src/lib/api';
import { DndProvider } from 'react-dnd';
import { IPopUp } from 'src/types/popup';
import PopUpListPresenter from './PopUpList.Presenter';
import { swapItems } from 'src/utils/helper';
import { IMaster } from 'src/types/master';

export enum PopUpListActionKind {
  LOADING = 'LOADING',
  LOAD_LIST = 'LOAD_LIST',
  LOAD_OPEN_LIST = 'LOAD_OPEN_LIST',
  CHANGE_EDIT_MODE = 'CHANGE_EDIT_MODE',
  CHANGE_QUERY = 'CHANGE_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
  GET_DARIN = 'GET_DARIN',
}

export interface PopUpCreateAction {
  type: PopUpListActionKind;
  payload?: any;
}

export const sortOptions = [
  {
    label: 'Last update (newest first)',
    value: 'updated_at:desc',
  },
  {
    label: 'Last update (oldest first)',
    value: 'updated_at:asc',
  },
  {
    label: 'Creation date (newest first)',
    value: 'created_at:desc',
  },
  {
    label: 'Creation date (oldest first)',
    value: 'created_at:asc',
  },
  {
    label: 'Order (newest first)',
    value: 'order:desc',
  },
  {
    label: 'Order (oldest first)',
    value: 'order:asc',
  },
];

export interface IPopupListState {
  list: IPopUp[];
  openList: IPopUp[];
  listLength: number;
  page: number;
  loading: boolean;
  isEditOrder: boolean;
  query: {
    _q: string;
    _start: number;
    _limit: number;
    _sort: string;
  };
}

const initialState: IPopupListState = {
  list: [],
  openList: [],
  listLength: 0,
  isEditOrder: false,

  page: 1,
  loading: false,
  query: {
    _q: '',
    _start: 0,
    _limit: 20,
    _sort: sortOptions[0].value,
  },
};

const PopUpListReducer = (
  state: IPopupListState,
  action: PopUpCreateAction,
): IPopupListState => {
  const { type, payload } = action;
  switch (type) {
    case PopUpListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case PopUpListActionKind.LOAD_LIST:
      return {
        ...state,
        loading: false,
        list: payload.data,
        listLength: payload.count,
      };

    case PopUpListActionKind.LOAD_OPEN_LIST:
      return {
        ...state,
        openList: payload,
      };
    case PopUpListActionKind.CHANGE_EDIT_MODE:
      return {
        ...state,
        isEditOrder: payload,
      };
    case PopUpListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
      };
    case PopUpListActionKind.CHANGE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          [payload.name]: payload.value,
        },
      };
  }
};

interface PopUpCreateProps {
  mode?: string;
}

const PopupListContainer: FC<PopUpCreateProps> = (props) => {
  const [popupListState, dispatch] = useReducer(
    PopUpListReducer,
    initialState,
  );

  const { query, isEditOrder, openList } = popupListState;

  const getList = useCallback(async () => {
    dispatch({ type: PopUpListActionKind.LOADING });
    try {
      const { data } = await APIPopUp.getList(query);
      const { data: count } = await APIPopUp.getCount(query);
      console.log(data);

      dispatch({
        type: PopUpListActionKind.LOAD_LIST,
        payload: { data, count },
      });
    } catch (error) {
      console.log(error);
    }
  }, [query]);

  const getOpenList = useCallback(async () => {
    dispatch({ type: PopUpListActionKind.LOADING });
    try {
      const { data } = await APIPopUp.getOpenList();

      dispatch({
        type: PopUpListActionKind.LOAD_OPEN_LIST,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const postChangeOrder = useCallback(async () => {
    dispatch({ type: PopUpListActionKind.LOADING });

    try {
      const newOrders = openList.map((popup, i) =>
        APIPopUp.editPopup(popup.id, { order: i + 1 }),
      );
      await Promise.all(newOrders);
      toast.success('성공했습니다.');
      getList();
    } catch (error) {
      console.log(error);
    }
  }, [openList, getList]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    getOpenList();
  }, [getOpenList]);

  const moveCard = async (
    dragIndex?: number,
    hoverIndex?: number,
  ) => {
    const newOrder = swapItems(openList, dragIndex, hoverIndex);
    if (isEditOrder) {
      dispatch({
        type: PopUpListActionKind.LOAD_OPEN_LIST,
        payload: newOrder,
      });
    } else {
      toast.error('수정 모드가 아닙니다.');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <PopUpListPresenter
        state={popupListState}
        postChangeOrder={postChangeOrder}
        dispatch={dispatch}
        moveCard={moveCard}
      />
    </DndProvider>
  );
};

export default PopupListContainer;
