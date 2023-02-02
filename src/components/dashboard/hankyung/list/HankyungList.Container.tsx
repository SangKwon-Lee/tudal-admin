import _ from 'lodash';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import useAsync from 'src/hooks/useAsync';
import { APIHankyung, APIStock } from 'src/lib/api';
import HankyungListPresenter from './HankyungList.Presenter';
import { Stock } from 'src/types/schedule';
import { apiServer } from 'src/lib/axios';
import { HankyungList, TripleA } from 'src/types/hankyung';
import toast from 'react-hot-toast';
import PriceContext from 'src/contexts/price';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { fetchStockTodayPrice } from 'src/redux/stocks';
import { useNavigate } from 'react-router';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const move = (
  source,
  destination,
  droppableSource,
  droppableDestination,
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export default function HankyungListContainer() {
  const { registRealtimePrice, unregistRealtimePriceAll } =
    useContext(PriceContext);
  const router = useNavigate();

  const dispatch = useAppDispatch();
  const realTiemStocks = useAppSelector((state) => state.stocks);

  //* 수정인지 등록인지
  const [mode, setMode] = useState('create');

  //* 먹기 클릭
  const [tabValue, setTabValue] = useState(0);

  //* 트리플 A
  const [tripleA, setTripleA] = useState<TripleA[]>([]);

  //* 종목 검색 리스트
  const [stocks, setStocks] = useState<Stock[]>([]);
  const stockInput = useRef(null);

  //* 게시글 리스트
  const [list, setList] = useState<HankyungList[]>([]);

  //*  인풋
  const [input, setInput] = useState({
    id: 0,
    title: '',
    comment: '',
  });

  //* API 검색
  const [query, setQuery] = useState({
    _q: '',
  });

  //*sort
  const [sort, setSort] = useState('ratioByCapturePrice');

  //* 종목 정보
  const [stocksInput, setStocksInput] = useState([]);
  //* dnd 종목
  const [dndStocks, setDndStocks] = useState([[], []]);
  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    if (sInd === dInd) {
      const items = reorder(
        dndStocks[sInd],
        source.index,
        destination.index,
      );
      let newState = [...dndStocks];
      //@ts-ignore
      newState[sInd] = items;
      newState = newState.filter((group) => group.length);
      newState = newState.map((item, ind) =>
        item.map((data, index) => {
          data.index = ind === 0 ? index + 1 : index + 6;
          return data;
        }),
      );
      if (newState[1]) {
        setDndStocks(newState);
      } else {
        setDndStocks([...newState, []]);
      }
    } else {
      const result = move(
        dndStocks[sInd],
        dndStocks[dInd],
        source,
        destination,
      );
      let newState = [...dndStocks];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
      newState = newState.filter((group) => group.length);
      newState = newState.map((item, ind) =>
        item.map((data, index) => {
          data.index = ind === 0 ? index + 1 : index + 6;
          return data;
        }),
      );
      console.log(newState, '여기요');
      setDndStocks(newState);
    }
  }
  //* 카테고리 변경
  const [category, setCategory] = useState('시초먹기');
  const handleCategory = (e: any) => {
    setCategory(e.target.value);
  };

  //* sort
  const handleSort = (e) => {
    setSort(e.target.value);
  };

  //* 탭 검색 변경
  const handleTab = (e: any, newValue: number) => {
    setTabValue(newValue);
  };

  //* 인풋
  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  //* API 검색
  const handleQuery = (e: any) => {
    setQuery({
      ...query,
      _q: e.target.value,
    });
  };

  //* reset
  const handleReset = () => {
    setStocksInput([]);
    setStocks([]);
    setInput({
      ...input,
      id: 0,
      title: '',
      comment: '',
    });
    setDndStocks([[], []]);
    setMode('create');
    unregistRealtimePriceAll();
  };

  //* 종목 정보 입력
  const handleStocksInput = (e: any, stockcode: string) => {
    let newStocks = [...stocksInput];
    // eslint-disable-next-line array-callback-return
    newStocks.map((data) => {
      if (stockcode === data.stockCode) {
        if (e.target.name === 'idea') {
          data[e.target.name] = e.target.value;
        } else {
          data[e.target.name] = Number(e.target.value);
        }
      }
    });
    setStocksInput(newStocks);
  };

  //* Dnd종목 정보 입력
  const handleDndStockInput = (e: any, stockcode: string) => {
    let newStocks = [...dndStocks[0].flat(), ...dndStocks[1].flat()];
    // eslint-disable-next-line array-callback-return
    newStocks.map((data) => {
      if (stockcode === data.stockCode) {
        if (e.target.name === 'idea') {
          data[e.target.name] = e.target.value;
        } else if (
          e.target.name === 'isBlur' ||
          e.target.name === 'isReco'
        ) {
          data[e.target.name] = e.target.checked;
        } else {
          data[e.target.name] = Number(e.target.value);
        }
      }
    });
    if (e.target.name === 'isBlur' || e.target.name === 'isReco') {
      setDndStocks([newStocks.slice(0, 5), newStocks.slice(5, 10)]);
    } else {
      handleDndStockDebounce(newStocks);
    }
  };

  const handleDndStockDebounce = _.debounce((newStocks) => {
    setDndStocks([newStocks.slice(0, 5), newStocks.slice(5, 10)]);
  }, 500);

  //* 매매 등록
  const postOpeningTrading = useCallback(async () => {
    try {
      let newStocks = [];
      if (category === '장중먹기') {
        newStocks = [...dndStocks[0].flat(), ...dndStocks[1].flat()];
      } else {
        newStocks = [...stocksInput];
      }
      const result = await Promise.all(
        newStocks.map(async (data) => {
          return await APIHankyung.createStocks(data);
        }),
      );
      const { status } = await APIHankyung.createTrading({
        title: input.title,
        category,
        comment: input.comment,
        stocks: result.map((data) => data.data.id),
      });
      if (status === 200) {
        toast.success('등록 됐습니다.');
        router(0);
      }
    } catch (e) {
      toast.error('에러 발생');
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocksInput, category, input, dndStocks]);
  console.log(stocksInput, dndStocks);
  //*  매매 수정
  const editOpeningTrading = useCallback(async () => {
    try {
      //* 장중먹기면 dndStocks 아니면 stocksInput
      let newStocks = [];
      if (category === '장중먹기') {
        newStocks = [...dndStocks[0].flat(), ...dndStocks[1].flat()];
      } else {
        newStocks = [...stocksInput];
      }
      const result = await Promise.all(
        newStocks.map(async (data) => {
          if (data.id) {
            return await APIHankyung.editStocks(data.id, data);
          } else {
            return await APIHankyung.createStocks(data);
          }
        }),
      );
      const { status } = await APIHankyung.editTrading(input.id, {
        title: input.title,
        category,
        comment: input.comment,
        stocks: result.map((data) => data.data.id),
      });
      if (status === 200) {
        toast.success('수정 됐습니다.');
        router(0);
      }
    } catch (e) {
      toast.error('에러 발생');
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocksInput, input, category, dndStocks]);

  const deleteTrading = async (id) => {
    try {
      const { status } = await APIHankyung.deleteTrading(id);
      if (status === 200) {
        toast.success('삭제 됐습니다.');
        router(0);
      }
    } catch (e) {
      toast.error('에러 발생');
      console.log(e);
    }
  };

  // * 트리플 A 가져오기
  const getTripleA = useCallback(async () => {
    try {
      const { data, status } = await apiServer.get(
        '/search/tripleA?limit=10',
      );
      if (status === 200 && Array.isArray(data.stockList)) {
        setTripleA(data.stockList);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  //* 게시글 가져오기
  const getList = useCallback(async () => {
    try {
      const { data, status } = await APIHankyung.getTradings(query);
      if (status === 200) {
        setList(data);
      }
    } catch (e) {
      toast.error('에러 발생');
      console.log(e);
    }
  }, [query]);

  //* 클릭한 게시글 정보 가져오기
  const getListInfo = useCallback(
    async (id) => {
      setMode('edit');
      try {
        const { data, status } = await APIHankyung.getTradingInfo(id);
        if (status === 200) {
          setCategory(data.category);
          setInput({
            ...input,
            id: data.id,
            title: data.title,
            comment: data.comment,
          });
          setStocksInput(data.stocks);
          setMode('edit');
          if (data.category !== '장중먹기') {
            let newStocks = [...data.stocks];
            newStocks = newStocks.map((data) => {
              data.code = data.stockCode;
              data.name = data.stockName;
              // eslint-disable-next-line no-self-assign
              data.id = data.id;
              return data;
            });
            setStocks(newStocks);
          } else {
            let newStocks = [...data.stocks];
            newStocks = newStocks
              .sort((a, b) => a.index - b.index)
              .map((data) => {
                data.code = data.stockCode;
                data.name = data.stockName;
                // eslint-disable-next-line no-self-assign
                data.id = data.id;
                data.dragId = `${new Date().getTime() + data.id}`;
                return data;
              });
            setDndStocks([
              newStocks.slice(0, 5),
              newStocks.slice(5, 15),
            ]);
          }
        }
      } catch (e) {
        toast.error('에러 발생');
        console.log(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, mode],
  );

  //* dnd 종목 추가
  const handleAddDndStocks = useCallback(
    (e) => {
      let newStocks = [
        ...dndStocks[0].flat(),
        ...dndStocks[1].flat(),
      ];
      if (
        newStocks.filter((data) => data.stockCode === e.stockCode)
          .length === 0
      ) {
        newStocks = [
          ...newStocks,
          {
            dragId: `item-${String(new Date().getTime())}`,
            stockCode: e.stockCode,
            stockName: e.stockName,
            recoPrice: 0,
            targetPrice: 0,
            stoplossPrice: 0,
            isBlur: false,
            isReco: false,
            index: newStocks.length + 1,
          },
        ];
        setDndStocks([newStocks.slice(0, 5), newStocks.slice(5, 10)]);
      }
    },
    [dndStocks],
  );

  //* dnd 종목 삭제
  const handleRemoveDndStocks = (e) => {
    let newStocks = [...dndStocks[0].flat(), ...dndStocks[1].flat()];
    newStocks = newStocks.filter((data) => data.stockCode !== e);
    setDndStocks([newStocks.slice(0, 5), newStocks.slice(5, 10)]);
  };

  // *종목 변경
  const onStockChange = (event, stock: Stock[], reason, item) => {
    switch (reason) {
      case 'selectOption':
        if (
          stocks.filter((data) => data.id === item.option.id).length >
          0
        ) {
          return;
        }
        setStocks([...stocks, item.option]);
        setStocksInput([
          ...stocksInput,
          {
            stockCode: item.option.code,
            stockName: item.option.name,
            stockId: item.option.id,
          },
        ]);
        break;
      case 'removeOption':
        let newStocks = [...stocks];
        newStocks = newStocks.filter(
          (stocks) => stocks.id !== item.option.id,
        );
        let newStocksInput = [...stocksInput];
        newStocksInput = newStocksInput.filter(
          (stocks) => stocks.stockCode !== item.option.code,
        );
        setStocks(newStocks);
        setStocksInput(newStocksInput);
        break;
      case 'clear':
        setStocks([]);
        setStocksInput([]);
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
    if (category === '장중먹기') {
      getTripleA();
    }
  }, [category, getTripleA]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if (Array.isArray(stocks) && stocks.length > 0) {
      const fetchedStocks: string[] = [];
      // eslint-disable-next-line array-callback-return
      stocks.map((data) => {
        if (
          fetchedStocks.find(
            (item) => item === data.code.replaceAll('A', ''),
          ) ||
          !data.code.replaceAll('A', '')
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          data.code.replaceAll('A', '') ? '' : null;
          // eslint-disable-next-line array-callback-return
          return;
        }
        dispatch(fetchStockTodayPrice(data.code.replaceAll('A', '')));
        fetchedStocks.push(data.code.replaceAll('A', ''));
      });
      registRealtimePrice(fetchedStocks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks]);

  useEffect(() => {
    if (mode === 'create') {
      if (Array.isArray(dndStocks) && dndStocks.length > 0) {
        const fetchedStocks: string[] = [];
        // eslint-disable-next-line array-callback-return
        if (
          Array.isArray(dndStocks[0]) &&
          Array.isArray(dndStocks[1])
        ) {
          let newStocks = [
            ...dndStocks[0].flat(),
            ...dndStocks[1].flat(),
          ];
          // eslint-disable-next-line array-callback-return
          newStocks.map((data) => {
            if (
              fetchedStocks.find(
                (item) => item === data.stockCode.replaceAll('A', ''),
              ) ||
              !data.stockCode.replaceAll('A', '')
            ) {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              data.stockCode.replaceAll('A', '') ? '' : null;
              // eslint-disable-next-line array-callback-return
              return;
            }
            dispatch(
              fetchStockTodayPrice(
                data.stockCode.replaceAll('A', ''),
              ),
            );
            fetchedStocks.push(data.stockCode.replaceAll('A', ''));
          });
          registRealtimePrice(fetchedStocks);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dndStocks]);

  useEffect(() => {
    return () => {
      unregistRealtimePriceAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HankyungListPresenter
      list={list}
      onDragEnd={onDragEnd}
      mode={mode}
      sort={sort}
      handleSort={handleSort}
      input={input}
      stocks={stocks}
      tripleA={tripleA}
      category={category}
      tabValue={tabValue}
      stockList={stockList}
      dndStocks={dndStocks}
      handleTab={handleTab}
      stockInput={stockInput}
      handleReset={handleReset}
      getListInfo={getListInfo}
      stocksInput={stocksInput}
      handleQuery={handleQuery}
      handleInput={handleInput}
      stockLoading={stockLoading}
      onStockChange={onStockChange}
      handleCategory={handleCategory}
      handleAddDndStocks={handleAddDndStocks}
      handleStocksInput={handleStocksInput}
      handleStockChange={handleStockChange}
      editOpeningTrading={editOpeningTrading}
      handleRemoveDndStocks={handleRemoveDndStocks}
      handleDndStockInput={handleDndStockInput}
      postOpeningTrading={postOpeningTrading}
      realTiemStocks={realTiemStocks}
      deleteTrading={deleteTrading}
    ></HankyungListPresenter>
  );
}
