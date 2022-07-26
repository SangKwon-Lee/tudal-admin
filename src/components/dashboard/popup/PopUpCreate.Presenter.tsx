import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  LinearProgress,
  Autocomplete,
} from '@material-ui/core';
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { DateTimePicker } from '@material-ui/lab';
import {
  PopUpCreateAction,
  PopUpCreateActionKind,
  PopUpCreateState,
  POPUP_TARGET,
} from './PopUpCreate.Container';
import { FC } from 'react';

interface PopUpCreateProps {
  PopUpCreateState: PopUpCreateState;
  dispatch: (params: PopUpCreateAction) => void;
  createNewPopUp: () => void;
  onChangeImgae: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PopUpCreatePresenter: FC<PopUpCreateProps> = (props) => {
  const {
    PopUpCreateState,
    dispatch,
    createNewPopUp,
    onChangeImgae,
  } = props;

  const { createInput, loading, targetCandidate } = PopUpCreateState;
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
                  select
                  helperText={'팝업의 타입을 골라주세요.'}
                  label="타입"
                  SelectProps={{ native: true }}
                  name="target"
                  value={createInput.target}
                  variant="outlined"
                  onChange={(event) => {
                    dispatch({
                      type: PopUpCreateActionKind.CHANGE_INPUT,
                      payload: event,
                    });
                  }}
                >
                  {POPUP_TARGET.map((el, i) => (
                    <option key={i} value={el.key}>
                      {el.name}
                    </option>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ mt: 2 }}>
                {createInput.target !== 'premium' && (
                  <Autocomplete
                    fullWidth
                    autoHighlight
                    value={targetCandidate.selected}
                    options={targetCandidate[createInput.target]}
                    onChange={(e, value) => {
                      console.log('switched');
                      if (typeof value !== 'string') {
                        console.log(
                          'targetCandidate',
                          targetCandidate.selected,
                        );
                        dispatch({
                          type: PopUpCreateActionKind.CHANGE_TARGET_ID,
                          payload: value,
                        });
                      }
                    }}
                    getOptionLabel={(option: {
                      id: number;
                      value: string;
                      subValue: string;
                    }) =>
                      `${option.value} / ${option.subValue} / ${option.id}`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={'닉네임/제목'}
                        name="stocks"
                        variant="outlined"
                        onChange={(e) => {
                          console.log('change');
                          dispatch({
                            type: PopUpCreateActionKind.CHANGE_SEARCH_WORD,
                            payload: e.target.value,
                          });
                        }}
                      />
                    )}
                  />
                )}
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
                  팝업 생성
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
