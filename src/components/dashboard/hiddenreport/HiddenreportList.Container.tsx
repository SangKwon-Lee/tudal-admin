import { useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  LinearProgress,
  InputAdornment,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  Dialog,
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import ChatIcon from '../../../icons/ChatAlt';
import type { Hiddenbox } from '../../../types/hiddenbox';
import Scrollbar from '../../layout/Scrollbar';
import axios from '../../../lib/axios';
import {
  applyFilters,
  applyPagination,
  applySort,
} from '../../../utils/sort';
import useAuth from 'src/hooks/useAuth';
import { IHRImage } from 'src/types/hiddenreport';
export enum HRImageListActionKind {
  LOADING = 'LOADING',
  LOAD_IMAGES = 'LOAD_IMAGES',
  SELECT_TARGET = 'SELECT_TARGET',
  CLOSE_SELECT_CONFIRM = 'CLOSE_SELECT_CONFIRM',

  // QUERY/
  CHANGE_QUERY = 'CHANG_QUERY',
  CHANGE_PAGE = 'CHANGE_PAGE',
}

type Sort = 'created_at:desc' | 'created_at:asc';

interface SortOption {
  value: Sort;
  label: string;
}
export const sortOptions: SortOption[] = [
  {
    label: '등록순 (최신)',
    value: 'created_at:desc',
  },
  {
    label: '등록순 (오래된)',
    value: 'created_at:asc',
  },
];

export interface IHRimageListAction {
  type: HRImageListActionKind;
  payload?: any;
}

export interface IHRImageListState {
  list: IHRImage[];
  listLength: number;
  loading: boolean;
  targetSelect: IHRImage;
  isOpenConfirm: boolean;
  page: number;
  query: {
    _q: string;
    _start: number;
    _limit: number;
    _sort: string;
  };
}

const initialState: IHRImageListState = {
  list: [],
  listLength: 0,
  targetSelect: null,
  loading: true,
  page: 1,
  isOpenConfirm: false,
  query: {
    _q: '',
    _start: 0,
    _limit: 50,
    _sort: sortOptions[0].value,
  },
};

const HRImageListReducer = (
  state: IHRImageListState,
  action: IHRimageListAction,
): IHRImageListState => {
  const { type, payload } = action;
  switch (type) {
    case HRImageListActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case HRImageListActionKind.LOAD_IMAGES:
      return {
        ...state,
        loading: false,
        list: payload.data,
        listLength: payload.count,
      };

    case HRImageListActionKind.SELECT_TARGET:
      return {
        ...state,
        targetSelect: payload,
      };

    case HRImageListActionKind.CHANGE_QUERY:
      const { name, value } = payload;
      console.log(payload);
      return {
        ...state,
        query: {
          ...state.query,
          [name]: value,
        },
      };
    case HRImageListActionKind.CLOSE_SELECT_CONFIRM:
      return {
        ...state,
        targetSelect: null,
      };
    case HRImageListActionKind.CHANGE_PAGE:
      return {
        ...state,
        page: payload,
        query: {
          ...state.query,
          _start: (payload - 1) * state.query._limit,
        },
      };
  }
};

const HiddenboxListTable: FC<HiddenboxListTableProps> = (props) => {
  const { hiddenboxes, reload, loading, ...other } = props;
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [selectedHiddenboxes, setSelectedHiddenboxes] = useState<
    number[]
  >([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [filters, setFilters] = useState<any>({
    beforeSale: null,
    onSale: null,
    afterSale: null,
    public: null,
  });
  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [targetHiddenbox, setTargetHiddenbox] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [salesDataLoaded, setSalesDataLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (hiddenboxes.length > 0) {
      fetchSalesCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenboxes]);

  useEffect(() => {
    if (targetHiddenbox) {
      fetchComments(targetHiddenbox.id);
    }
  }, [targetHiddenbox]);

  const fetchSalesCount = async () => {
    await Promise.all(
      hiddenboxes.map(async (hiddenbox) => {
        const response = await axios.get(
          `/my-hiddenboxes/count?hiddenbox=${hiddenbox.id}`,
        );
        if (response.status === 200) {
          const theHiddenbox = hiddenboxes.find(
            (element) => element.id === hiddenbox.id,
          );
          theHiddenbox.orders = response.data;
        }
      }),
    );
    setSalesDataLoaded(true);
  };

  const fetchComments = async (hiddenboxId: number) => {
    try {
      const response = await axios.get(
        `/hiddenbox-comments?hiddenboxId=${hiddenboxId}`,
      );
      if (response.status === 200) {
        setComments(response.data);
        setCommentOpen(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickComment = (hiddenbox) => {
    if (targetHiddenbox && hiddenbox.id === targetHiddenbox.id) {
      fetchComments(hiddenbox.id);
    } else {
      setTargetHiddenbox(hiddenbox);
    }
  };

  const onClickDelete = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      const hiddenboxId = selectedHiddenboxes[0];
      const response = await axios.put(
        `/hiddenboxes/${hiddenboxId.toString()}`,
        {
          isDeleted: true,
        },
      );
      if (response.status === 200) {
        props.reload();
      }
    } catch (e) {
      alert('삭제할 수 없습니다. 관리자에게 문의해주세요.');
    } finally {
      setOpen(false);
    }
  };

  const handleTabsChange = (
    event: ChangeEvent<{}>,
    value: string,
  ): void => {
    const updatedFilters = {
      ...filters,
      beforeSale: null,
      onSale: null,
      afterSale: null,
      public: null,
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setSelectedHiddenboxes([]);
    setCurrentTab(value);
  };

  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setQuery(event.target.value);
  };

  const handleSortChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSort(event.target.value as Sort);
  };

  // const handleSelectAllHiddenboxes = (
  //   event: ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   setSelectedHiddenboxes(
  //     event.target.checked
  //       ? hiddenboxes.map((hiddenbox) => hiddenbox.id)
  //       : [],
  //   );
  // };

  const handleSelectOneHiddenbox = (
    event: ChangeEvent<HTMLInputElement>,
    hiddenboxId: number,
  ): void => {
    if (!selectedHiddenboxes.includes(hiddenboxId)) {
      setSelectedHiddenboxes((prevSelected) => [hiddenboxId]);
    } else {
      setSelectedHiddenboxes((prevSelected) =>
        prevSelected.filter((id) => id !== hiddenboxId),
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleWriteComment = async (message: string) => {
    try {
      const newComment = {
        hiddenboxId: targetHiddenbox.id,
        author: targetHiddenbox.author.id,
        message,
      };
      const response = await axios.post(
        `/hiddenbox-comments`,
        newComment,
      );
      if (response.status === 200) {
        fetchComments(targetHiddenbox.id);
      }
    } catch (e) {
    } finally {
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await axios.delete(
        `/hiddenbox-comments/${commentId}`,
      );
      if (response.status === 200) {
        fetchComments(targetHiddenbox.id);
      }
    } catch (e) {
    } finally {
    }
  };

  const handleUpdateComment = async (
    commentId: number,
    message: string,
  ) => {
    try {
      const response = await axios.put(
        `/hiddenbox-comments/${commentId}`,
        { message },
      );
      if (response.status === 200) {
        fetchComments(targetHiddenbox.id);
      }
    } catch (e) {
    } finally {
    }
  };

  const filteredHiddenboxes = applyFilters(
    hiddenboxes,
    query,
    filters,
  );
  const sortedHiddenboxes = applySort(filteredHiddenboxes, sort);
  const paginatedHiddenboxes = applyPagination(
    sortedHiddenboxes,
    page,
    limit,
  );
  const enableBulkActions = selectedHiddenboxes.length > 0;

  return <></>;
};

HiddenboxListTable.propTypes = {
  hiddenboxes: PropTypes.array.isRequired,
};

export default HiddenboxListTable;
