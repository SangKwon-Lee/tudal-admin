import React, {
  useEffect,
  useRef,
  useReducer,
  ChangeEvent,
} from 'react';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import * as _ from 'lodash';
import {
  Priority,
  Stock,
  Tag,
  Category,
  Schedule,
} from 'src/types/schedule';

import useAuth from 'src/hooks/useAuth';
import useAsync from 'src/hooks/useAsync';
import {
  APICategory,
  APISchedule,
  APIStock,
  APITag,
} from 'src/lib/api';

import {
  tokenize,
  extractStocks,
  extractKeywords,
} from 'src/utils/extractKeywords';
import ScheduleFormPresenter from './ScheduleForm.Presenter';
import toast from 'react-hot-toast';

const formatDate = (date): string => dayjs(date).format('YYYY-MM-DD');

interface scheduleFormProps {
  handleUpdate: (shouldUpdate: boolean) => void;
  clearTargetModify: () => void;
  targetModify: Schedule;
}

export interface IScheduleFormState {
  title: string;
  comment: string;
  startDate: string;
  endDate: string;
  categories: Category[];
  stocks: Stock[];
  keywords: Tag[];
  priority: Priority;
  showConfirm: boolean;
  submitForm: boolean;
}

export interface IScheduleDispatch {
  type: ScheduleActionKind;
  payload?: any;
}

const initialSchedule: IScheduleFormState = {
  title: '',
  comment: '',
  stocks: [],
  keywords: [],
  categories: [],
  priority: Priority.LOW,
  startDate: formatDate(dayjs()),
  endDate: formatDate(dayjs()),

  showConfirm: false,
  submitForm: false,
};

export enum ScheduleActionKind {
  CLEAR = 'CLEAR',
  SET = 'SET',
  ADD_STOCK = 'ADD_STOCK',
  ADD_KEYWORD = 'ADD_KEYWORD',
  REPLACE_STOCK = 'REPLACE_STOCK',
  REPLACE_KEYWORD = 'REPLACE_KEYWORD',
  REPLACE_CATEGORY = 'REPLACE_CATEGORY',
  REPLACE_DATES = 'REPLACE_DATES',
  HANDLE_CHANGES = 'HANDLE_CHANGES',
  SHOW_CONFIRM = 'SHOW_CONFIRM',
  CLOSE_CONFIRM = 'CLOSE_CONFIRM',
  SUBMIT = 'SUBMIT',
}

interface ScheduleAction {
  type: ScheduleActionKind;
  payload?: any;
}

const scheduleFormReducer = (
  state: IScheduleFormState,
  action: ScheduleAction,
): IScheduleFormState => {
  const { type, payload } = action;

  switch (type) {
    case ScheduleActionKind.CLEAR:
      return initialSchedule;

    case ScheduleActionKind.HANDLE_CHANGES:
      const { name, value } = payload.target;
      return { ...state, [name]: value };

    case ScheduleActionKind.REPLACE_DATES:
      return {
        ...state,
        startDate: payload.startDate,
        endDate: payload.endDate,
      };

    case ScheduleActionKind.SET:
      return {
        ...initialSchedule,
        categories: payload.categories,
        stocks: payload.stocks,
        comment: payload.comment,
        endDate: payload.endDate,
        keywords: payload.keywords,
        priority: payload.priority,
        title: payload.title,
        startDate: payload.startDate,
      };

    case ScheduleActionKind.ADD_STOCK:
      if (_.find(state.stocks, ['code', payload.code])) {
        return state;
      }
      return { ...state, stocks: [...state.stocks, action.payload] };

    case ScheduleActionKind.REPLACE_STOCK:
      return { ...state, stocks: payload };

    case ScheduleActionKind.ADD_KEYWORD:
      if (_.find(state.keywords, ['id', payload.id])) {
        return state;
      }
      return {
        ...state,
        keywords: [...state.keywords, action.payload],
      };

    case ScheduleActionKind.REPLACE_KEYWORD:
      return { ...state, keywords: payload };

    case ScheduleActionKind.REPLACE_CATEGORY:
      return { ...state, categories: payload };

    case ScheduleActionKind.SHOW_CONFIRM: {
      return { ...state, showConfirm: true };
    }

    case ScheduleActionKind.CLOSE_CONFIRM: {
      return { ...state, showConfirm: false, submitForm: false };
    }

    case ScheduleActionKind.SUBMIT: {
      return { ...state, showConfirm: false, submitForm: true };
    }
  }
};

