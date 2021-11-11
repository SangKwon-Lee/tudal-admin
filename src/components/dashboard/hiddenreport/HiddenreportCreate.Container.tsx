import {
  useState,
  useRef,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import type { FC } from 'react';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { cmsServer } from '../../../lib/axios';
import HiddenReportCreatePresenter from './HiddenreportCreate.Presenter';
import { AxiosError, AxiosResponse } from 'axios';
import useAuth from 'src/hooks/useAuth';

import useAsync from 'src/hooks/useAsync';
import { Stock, Tag } from 'src/types/schedule';
import { APIHR, APIMaster, APIStock, APITag } from 'src/lib/api';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { IHRImage } from 'src/types/hiddenreport';
import dayjs, { Dayjs } from 'dayjs';

interface HiddenReportCreateContainerProps {
  mode: string;
  reportId?: number;
}

export enum HiddenReportCreateActionKind {
  LOADING = 'LOADING',

  // Load APIS
  GET_REPORT = 'GET_REPORT',

  // Changes
  CHANGE_TAGS = 'CHANGE_TAGS',
  CHANGE_STOCKS = 'CHANGE_STOCKS',
  CHANGE_INPUT = 'CHANGE_INPUT',
}
export interface HiddenReportCreateAction {
  type: HiddenReportCreateActionKind;
  payload?: any;
}

interface IHiddenReportForm {
  id?: number; // 수정하는 경우 ID 필요
  title: string;
  hidden_report_image: IHRImage; // IHRImage ID
  thumnail_text: string;
  price: number;
  category: string;
  intro: string;
  catchphrase: string;
  summary: string;
  reason: string;
  contents: string;
  pdfUrl: string;
  expirationDate: Date;
  stocks: Stock[];
  tags: Tag[];
}

export interface HiddenReportCreateState {
  loading: boolean;
  newReport: IHiddenReportForm;
}
const monthLater = new Date();
monthLater.setMonth(monthLater.getMonth() + 1);

const initialState: HiddenReportCreateState = {
  loading: true,
  newReport: {
    title: '',
    thumnail_text: '',
    price: 5,
    category: '',
    intro: '',
    catchphrase: '',
    summary: '',
    reason: '',
    contents: '',
    pdfUrl: '',
    stocks: [],
    tags: [],
    expirationDate: monthLater,
    hidden_report_image: null, // IHRImage ID
  },
};

const HiddenReportCreateReducer = (
  state: HiddenReportCreateState,
  action: HiddenReportCreateAction,
): HiddenReportCreateState => {
  const { type, payload } = action;
  switch (type) {
    case HiddenReportCreateActionKind.LOADING:
      return {
        ...state,
        loading: true,
      };
    case HiddenReportCreateActionKind.GET_REPORT:
      return {
        ...state,
        newReport: payload,
        loading: false,
      };
    case HiddenReportCreateActionKind.CHANGE_INPUT:
      return {
        ...state,
        newReport: {
          ...state.newReport,
          [payload.target.name]: payload.target.value,
        },
      };
    case HiddenReportCreateActionKind.CHANGE_STOCKS:
      return {
        ...state,
        newReport: {
          ...state.newReport,
          stocks: payload,
        },
      };
    case HiddenReportCreateActionKind.CHANGE_TAGS:
      return {
        ...state,
        newReport: {
          ...state.newReport,
          tags: payload,
        },
      };
  }
};

const HiddenReportCreateContainer: FC<HiddenReportCreateContainerProps> =
  (props) => {
    const { mode, reportId } = props;
    const { user } = useAuth();
    const [reportCreateState, dispatch] = useReducer(
      HiddenReportCreateReducer,
      initialState,
    );
    const tagInput = useRef(null);
    const stockInput = useRef(null);

    //* 수정 시 기존 데이터 불러오기
    const getReport = async () => {
      dispatch({ type: HiddenReportCreateActionKind.LOADING });
      try {
        if (reportId.toString() === '0') return;
        const { status, data } = await APIHR.get(reportId.toString());
        if (status === 200) {
          const {
            id,
            title,
            thumnail_text,
            price,
            category,
            catchphrase,
            intro,
            summary,
            reason,
            contents,
            pdfUrl,
            stocks,
            tags,
            hidden_report_image,
            expirationDate,
          } = data;

          const newReportData: IHiddenReportForm = {
            id,
            title,
            thumnail_text,
            price,
            category,
            catchphrase,
            intro,
            summary,
            reason,
            contents,
            pdfUrl,
            stocks,
            tags,
            hidden_report_image,
            expirationDate,
          };
          dispatch({
            type: HiddenReportCreateActionKind.GET_REPORT,
            payload: newReportData,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    //* 수정 모드일 때 데이터 불러오기
    useEffect(() => {
      if (mode === 'edit') {
        getReport();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //* 웹 에디터에 전달되는 Props
    const editorRef = useRef(null);
    const log = () => {
      if (editorRef.current) {
        return editorRef.current.getContent();
      }
    };

    //* Submit
    const handleSubmit = async (event: any): Promise<void> => {
      event.preventDefault();

      try {
        const contents = log();
        const newReport = {
          ...reportCreateState.newReport,
          tags:
            reportCreateState.newReport.tags.map((data) => data.id) ||
            [],
          stocks:
            reportCreateState.newReport.stocks.map(
              (data) => data.id,
            ) || [],
          contents,
        };

        let response: AxiosResponse;
        if (mode === 'create') {
          response = await APIHR.create(newReport);
        } else {
          response = await APIHR.update(newReport);
        }

        if (response.status === 200) {
          alert('등록되었습니다.');
        }
      } catch (err) {
        console.log(err);
      }
    };

    //* 태그 관련
    const getTagList = useCallback(() => {
      const value = tagInput.current ? tagInput.current.value : '';
      return APITag.getList({ _q: value });
    }, [tagInput]);

    const [{ data: tagList, loading: tagLoading }, refetchTag] =
      useAsync<Tag[]>(getTagList, [tagInput.current], []);
    const handleTagChange = _.debounce(refetchTag, 300);

    //* 종목 관련
    const getStockList = useCallback(() => {
      return APIStock.getSimpleList();
    }, []);
    const [{ data: stockList, loading: stockLoading }, refetchStock] =
      useAsync<any>(getStockList, [], []);
    const handleStockChange = _.debounce(refetchStock, 300);

    return (
      <HiddenReportCreatePresenter
        reportCreateState={reportCreateState}
        dispatch={dispatch}
        editorRef={editorRef}
        handleSubmit={handleSubmit}
        tagList={tagList}
        tagInput={tagInput}
        tagLoading={tagLoading}
        handleTagChange={handleTagChange}
        stockList={stockList}
        stockLoading={stockLoading}
        stockInput={stockInput}
        handleStockChange={handleStockChange}
      />
    );
  };

export default HiddenReportCreateContainer;
