import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { DateTimePicker } from '@material-ui/lab';
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
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mode: string;
}

const HiddenreportCreatePresenter: FC<PopUpCreateProps> = (props) => {
  const {
    HRImageCreateState,
    dispatch,
    createNewHRimage,
    onChangeImage,
    mode,
  } = props;

  const { createInput, loading } = HRImageCreateState;
  console.log(createInput);
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
              <Typography color="textPrimary" variant="h6">
                이미지를 내용을 입력해주세요.
              </Typography>
              <Box sx={{ mt: 2 }}>
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
              </Box>
              <Box sx={{ mt: 2 }}>
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
              </Box>

              <Box sx={{ mt: 2 }}>
                <input
                  id="image"
                  name="image"
                  accept="image/*"
                  type="file"
                  onChange={onChangeImage}
                />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    dispatch({
                      type: HRImageCreateActionKind.CHANGE_IMAGE,
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
                  {loading && (
                    <div data-testid="news-list-loading">
                      <LinearProgress />
                    </div>
                  )}
                  <img
                    style={{ width: '100%' }}
                    alt={''}
                    src={
                      HRImageCreateState.createInput.thumbnailImageUrl
                    }
                  />
                </Box>
              </Box>
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
                  component={RouterLink}
                  to={`/dashboard/hiddenreports`}
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

export default HiddenreportCreatePresenter;