const ScheduleForm: React.FC<scheduleFormProps> = ({
  handleUpdate,
  targetModify,
  clearTargetModify,
}) => {
  const { user } = useAuth();
  const tagInput = useRef(null);

  const [newScheduleForm, dispatch] = useReducer(
    scheduleFormReducer,
    initialSchedule,
  );

  useEffect(() => {
    if (!targetModify) return;
    targetModify.endDate = formatDate(targetModify.endDate);
    targetModify.startDate = formatDate(targetModify.startDate);
    dispatch({
      type: ScheduleActionKind.SET,
      payload: targetModify,
    });
  }, [targetModify]);

  const { showConfirm } = newScheduleForm;
  const [stockListState] = useAsync<Stock[]>(
    APIStock.getList,
    [],
    [],
  );
  const [categoryListState] = useAsync<Category[]>(
    APICategory.getList,
    [],
    [],
  );
  const getTagList = () =>
    APITag.getList({ _q: tagInput.current.value });

  const [tagListState, _refetchTag] = useAsync<Tag[]>(
    getTagList,
    [tagInput.current],
    [],
  );

  const { data: stockList } = stockListState;
  const { data: tagList, loading: tagLoading } = tagListState;
  const { data: categoryList } = categoryListState;

  const refetchTag = debounce(_refetchTag, 300);

  const preProcess = async () => {
    const { categories, keywords, stocks } = newScheduleForm;

    const keywordCandidates = keywords
      .filter((keyword) => keyword.hasOwnProperty('isNew'))
      .map((keyword) => keyword.name);

    const newKeywords = await APITag.postItems(
      _.uniq(keywordCandidates),
    );
    const keywordIDs = keywords
      .filter((keyword) => !keyword.hasOwnProperty('isNew'))
      .concat(newKeywords)
      .map((keyword) => keyword && keyword.id);

    const categoryCandidates = categories
      .filter((category) => category.hasOwnProperty('isNew'))
      .map((category) => category.name);

    const newCategories = await APICategory.postItems(
      _.uniq(categoryCandidates),
    );
    const categoryIDs = categories
      .filter((category) => !category.hasOwnProperty('isNew'))
      .concat(newCategories)
      .map((category) => category && category.id);

    const stockCodes = stocks.map((stock) => stock.code);
    return { stockCodes, categoryIDs, keywordIDs };
  };

  const updateSchedule = async () => {
    const { stockCodes, categoryIDs, keywordIDs } =
      await preProcess();

    const { title, comment, priority, startDate, endDate } =
      newScheduleForm;
    await APISchedule.update({
      id: targetModify.id,
      title,
      comment,
      stockCodes,
      keywords: keywordIDs,
      categories: categoryIDs,
      priority,
      startDate,
      endDate,
    })
      .then(({ status }) => {
        if (status === 200) {
          handleUpdate(true);
          clearTargetModify();
          dispatch({ type: ScheduleActionKind.CLEAR });
          dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createSchedule = async () => {
    const { stockCodes, categoryIDs, keywordIDs } =
      await preProcess();

    const { title, comment, priority, startDate, endDate } =
      newScheduleForm;

    if (!title) {
      toast.error('제목을 입력해주세요.');
      dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM });

      return;
    }
    await APISchedule.create({
      title,
      comment,
      stockCodes,
      author: user.id,
      keywords: keywordIDs,
      categories: categoryIDs,
      priority,
      startDate,
      endDate,
    })
      .then(({ status }) => {
        if (status === 200) {
          handleUpdate(true);
          dispatch({ type: ScheduleActionKind.CLEAR });
          dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const _handleExtract = async (e: ChangeEvent<HTMLInputElement>) => {
    const sentence = e.target.value;
    try {
      const tokens = tokenize(sentence);
      if (!tokens) return;
      const { extractedStocks: stocks, tokenized: afterStock } =
        extractStocks(stockList, tokens);

      const tags = await extractKeywords(afterStock);
      stocks.forEach((stock) => {
        dispatch({
          type: ScheduleActionKind.ADD_STOCK,
          payload: stock,
        });
      });

      tags.forEach((tag) =>
        dispatch({
          type: ScheduleActionKind.ADD_KEYWORD,
          payload: tag,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleExtract = _.debounce(_handleExtract, 300);

  return (
    <ScheduleFormPresenter
      newScheduleForm={newScheduleForm}
      dispatch={dispatch}
      handleExtract={handleExtract}
      refetchTag={refetchTag}
      stockList={stockList}
      tagList={tagList}
      tagLoading={tagLoading}
      categoryList={categoryList}
      tagInput={tagInput}
      targetModify={targetModify}
      clearTargetModify={clearTargetModify}
      showConfirm={showConfirm}
      updateSchedule={updateSchedule}
      createSchedule={createSchedule}
    />
  );
};

export default React.memo(ScheduleForm);
