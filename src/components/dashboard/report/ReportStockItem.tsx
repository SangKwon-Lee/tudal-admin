import { useState, useEffect, useContext } from 'react';
import type { FC } from 'react';
// import * as Yup from "yup";
// import { Formik } from "formik";
import { Box, Typography, Link } from '@material-ui/core';
import moment from 'moment';
import { apiServer } from '../../../lib/axios';
import CheckIcon from '../../../icons/Check';
import { SocketContext } from '../../../contexts/SocketContext';
import { priceFormat, ratioFormat } from '../../../utils/finance';

interface ReportStockItemProps {
  stock: any;
  startDate: string;
  endDate: string;
  showOnlyHaveNews: boolean;
}

const ReportStockItem: FC<ReportStockItemProps> = (props) => {
  const { stock, startDate, endDate, showOnlyHaveNews } = props;
  const [newsData, setNewsData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  // const [realtimePriceData, setRealtimePriceData] = useState({});
  const [info, setInfo] = useState<any>({});
  const { queryManager, connected, reconnect } =
    useContext(SocketContext);

  useEffect(() => {
    fetchNews();
    fetchPrice();
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connected) {
      fetchPrice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const fetchNews = async () => {
    const limit = 10;
    try {
      const response = await apiServer.get(
        `/stocks/${stock.code}/news?limit=${limit}`,
      );
      if (response.status === 200) {
        const filteredData = response.data.filter((item) =>
          moment(item.publishDate).isBetween(
            moment(startDate),
            moment(endDate),
          ),
        );
        setNewsData(filteredData);
      }
    } catch (error) {}
  };
  const fetchInfo = async () => {
    try {
      const response = await apiServer.get(
        `/stocks/${stock.code}/info`,
      );
      if (response.status === 200) {
        setInfo(response.data);
      }
    } catch (error) {}
  };

  const fetchPrice = () => {
    if (!queryManager || !queryManager.current) {
      if (reconnect) reconnect();
      return;
    }
    queryManager.current.sendProcessByName(
      'i0021',
      function (queryData) {
        if (queryData == null) {
          return;
        }
        var block = queryData.getBlockData('InBlock1')[0];
        // 조회구분
        block['shcode'] = 'A' + stock.code;
        block['date'] = moment(endDate).format('YYYYMMDD');
        block['req_cnt'] = moment(endDate).diff(
          moment(startDate),
          'days',
        );

        console.log('Block', block);
      },
      function (queryData) {
        if (queryData == null) {
          return;
        }

        let prices = [];
        queryData.getBlockData('OutBlock2').map((data) => {
          let newPrice = {
            date: data.date,
            code: stock.code,
            price: data.close,
            high: data.high,
            low: data.low,
            open: data.open,
            last:
              data.sign === '5'
                ? data.close + data.change
                : data.close - data.change,
            diff: data.sign === '5' ? -data.change : data.change,
            ratio: data.sign === '5' ? -data.updnrate : data.updnrate,
            volume: data.volume,
            value: data.value,
          };
          prices.push(newPrice);
        });

        /* OUTBLOCK
        {
          change: 0,
          close: 29050,
          date: "20201020",
          high: 0,
          low: 0,
          open: 0,
          sign: "3", // 2: 상승, 3: 보합: 5: 하락
          updnrate: 0, // 절대값으로 옴
          value: 0,
          volume: 0
        }
      */

        // close 데이터가 현재가이며, 장 마감시 전날 종가를 나타낸다.

        console.log('[StockItem] OutBlock1 - newPrice:', prices);
        setPriceData(prices);
      },
    );
  };

  let tagString = '';
  let tagData = [];
  info.tags &&
    info.tags.map((tag) => {
      const value = (
        Math.pow(0.98, moment().diff(tag.updated_at, 'days')) * 100
      ).toFixed(0);
      tagData.push({
        name: tag.name,
        value,
      });
    });
  tagData.sort((a, b) => {
    if (a.value - b.value > 0) {
      return -1;
    } else {
      return 1;
    }
  });
  tagData = tagData.slice(0, 5);
  tagData.map(
    (item) => (tagString += `#${item.name}(${item.value}) `),
  );

  if (newsData.length < 1 && showOnlyHaveNews) return null;
  return (
    <Box sx={{ mt: 3, p: 3, border: 1, borderColor: 'gray' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          color="textPrimary"
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          {`${stock.name}(${stock.code})`}
        </Typography>
        {priceData.length > 0 ? (
          <Typography
            color={
              priceData[0].ratio > 0
                ? 'red'
                : priceData[0].ratio < 0
                ? 'blue'
                : 'black'
            }
            variant="subtitle1"
            sx={{ ml: 2, mb: 2 }}
          >
            {`${priceFormat(priceData[0].last)}(${ratioFormat(
              priceData[0].ratio,
            )}%)`}
          </Typography>
        ) : null}
      </Box>
      <Typography color="primary" variant="subtitle2" sx={{ mb: 2 }}>
        {tagString}
      </Typography>
      {newsData.length > 0 ? (
        newsData.map((news) => {
          const price = priceData.find(
            (element) =>
              moment(news.publishDate).format('YYYYMMDD') ===
              element.date,
          );
          return (
            <Box
              key={`news-${stock.code}=${news.id}`}
              sx={{
                alignItems: 'center',
                display: 'flex',
                '& + &': {
                  mt: 2,
                },
              }}
            >
              <CheckIcon
                fontSize="small"
                sx={{ color: 'text.primary' }}
              />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    color="textPrimary"
                    sx={{
                      fontWeight: 'bold',
                      ml: 2,
                    }}
                    variant="body2"
                  >
                    {`[${moment(news.publishDate).format(
                      'YYYY-MM-DD',
                    )}] ${news.title}`}
                  </Typography>
                  <Link
                    color="blue"
                    target="_blank"
                    href={news.url}
                    variant="body2"
                    sx={{ ml: 1 }}
                  >
                    [링크]
                  </Link>
                </Box>
                {price ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      color={
                        price.ratio > 0
                          ? 'red'
                          : price.ratio < 0
                          ? 'blue'
                          : 'black'
                      }
                      sx={{
                        fontWeight: 500,
                        ml: 2,
                      }}
                      variant="body2"
                    >
                      {`${priceFormat(price.last)}(${ratioFormat(
                        price.ratio,
                      )}%)`}
                    </Typography>
                    <Typography
                      color={'textPrimary'}
                      sx={{
                        fontWeight: 500,
                        ml: 2,
                      }}
                      variant="body2"
                    >
                      {`거래량: ${priceFormat(
                        (price.volume / 1000000).toFixed(1),
                      )}백만`}
                    </Typography>
                    <Typography
                      color={'textPrimary'}
                      sx={{
                        fontWeight: 500,
                        ml: 2,
                      }}
                      variant="body2"
                    >
                      {`거래대금: ${priceFormat(
                        (price.value / 100000000).toFixed(1),
                      )}억`}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Box>
          );
        }) // end map
      ) : (
        <Typography
          color="textSecondary"
          sx={{
            fontWeight: 500,
            ml: 2,
          }}
          variant="body2"
        >
          {`해당 기간에 기사가 없습니다.`}
        </Typography>
      )}
    </Box>
  );
};

export default ReportStockItem;
