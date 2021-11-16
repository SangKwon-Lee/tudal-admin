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
import HiddenReportContentForm from './HiddenreportCreateContentForm.Presenter';
import { AxiosResponse } from 'axios';

import useAsync from 'src/hooks/useAsync';
import { Stock, Tag } from 'src/types/schedule';
import { APIHR, APIStock, APITag } from 'src/lib/api';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { IHRImage } from 'src/types/hiddenreport';
import { useNavigate } from 'react-router';
import HiddenReportCreateImageForm from './HiddenreportCreateImageForm.Presenter';
import HiddenReportDetailViewPresenter from './HiddenreportDetailView.Presenter';
import { registerImage } from 'src/utils/registerImage';
import { bucket_hiddenbox } from 'src/components/common/conf/aws';

export const HIDDENREPORT_CATEGORIES = {
  subject: [
    '국내주식',
    '국내상장 ETF',
    '해외주식',
    '해외상장 ETF',
    '암호화폐',
    '기타',
  ],
  type: [
    '업종/테마',
    '배당/리츠',
    '공무주/비상장',
    '트레이딩',
    '기타',
  ],
  counter: ['단기', '중기', '장기', '초장기(연금형)'],
};
interface HiddenReportCreateContainerProps {
  mode: string;
  reportId?: number;
  pageTopRef: React.RefObject<HTMLDivElement>;
}

export enum HiddenReportCreateActionKind {
  LOADING = 'LOADING',

  // Load APIS
  GET_REPORT = 'GET_REPORT',

  // Changes
  CHANGE_TAGS = 'CHANGE_TAGS',
  CHANGE_STOCKS = 'CHANGE_STOCKS',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_PDF = 'CHANGE_PDF',
  CHANGE_CATEGORY = 'CHANGE_CATEGORY',
  CHANGE_EXPIRATION_DATE = 'CHANGE_EXPIRATION_DATE',

  // images
  NEXT_PAGE = 'NEXT_PAGE',
  LOAD_IMAGES = 'LOAD_IMAGES',
  LOAD_MORE_IMAGES = 'LOAD_MORE_IMAGES',
  CHANGE_IMAGE = 'CHANGE_IMAGE',
  CHANGE_SEARCH = 'CHANGE_SEARCH',
}
export interface HiddenReportCreateAction {
  type: HiddenReportCreateActionKind;
  payload?: any;
}

export interface IHiddenReportForm {
  id?: number; // 수정하는 경우 ID 필요
  title: string;
  hidden_report_image: IHRImage; // IHRImage ID
  price: number;
  intro: string;
  catchphrase: string;
  summary: string;
  reason: string;
  contents: string;
  pdfUrl: string;
  subject: string; // 대상 (카테고리)
  type: string; // 유형 (카테고리)
  counter: string; // 대응 전략 (카테고리)

  expirationDate: Date;
  stocks: Stock[];
  tags: Tag[];
}

export interface HiddenReportCreateState {
  loading: boolean;
  newReport: IHiddenReportForm;
  image: {
    list: IHRImage[];
    isLoadMoreAvailable: boolean;
    isAddingImageList: boolean;
    query: {
      _q: string;
      _limit: number;
      _start: number;
    };
  };
}
const monthLater = new Date();
monthLater.setMonth(monthLater.getMonth() + 1);

