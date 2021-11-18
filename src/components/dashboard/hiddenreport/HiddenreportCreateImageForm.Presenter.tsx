import { useCallback, useEffect, useRef } from 'react';
import type { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  TextField,
  InputAdornment,
} from '@material-ui/core';

import blueGrey from '@material-ui/core/colors/blueGrey';
import DocumentTextIcon from 'src/icons/DocumentText';
import SearchIcon from 'src/icons/Search';

import * as _ from 'lodash';
import {
  HiddenReportCreateAction,
  HiddenReportCreateActionKind,
  HiddenReportCreateState,
} from './HiddenreportCreate.Container';
import toast from 'react-hot-toast';

interface HiddenReportCreateImageFormPresenterProps {
  reportCreateState: HiddenReportCreateState;
  mode: string;
  reportId: number;
  dispatch: (params: HiddenReportCreateAction) => void;
  getImages: (query) => void;
  setStep: (prev) => void;
}

const ImageCard = (props) => {
  const { image, isSelected, onChange } = props;

  return (
    <Grid item md={4} xs={12}>
      <Card
        style={{
          border: `${
            isSelected ? '5px solid rgb(69,76,199)' : 'none'
          }`,
          boxShadow: 'none',
        }}
        onClick={() => {
          image && onChange(image);
        }}
      >
        {image?.thumbnailImageUrl ? (
          <CardMedia
            image={image.thumbnailImageUrl}
            component="img"
            src={image.thumbnailImageUrl}
            sx={{
              backgroundColor: 'background.default',
              height: 200,
            }}
          />
        ) : (
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: blueGrey['50'],
              color: '#000000',
              display: 'flex',
              height: 140,
              justifyContent: 'center',
            }}
          >
            <DocumentTextIcon fontSize="large" />
          </Box>
        )}
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Typography color="textPrimary" variant="subtitle2">
              {image?.name || '이미지를 선택해주세요'}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};
const HiddenReportCreateImageFormPresenter: FC<HiddenReportCreateImageFormPresenterProps> =
  ({ reportCreateState, dispatch, setStep }) => {
    const { loading, image, newReport } = reportCreateState;
    const { isLoadMoreAvailable } = image;

    const showAlert = useRef(true);
    const loader = useRef<HTMLDivElement | null>(null);

    const onChangeSearch = _.debounce((e) => {
      const { value } = e.target;
      dispatch({
        type: HiddenReportCreateActionKind.CHANGE_SEARCH,
        payload: { name: '_q', value },
      });
      showAlert.current = true;
    }, 300);

    const handleObserver = useCallback(
      (entries) => {
        const target = entries[0];

        if (loading) return;

        if (!isLoadMoreAvailable) {
          showAlert.current &&
            toast.success('더이상 불러올 수 없습니다.');
          showAlert.current = false;
          return;
        }
        if (target.isIntersecting) {
          dispatch({
            type: HiddenReportCreateActionKind.NEXT_PAGE,
          });
        }
      },
      [isLoadMoreAvailable, dispatch, loading],
    );

    useEffect(() => {
      const option = {
        root: null,
        rootMargin: '5px',
        threshold: 0,
      };
      const observer = new IntersectionObserver(
        handleObserver,
        option,
      );
      if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    const handleNext = () => {
      if (!newReport.hidden_report_image?.id) {
        toast.error('이미지를 선택해주세요');
        return;
      }
      setStep((prev) => prev + 1);
    };
    const handlePrev = () => {
      setStep((prev) => prev - 1);
    };

    return (
      <>
        <Box
          sx={{
            display: 'flex',
            p: 2,
            justifyContent: 'space-between',
          }}
        >
          <Typography color="textPrimary" variant="h5">
            리포트에 사용될 썸네일 이미지를 선택해주세요
          </Typography>
          <Box
            sx={{
              p: 2,
              justifyContent: 'space-between',
            }}
          >
            <Button
              color="secondary"
              variant="contained"
              aria-label="add"
              onClick={handlePrev}
              style={{ marginRight: '10px' }}
            >
              뒤로가기
            </Button>
            <Button
              color="primary"
              variant="contained"
              aria-label="add"
              onClick={handleNext}
            >
              이미지 선택
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            m: -1,
            p: 2,
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 500,
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                id: 'search',
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              name="_q"
              placeholder="검색"
              variant="outlined"
              onChange={onChangeSearch}
            />
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: 'background.default',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100%',
            p: 3,
          }}
        >
          <Grid container spacing={3}>
            <ImageCard
              image={newReport.hidden_report_image}
              isSelected={
                newReport.hidden_report_image?.id ? true : false
              }
              onChange={(img) =>
                dispatch({
                  type: HiddenReportCreateActionKind.CHANGE_IMAGE,
                  payload: img,
                })
              }
            />

            {image.list.map((image, i) => {
              const isSelected =
                newReport.hidden_report_image?.id === image.id;
              return (
                <ImageCard
                  key={i}
                  image={image}
                  isSelected={isSelected}
                  onChange={(img) =>
                    dispatch({
                      type: HiddenReportCreateActionKind.CHANGE_IMAGE,
                      payload: img,
                    })
                  }
                />
              );
            })}
          </Grid>
        </Box>
        {!loading && image.list.length && <div ref={loader} />}
      </>
    );
  };

export default HiddenReportCreateImageFormPresenter;
