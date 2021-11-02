import { useState, useEffect, useContext, useRef } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@material-ui/core';
import TodayKeywordChart from '../../components/viewer/TodayKeywordChart';
import gtm from '../../lib/gtm';
import { SocketContext } from '../../contexts/SocketContext';
import { apiServer } from 'src/lib/axios';
import type { Stock, Tag, TagData } from '../../types/todaykeyword';

const colorsets = [
  'f19066',
  'f5cd79',
  '94a1dd',
  'fea47f',
  'cf6a87',
  '93d4c3',
  '9aecdb',
  'bdc581',
  'b0efae',
  'f56464',
];

const TodayKeywordViewer: FC = () => {
  const { queryManager } = useContext(SocketContext);
  const [showKeyword, setShowKeyword] = useState(false);
  const [list, setList] = useState<Stock[]>([]);
  const tagData = useRef({});
  const [tagArray, setTagArray] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    const { width, height } = getWindowDimensions();
    setScreenSize({ width, height });
  }, []);

  useEffect(() => {
    const getTodayRanking = async () => {
      try {
        setLoading(true);
        queryManager.current.sendProcessByName(
          'i0043',
          function (queryData) {
            if (!queryData) {
              return;
            }

            var block = queryData.getBlockData('InBlock1')[0];
            // 0: 전체, 1: 코스피, 2: 코스닥
            block['exc_tp'] = '0';
            // 1:거래상위 2:상승률 3:하락률 4:시가총액상위
            block['gbn'] = '2';
            block['req_cnt'] = '20';
            block['req_page'] = '1';
          },
          function (queryData) {
            if (!queryData) {
              setShowKeyword(false);
              return;
            }

            // let result1 = queryData.getBlockData('OutBlock1');
            let result2 = queryData.getBlockData('OutBlock2');
            if (result2 && result2.length >= 20) {
              setList([...result2]);
            }
          },
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (screenSize.width !== 0 && screenSize.height !== 0) {
      getTodayRanking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  useEffect(() => {
    if (list.length === 20) {
      fetchTagsByList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const getWindowDimensions = () => {
    const width = window.screen.width;
    const height = window.screen.height;
    return {
      width,
      height,
    };
  };

  useEffect(() => {
    console.log('TagArray', tagArray);
  }, [tagArray]);

  const fetchTagsByList = () => {
    tagData.current = {};
    list.map(async (stock, index) => {
      const stockcode = stock.shcode.substring(1);

      const { data } = await apiServer.get<Tag[]>(
        `/stocks/${stockcode}/tags`,
      );
      let ratio = 0;
      if (
        stock.price !== 0 &&
        stock.jnilclose &&
        stock.jnilclose !== 0
      ) {
        ratio = (stock.price / stock.jnilclose - 1) * 100;
      }
      // 우선 ceiling 을 한다.
      let value: number = ratio <= 0 ? 0 : Math.ceil(ratio / 10);

      // eslint-disable-next-line array-callback-return
      data.map((tag) => {
        if (tagData.current[tag.name]) {
          tagData.current[tag.name] += value * tag.value;
        } else {
          tagData.current[tag.name] = value * tag.value;
        }
      });

      if (index === 19) {
        let tempArray = [];
        // eslint-disable-next-line array-callback-return
        Object.keys(tagData.current).map((key) => {
          tempArray.push({
            label: key,
            value: tagData.current[key],
            svalue: tagData.current[key],
          });
        });
        tempArray.sort((a, b) => {
          return parseInt(b.svalue) - parseInt(a.svalue);
        });
        const filteredArray = tempArray
          .splice(0, 10)
          .map((item, i) => ({ ...item, fillColor: colorsets[i] }));
        setTagArray(filteredArray);
      }
    });
  };

  useEffect(() => {
    if (tagArray.length >= 10) {
      setShowKeyword(true);
    }
  }, [tagArray]);

  const chartWidth =
    screenSize.width > 400 ? 400 - 40 : screenSize.width - 40;
  const chartHeight = (chartWidth * 3) / 4;

  return (
    <>
      <Helmet>
        <title>TUDAL | Today Keyword Viewer</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'white',
          height: screenSize.height,
          maxHeight: 400,
          width: screenSize.width,
          maxWidth: 400,
          py: 3,
        }}
      >
        <Container>
          <Typography variant="h5">{'Today Keyword'}</Typography>
          {showKeyword && !loading ? (
            <TodayKeywordChart
              data={tagArray}
              width={chartWidth}
              height={chartHeight}
            />
          ) : (
            <Box
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                height: chartHeight,
                width: chartWidth,
              }}
            >
              <Typography
                variant="body1"
                textAlign={'center'}
                lineHeight={'300px'}
                fontSize={screenSize.width < 400 ? '12px' : '14px'}
              >
                {'투데이키워드는 오전 9시부터 제공됩니다.'}
              </Typography>
            </Box>
          )}
          <Box>
            <Typography
              textAlign={'right'}
              color={'rgba(0,0,0,0.4)'}
              fontSize={12}
            >
              {'투데이키워드 서비스는 (주)이노핀에서 제공합니다.'}
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TodayKeywordViewer;