export const initialState: HiddenReportCreateState = {
  loading: false,
  newReport: {
    title: '',
    price: 5,
    subject: HIDDENREPORT_CATEGORIES.subject[0], // 대상 (카테고리)
    type: HIDDENREPORT_CATEGORIES.type[0], // 유형 (카테고리)
    counter: HIDDENREPORT_CATEGORIES.counter[0], // 대응 전략 (카테고리)
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
  image: {
    list: [],
    isAddingImageList: false,
    isLoadMoreAvailable: true,
    query: {
      _q: '',
      _limit: 15,
      _start: 0,
    },
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

    case HiddenReportCreateActionKind.CHANGE_IMAGE:
      return {
        ...state,
        newReport: {
          ...state.newReport,
          hidden_report_image:
            Number(state.newReport.hidden_report_image?.id) ===
            Number(payload.id)
              ? {}
              : payload,
        },
      };
    case HiddenReportCreateActionKind.CHANGE_PDF:
      return {
        ...state,
        newReport: {
          ...state.newReport,
          pdfUrl: payload,
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
    case HiddenReportCreateActionKind.CHANGE_EXPIRATION_DATE:
      return {
        ...state,
        newReport: {
          ...state.newReport,
          expirationDate: payload,
        },
      };
    case HiddenReportCreateActionKind.NEXT_PAGE:
      return {
        ...state,
        image: {
          ...state.image,
          isAddingImageList: true,
          query: {
            ...state.image.query,
            _start:
              state.image.list.length + state.image.query._limit,
          },
        },
      };

    case HiddenReportCreateActionKind.CHANGE_SEARCH:
      return {
        ...state,
        image: {
          ...state.image,
          isAddingImageList: false,
          query: {
            ...state.image.query,
            _start: 0,
            [payload.name]: payload.value,
          },
        },
      };

    case HiddenReportCreateActionKind.CHANGE_CATEGORY:
      return {
        ...state,
        newReport: {
          ...state.newReport,
          [payload.name]: payload.value,
        },
      };
    case HiddenReportCreateActionKind.LOAD_IMAGES:
      return {
        ...state,
        loading: false,
        image: {
          ...state.image,
          list: payload,
          isLoadMoreAvailable: true,
        },
      };
    case HiddenReportCreateActionKind.LOAD_MORE_IMAGES:
      return {
        ...state,
        loading: false,
        image: {
          ...state.image,
          list: [...state.image.list, ...payload],
          isLoadMoreAvailable: Boolean(payload.length),
        },
      };
  }
};

const HiddenReportCreateContainer: FC<HiddenReportCreateContainerProps> =
  (props) => {
    const { mode, reportId, pageTopRef } = props;
    const [step, setStep] = useState<number>(1);
    const [reportCreateState, dispatch] = useReducer(
      HiddenReportCreateReducer,
      initialState,
    );
    const tagInput = useRef(null);
    const stockInput = useRef(null);
    const navigate = useNavigate();

    const { newReport, image } = reportCreateState;
    const { stocks, tags } = newReport;

    //* 수정 시 기존 데이터 불러오기
    const getReport = async () => {
      dispatch({ type: HiddenReportCreateActionKind.LOADING });
      try {
        if (reportId.toString() === '0') return;
        const { status, data } = await APIHR.get(reportId.toString());
        if (status === 200) {
          console.log(data);
          const newReportData: IHiddenReportForm = {
            id: data.id,
            title: data.title,
            price: data.price,
            counter: data.counter,
            subject: data.subject,
            type: data.type,
            catchphrase: data.catchphrase,
            intro: data.intro,
            summary: data.summary,
            reason: data.reason,
            contents: data.contents,
            pdfUrl: data.pdfUrl,
            stocks: data.stocks,
            tags: data.tags,
            hidden_report_image: data.hidden_report_image,
            expirationDate: data.expirationDate,
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

    //* 웹 에디터에 전달되는 Props
    const editorRef = useRef(null);
    const log = () => {
      if (editorRef.current) {
        return editorRef.current.getContent();
      }
    };

    //* Submit
    const onSubmitContentForm = (data, e) => {
      try {
        // PDF 등록
        console.log(e);
        console.log('h21321321');
        const contents = log();
        const newReport: IHiddenReportForm = {
          ...data,
          contents,
          stocks: reportCreateState.newReport.stocks,
          tags: reportCreateState.newReport.tags,
        };
        console.log('here');

        dispatch({
          type: HiddenReportCreateActionKind.GET_REPORT,
          payload: newReport,
        });
        pageTopRef.current?.scrollIntoView();

        setStep((prev) => prev + 1);
      } catch (err) {
        console.log(err);
      }
    };

    const onSubmit = async () => {
      let response: AxiosResponse;

      const newReport = {
        ...reportCreateState.newReport,
        tags: tags.map((data) => data.id) || [],
        stocks: stocks.map((data) => data.id) || [],
      };

      try {
        if (mode === 'create') {
          response = await APIHR.create(newReport);
        } else {
          response = await APIHR.update(newReport);
        }

        if (response.status === 200) {
          toast.success('등록되었습니다.');
          navigate('/dashboard/hiddenreports');
        }
      } catch (error) {
        toast.success('에러가 발생했습니다.');
        console.log(error);
      }
    };

    const onTagChange = (event, keywords: Tag[], reason, item) => {
      const { tags } = newReport;
      if (tags.length >= 10) {
        toast.error(
          '등록할 수 있는 키워드는 10개로 제한되어 있습니다. 기존 키워드를 삭제하고 등록해주세요',
        );
        return;
      }
      switch (reason) {
        case 'selectOption':
          dispatch({
            type: HiddenReportCreateActionKind.CHANGE_TAGS,
            payload: [...newReport.tags, item.option],
          });
          break;
        case 'removeOption':
          dispatch({
            type: HiddenReportCreateActionKind.CHANGE_TAGS,
            payload: tags.filter((tag) => tag.id !== item.option.id),
          });
          break;
        case 'clear':
          dispatch({
            type: HiddenReportCreateActionKind.CHANGE_TAGS,
            payload: [],
          });
          break;
      }
    };

    const onStockChange = (event, stock: Stock[], reason, item) => {
      const { stocks } = newReport;
      if (stocks.length >= 10) {
        toast.error(
          '등록할 수 있는 종목은 10개로 제한되어 있습니다. 기존 종목을 삭제하고 등록해주세요',
        );
        return;
      }
      switch (reason) {
        case 'selectOption':
          dispatch({
            type: HiddenReportCreateActionKind.CHANGE_STOCKS,
            payload: [...newReport.stocks, item.option],
          });
          break;
        case 'removeOption':
          dispatch({
            type: HiddenReportCreateActionKind.CHANGE_STOCKS,
            payload: newReport.stocks.filter(
              (stocks) => stocks.id !== item.option.id,
            ),
          });
          break;
        case 'clear':
          dispatch({
            type: HiddenReportCreateActionKind.CHANGE_STOCKS,
            payload: [],
          });
          break;
      }
    };

    //* 이미지 조회
    const getImages = useCallback(async () => {
      dispatch({
        type: HiddenReportCreateActionKind.LOADING,
      });

      try {
        const { data, status } = await APIHR.getImageList(
          image.query,
        );

        if (status === 200) {
          dispatch({
            type: HiddenReportCreateActionKind.LOAD_IMAGES,
            payload: data,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, [image.query]);

    const getMoreImages = useCallback(async () => {
      try {
        dispatch({
          type: HiddenReportCreateActionKind.LOADING,
        });

        const { data, status } = await APIHR.getImageList(
          image.query,
        );

        if (status === 200) {
          dispatch({
            type: HiddenReportCreateActionKind.LOAD_MORE_IMAGES,
            payload: data,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, [image.query]);

    //* PDF 등록
    const onPDFChange = async (event) => {
      try {
        const file = event.target.files;

        const imageUrl = await registerImage(file, 'hiddenbox-photo');
        dispatch({
          type: HiddenReportCreateActionKind.CHANGE_PDF,
          payload: imageUrl,
        });
      } catch (error) {
        toast.error('파일 등록에 실패했습니다.');
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

    useEffect(() => {
      if (mode === 'edit') {
        getReport();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (image.isAddingImageList) {
        getMoreImages();
      }
    }, [getMoreImages, image.isAddingImageList]);

    useEffect(() => {
      if (!image.isAddingImageList) {
        getImages();
      }
    }, [getImages, image.isAddingImageList]);

    switch (step) {
      case 1:
        return (
          <HiddenReportContentForm
            reportCreateState={reportCreateState}
            dispatch={dispatch}
            editorRef={editorRef}
            onSubmitContentForm={onSubmitContentForm}
            tagList={tagList}
            tagInput={tagInput}
            tagLoading={tagLoading}
            handleTagChange={handleTagChange}
            stockList={stockList}
            stockLoading={stockLoading}
            stockInput={stockInput}
            handleStockChange={handleStockChange}
            onTagChange={onTagChange}
            onStockChange={onStockChange}
            onPDFChange={onPDFChange}
          />
        );
      case 2:
        return (
          <HiddenReportCreateImageForm
            reportCreateState={reportCreateState}
            dispatch={dispatch}
            getImages={getImages}
            setStep={setStep}
            mode={mode}
            reportId={reportId}
          />
        );
      case 3:
        return (
          <HiddenReportDetailViewPresenter
            state={reportCreateState.newReport}
            isCreating={true}
            setStep={setStep}
            onSubmit={onSubmit}
          />
        );
    }
  };

export default HiddenReportCreateContainer;
