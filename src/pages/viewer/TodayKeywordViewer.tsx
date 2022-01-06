import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@material-ui/core';
import TodayKeywordChart from '../../components/viewer/TodayKeywordChart';
import gtm from '../../lib/gtm';
import { apiServer } from 'src/lib/axios';
import type { Stock, Tag, TagData } from '../../types/todaykeyword';
import moment from 'moment';

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
  const [showKeyword, setShowKeyword] = useState(false);
  const [list] = useState<Stock[]>([]);
  const tagData = useRef({});
  const [tagArray, setTagArray] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(false);
  const [issueDatetime, setIssueDatetime] = useState(null);
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
        const { data, status } = await apiServer.get(
          `/analytics/todayKeyword`,
        );
        if (status === 200) {
          let tempArray = [];
          // eslint-disable-next-line array-callback-return
          data.keywords.map((keyword, i) => {
            tempArray.push({
              label: keyword.keyword,
              value: keyword.value,
              svalue: keyword.value,
              fillColor: colorsets[i],
            });
          });

          tempArray.sort((a, b) => {
            return parseInt(b.svalue) - parseInt(a.svalue);
          });

          const today = moment();
          const lastUpdate = moment(data.datetime);

          if (today.format('DD') === lastUpdate.format('DD')) {
            if (moment().format('HH') < '09') {
              setIssueDatetime('오늘 | 개장전');
            } else if (
              moment().format('HH') >= '09' &&
              moment().format('HH') < '16'
            ) {
              setIssueDatetime('오늘 | 정규장');
            } else if (
              moment().format('HH') >= '16' &&
              moment().format('HH') < '18'
            ) {
              setIssueDatetime('오늘 | 시간외');
            } else {
              setIssueDatetime('오늘 | 장마감');
            }
          } else {
            setIssueDatetime(
              lastUpdate.format('MM.DD 마감영업일 기준'),
            );
          }
          console.log('TempArray', tempArray);
          setTagArray(tempArray);
        }
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" color="black" sx={{ mr: 1 }}>
              {'Today Keyword'}
            </Typography>
            <Typography variant="body2" color="gray">
              {issueDatetime}
            </Typography>
          </Box>
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
