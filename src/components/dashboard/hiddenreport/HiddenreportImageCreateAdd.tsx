import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
} from '@material-ui/core';
import { FC } from 'react';
import {
  HRImageCreateAction,
  HRImageCreateActionKind,
  HRImageCreateState,
} from './HiddenreportImageCreate.Conatiner';

interface HRImageCreateAddState {
  createaddInput: HRImageCreateState;
  dispatch: (params: HRImageCreateAction) => void;
  onChangeImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: HRImageCreateActionKind,
  ) => void;
  onChangeImageList: (
    e: any,
    type: HRImageCreateActionKind,
    index: number,
  ) => void;
  mode: string;
  index: number;
}

export const HiddenreportImageCreateAdd: FC<HRImageCreateAddState> = (
  props,
) => {
  const {
    createaddInput,
    dispatch,
    onChangeImage,
    onChangeImageList,
    mode,
    index,
  } = props; //    부모(Container -> Presenter -> Add)
  const { imageList } = createaddInput;

  console.log('I am inside', createaddInput);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item gridRow={3}>
          {mode === 'edit' ? (
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
              value={createaddInput?.createInput.name || ''}
              variant="outlined"
            />
          ) : (
            <TextField
              fullWidth
              helperText={'제목을 입력해주세요.'}
              label="제목"
              name="name"
              onChange={(e) =>
                onChangeImageList(
                  e,
                  HRImageCreateActionKind.CHANGE_LIST,
                  index,
                )
              }
              // value={createaddInput?.createInput.name || ''}
              variant="outlined"
            />
          )}
        </Grid>
        <Grid item gridRow={3}>
          {mode === 'edit' ? (
            <TextField
              fullWidth
              helperText={'해당 이미지에 대한 키워드를 적어주세요.'}
              label="키워드"
              name="keyword"
              onChange={(event) => {
                dispatch({
                  type: HRImageCreateActionKind.CHANGE_INPUT,
                  payload: event,
                });
              }}
              value={createaddInput?.createInput.keyword || ''}
              variant="outlined"
            />
          ) : (
            <TextField
              fullWidth
              helperText={'해당 이미지에 대한 키워드를 적어주세요.'}
              label="키워드"
              name="keyword"
              onChange={(e) =>
                onChangeImageList(
                  e,
                  HRImageCreateActionKind.CHANGE_LIST,
                  index,
                )
              }
              // value={createaddInput?.createInput.keyword || ''}
              variant="outlined"
            />
          )}
        </Grid>
        <Grid item gridRow={3}>
          <Typography
            color="textPrimary"
            sx={{ mb: 1 }}
            variant="subtitle1"
          >
            직사각형 썸네일 이미지
          </Typography>
          {mode === 'edit' ? (
            <input
              id="image"
              name="image"
              accept="image/*"
              type="file"
              multiple
              onChange={(e) =>
                onChangeImage(
                  e,
                  HRImageCreateActionKind.CHANGE_THUMBNAIL_IMAGE,
                )
              }
            />
          ) : (
            <input
              id="image"
              name="thumbnailImageUrl"
              accept="image/*"
              type="file"
              multiple
              onChange={(e) =>
                onChangeImageList(
                  e,
                  HRImageCreateActionKind.CHANGE_LIST,
                  index,
                )
              }
            />
          )}

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
            파일 이름이 너무 길 경우 오류가 생길 수 있습니다. (15자
            내외)
          </Typography>
          <Box>
            <Typography sx={{ my: 2 }}>이미지 미리보기</Typography>
            {mode === 'edit' ? (
              <img
                style={{ width: '100px', maxHeight: '100px' }}
                alt={''}
                src={createaddInput?.createInput.thumbnailImageUrl}
              />
            ) : (
              <img
                style={{ width: '100px', maxHeight: '100px' }}
                alt={''}
                src={imageList[index]?.thumbnailImageUrl}
              />
            )}
          </Box>
        </Grid>
        <Grid item gridRow={3}>
          <Typography
            color="textPrimary"
            sx={{ mb: 1 }}
            variant="subtitle1"
          >
            정사각형 이미지
          </Typography>
          {mode === 'edit' ? (
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
          ) : (
            <input
              id="image"
              name="squareImageUrl"
              accept="image/*"
              type="file"
              onChange={(e) =>
                onChangeImageList(
                  e,
                  HRImageCreateActionKind.CHANGE_LIST,
                  index,
                )
              }
            />
          )}

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
            파일 이름이 너무 길 경우 오류가 생길 수 있습니다. (15자
            내외)
          </Typography>
          <Box>
            <Typography sx={{ my: 2 }}>이미지 미리보기</Typography>
            {mode === 'edit' ? (
              <img
                style={{ width: 400, maxHeight: 400 }}
                alt={''}
                src={createaddInput.createInput.squareImageUrl}
              />
            ) : (
              <img
                style={{ width: 400, maxHeight: 400 }}
                alt={''}
                src={imageList[index]?.squareImageUrl}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default HiddenreportImageCreateAdd;
