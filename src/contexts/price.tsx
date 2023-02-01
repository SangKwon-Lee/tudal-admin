/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import {
  ReactNode,
  useState,
  useRef,
  createContext,
  useEffect,
} from 'react';
import SocketManager from '../price-manager/socket-manager';
import { usePageVisibility } from 'react-page-visibility';
import { useAppDispatch } from '../redux/hooks';
import { set, unset } from 'src/redux/stocks';

interface IndexValue {
  value: number;
  diff: number;
  ratio: number;
  name: string;
}

const PRICE_HOST = 'wss://price.tudal.co.kr:4799';
const indices = [
  {
    symbol: 'kospi',
    code: '001',
    name: '코스피',
  },
  {
    symbol: 'kosdaq',
    code: '301',
    name: '코스닥',
  },
];
interface PriceContextValue {
  connected: boolean;
  registRealtimePrice: (stockcodes: string[]) => void;
  unregistRealtimePriceAll: () => void;
  fetchIndicesPrice: () => Promise<IndexValue[]>;
}

const PriceContext = createContext<PriceContextValue>(
  {} as PriceContextValue,
);

type IListener = (event: string) => void;

interface Props {
  children: ReactNode;
}

export function PriceProvider({ children }: Props) {
  const socketManager = useRef<SocketManager | undefined>(undefined);
  const queryManager = useRef<any | undefined>(undefined);
  const [connected, setConnected] = useState(false);
  const pageIsVisible = usePageVisibility();
  const listeningStocks = useRef<string[]>([]);
  const dispatch = useAppDispatch();
  const [manager, setManager] = useState<any | undefined>(undefined);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (pageIsVisible) {
      console.log('[PriceContext] Page is visible');
      connect();
    } else {
      console.log('[PriceContext] Page is not visible');
      disconnect();
    }
  }, [pageIsVisible]);

  const connect = async () => {
    if (!PRICE_HOST) return;
    if (!socketManager.current) {
      socketManager.current = new SocketManager(PRICE_HOST, {});
      socketManager.current.addListener(listener);
    }
    queryManager.current = socketManager.current.connect(PRICE_HOST);
    setManager(await queryManager.current);
  };

  const disconnect = () => {
    if (manager && queryManager.current && socketManager.current) {
      socketManager.current.removeListener();
      manager.stopManager();
    }
    socketManager.current = undefined;
    queryManager.current = undefined;
    setManager(undefined);
  };

  const listener: IListener = (event: string) => {
    console.log('[PriceContext] listener: ', event);
    if (event === 'Connected' && connected === false) {
      setConnected(true);
      registRealtimePrice(listeningStocks.current, false);
    } else if (event === 'Closed' && connected === true) {
      setConnected(false);
    }
  };

  const registRealtimePrice = async (
    stockcodes: Array<any>,
    push = true,
  ) => {
    if (manager === undefined) return;

    //const manager = await queryManager.current;
    console.log('[SocketContext] registRealtimePrice: ', stockcodes);
    stockcodes.map((stockcode) => {
      // 이미 존재하면 추가하지 않는다.
      if (
        !queryManager.current ||
        listeningStocks.current.find((item) => item === stockcode)
      )
        return;
      if (push) {
        listeningStocks.current.push(stockcode);
      }

      // 혹 오류로 인해 중복 등록되는 것을 막는다.
      manager.unregisterReal('KBRSKXS3', ['A' + stockcode], 'app');
      manager.registerReal(
        'KBRSKXS3',
        'rl_tm_key',
        ['A' + stockcode],
        'app',
        function (queryData: any) {
          if (!queryData) {
            return;
          }
          realtimeDataListener(
            stockcode,
            queryData.getBlockData('OutBlock1')[0],
          );
        },
      );
    });
    console.log(
      '[SocketContext] listening stocks: ',
      listeningStocks.current,
    );
  };

  const unregistRealtimePriceAll = async () => {
    //const manager = await queryManager.current;

    listeningStocks.current.map((stockcode) => {
      dispatch(unset({ code: stockcode }));
      if (!queryManager.current || !manager) return;
      manager.unregisterReal('KBRSKXS3', ['A' + stockcode], 'app');
    });
    listeningStocks.current = [];
    console.log(
      '[SocketContext] listening stocks: ',
      listeningStocks.current,
    );
  };

  const realtimeDataListener = (stockcode: string, data: any) => {
    dispatch(
      set({
        code: stockcode,
        price: parseInt(data.now_prc),
        ratio: parseFloat(data.up_dwn_r_p2),
        open: parseInt(data.opn_prc),
        diff:
          parseFloat(data.up_dwn_r_p2) > 0
            ? parseInt(data.bdy_cmpr)
            : -parseInt(data.bdy_cmpr),
        high: parseInt(data.hgh_prc),
        low: parseInt(data.lw_prc),
        last:
          parseFloat(data.up_dwn_r_p2) > 0
            ? parseInt(data.now_prc) - parseInt(data.bdy_cmpr)
            : parseInt(data.now_prc) + parseInt(data.bdy_cmpr),
      }),
    );
  };

  const fetchIndicesPrice = () => {
    return new Promise<IndexValue[]>(async (resolve, reject) => {
      if (manager === undefined || !connected) reject(false);
      try {
        //const manager = await queryManager.current;
        manager.sendProcessByName(
          'i0006',
          function (queryData: any) {
            if (!queryData) {
              reject('no query data');
            }

            const block = queryData.getBlockData('InBlock1')[0];
            block['upcode_cnt'] = indices.length;
            const block2 = queryData.getBlockData('InBlock2');
            indices.map((item) => {
              block2.push({
                upcode: item.code,
              });
            });
          },

          function (queryData: any) {
            if (!queryData) {
              reject('no query data');
            }

            let results = queryData.getBlockData('OutBlock2');

            const data: IndexValue[] = indices.map((item, i) => {
              const price = results[i];
              const before_price =
                price.pricejisu +
                (price.sign >= '4' ? price.change : -price.change);
              const diff =
                price.sign >= '4' ? -price.change : price.change;

              const theIndex: IndexValue = {
                name: item.name,
                value: price.pricejisu,
                diff: diff,
                ratio: parseFloat(
                  ((diff / before_price) * 100).toFixed(2),
                ),
              };
              return theIndex;
            });
            resolve(data);
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <PriceContext.Provider
      value={{
        connected,
        registRealtimePrice,
        unregistRealtimePriceAll,
        fetchIndicesPrice,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}

export default PriceContext;
