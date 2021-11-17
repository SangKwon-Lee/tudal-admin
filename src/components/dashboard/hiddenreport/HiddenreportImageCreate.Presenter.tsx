import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  LinearProgress,
  Grid,
} from '@material-ui/core';
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import {
  HRImageCreateAction,
  HRImageCreateActionKind,
  HRImageCreateState,
} from './HiddenreportImageCreate.Conatiner';
import { FC } from 'react';

interface PopUpCreateProps {
  HRImageCreateState: HRImageCreateState;
  dispatch: (params: HRImageCreateAction) => void;
  createNewHRimage: () => void;
  onChangeImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: HRImageCreateActionKind,
  ) => void;
  mode: string;
}

const HiddenreportImageCreatePresenter: FC<PopUpCreateProps> = (
  props,
) => {
  const {
    HRImageCreateState,
    dispatch,
    createNewHRimage,
    onChangeImage,
    mode,
  } = props;

  const { createInput, loading } = HRImageCreateState;
  return (
    <>
      <Formik
        initialValues={{
          submit: null,
        }}
        onSubmit={() => {}}
      >
        {({ setFieldValue }): JSX.Element => (
          <form>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    helperText={'제목을 입력해주세요.'}
                    label="제목"
                    name="name"
                    onChange={(event) => {
                      dispatch({
                        type: HRImageCreateActionKind.CHANGE_INPUT,
                        payload: event,
                      });
                    }}
                    value={createInput?.name || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    helperText={
                      '해당 이미지에 대한 키워드를 적어주세요.'
                    }
                    label="키워드"
                    name="keyword"
                    onChange={(event) => {
                      dispatch({
                        type: HRImageCreateActionKind.CHANGE_INPUT,
                        payload: event,
                      });
                    }}
                    value={createInput?.keyword || ''}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <Typography
                    color="textPrimary"
                    sx={{ mb: 1 }}
                    variant="subtitle1"
                  >
                    직사각형 썸네일 이미지
                  </Typography>

                  <input
                    id="image"
                    name="image"
                    accept="image/*"
                    type="file"
                    onChange={(e) =>
                      onChangeImage(
                        e,
                        HRImageCreateActionKind.CHANGE_THUMBNAIL_IMAGE,
                      )
                    }
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      dispatch({
                        type: HRImageCreateActionKind.CHANGE_THUMBNAIL_IMAGE,
                        payload: null,
                      });
                    }}
                  >
                    이미지 삭제
                  </Button>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    sx={{ mt: 1 }}
                  >
                    파일 이름이 너무 길 경우 오류가 생길 수 있습니다.
                    (15자 내외)
                  </Typography>
                  <Box>
                    <Typography sx={{ my: 2 }}>
                      이미지 미리보기
                    </Typography>
                    {loading && <LinearProgress />}
                    <img
                      style={{ width: '100%', maxHeight: 400 }}
                      alt={''}
                      src={
                        HRImageCreateState.createInput
                          .thumbnailImageUrl
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Typography
                    color="textPrimary"
                    sx={{ mb: 1 }}
                    variant="subtitle1"
                  >
                    정사각형 이미지
                  </Typography>

                  <input
                    id="image"
                    name="image"
                    accept="image/*"
                    type="file"
                    onChange={(e) =>
                      onChangeImage(
                        e,
                        HRImageCreateActionKind.CHANGE_SQUARE_IMAGE,
                      )
                    }
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      dispatch({
                        type: HRImageCreateActionKind.CHANGE_SQUARE_IMAGE,
                        payload: null,
                      });
                    }}
                  >
                    이미지 삭제
                  </Button>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    sx={{ mt: 1 }}
                  >
                    파일 이름이 너무 길 경우 오류가 생길 수 있습니다.
                    (15자 내외)
                  </Typography>
                  <Box>
                    <Typography sx={{ my: 2 }}>
                      이미지 미리보기
                    </Typography>
                    {loading && <LinearProgress />}
                    <img
                      style={{ width: '100%', maxHeight: 400 }}
                      alt={''}
                      src={
                        HRImageCreateState.createInput.squareImageUrl
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  mt: 6,
                }}
              >
                <Button
                  color="primary"
                  size="large"
                  variant="text"
                  component={RouterLink}
                  to={`/dashboard/popup`}
                >
                  이전
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={createNewHRimage}
                >
                  {mode === 'edit' ? '이미지 수정' : '이미지 생성'}
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </>
  );
};

export default HiddenreportImageCreatePresenter;
