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
  PopUpCreateAction,
  PopUpCreateActionKind,
  PopUpCreateState,
} from './PopUpCreate.Container';
import { FC } from 'react';

interface PopUpCreateProps {
  dispatch: (params: PopUpCreateAction) => void;
  PopUpCreateState: PopUpCreateState;
  createNewPopUp: () => void;
  onChangeImgae: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mode: string;
}

const PopUpCreatePresenter: FC<PopUpCreateProps> = (props) => {
  const {
    PopUpCreateState,
    dispatch,
    createNewPopUp,
    onChangeImgae,
    mode,
  } = props;

  const { createInput, loading } = PopUpCreateState;
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
                팝업 내용을 입력해주세요.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  helperText={'제목을 입력해주세요.'}
                  label="제목"
                  name="title"
                  onChange={(event) => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_INPUT,
                      payload: event,
                    });
                  }}
                  value={createInput?.title || ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  helperText={'해당 팝업에 대한 내용을 적어주세요.'}
                  label="팝업 설명"
                  name="description"
                  onChange={(event) => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_INPUT,
                      payload: event,
                    });
                  }}
                  value={createInput?.description || ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  helperText={
                    '해당 팝업을 클릭시 이동할 링크를 입력해주세요.'
                  }
                  // error={submitError ? true : false}
                  label="링크"
                  name="link"
                  // onBlur={handleSubmitError}
                  onChange={(event) => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_INPUT,
                      payload: event,
                    });
                  }}
                  value={createInput?.link || ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  helperText={'링크에 대한 설명을 적어주세요.'}
                  // error={submitError ? true : false}
                  label="링크"
                  name="linkDescription"
                  // onBlur={handleSubmitError}
                  onChange={(event) => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_INPUT,
                      payload: event,
                    });
                  }}
                  value={createInput?.linkDescription || ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  select
                  helperText={'팝업의 타입을 골라주세요.'}
                  // error={submitError ? true : false}
                  label="타입"
                  SelectProps={{ native: true }}
                  name="type"
                  variant="outlined"
                  // onBlur={handleSubmitError}
                  onChange={(event) => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_INPUT,
                      payload: event,
                    });
                  }}
                  value={createInput?.type || ''}
                >
                  <option value="premium">프리미엄</option>
                  <option value="master">달인</option>
                  <option value="hiddenReport">히든리포트</option>
                </TextField>
              </Box>
              <Box sx={{ mt: 2, display: 'flex' }}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="공개 시간"
                  value={createInput?.openTime || ''}
                  onChange={(newValue) => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_OPENTIME,
                      payload: newValue,
                    });
                  }}
                />
                <Box sx={{ m: 2 }}></Box>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="종료 시간"
                  value={createInput?.closeTime || ''}
                  onChange={(newValue) => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_CLOSETIME,
                      payload: newValue,
                    });
                  }}
                />
              </Box>
              <Typography
                sx={{ mt: 1 }}
                color="textSecondary"
                variant="subtitle2"
              >
                위의 형식으로 타이핑 하거나, 달력을 클릭하여
                입력해주세요.
              </Typography>
              <Typography color="textSecondary" variant="subtitle2">
                타이핑시 마침표, 띄어쓰기까지 모두 제대로 입력해야
                합니다. ex) 2021.10.26. 01:19 오후 / 2021.10.26. 01:19
                오전
              </Typography>
              <Box sx={{ mt: 2 }}>
                <input
                  id="image"
                  name="image"
                  accept="image/*"
                  type="file"
                  onChange={onChangeImgae}
                />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_IMAGE,
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
                    src={PopUpCreateState.createInput.image}
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
                  onClick={createNewPopUp}
                >
                  {mode === 'edit' ? '팝업수정' : '팝업 생성'}
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </>
  );
};

export default PopUpCreatePresenter;
