import {
  SideBannerCreateAction,
  SideBannerCreateActionKind,
  SideBannerCreateState,
} from './SideBannerCreate.Container';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { ISideBanner } from 'src/types/sidebanner';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  LinearProgress,
} from '@material-ui/core';
const schema = yup
  .object({
    title: yup.string().required(),
    url: yup.string().required(),
  })
  .required();

interface SideBannerCreateProps {
  mode: string;
  onChangeImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: SideBannerCreateActionKind,
  ) => void;
  sideBannerCreateState: SideBannerCreateState;
  dispatch: (params: SideBannerCreateAction) => void;
  sideBannerCreate: (data: ISideBanner) => Promise<void>;
}

const SideBannerCreatePresenter: React.FC<SideBannerCreateProps> = ({
  mode,
  dispatch,
  onChangeImage,
  sideBannerCreate,
  sideBannerCreateState,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    defaultValues: sideBannerCreateState.newSideBanner,
    resolver: yupResolver(schema),
  });

  const { loading } = sideBannerCreateState;

  useEffect(() => {
    reset(sideBannerCreateState.newSideBanner);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, sideBannerCreateState.newSideBanner.id]);

  return (
    <>
      <form onSubmit={handleSubmit(sideBannerCreate)}>
        <Card sx={{ p: 3, my: 4, mx: '2%' }}>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              제목
            </Typography>
            <TextField
              {...register('title')}
              fullWidth
              error={Boolean(errors?.title)}
              helperText={'제목은 필수입니다.'}
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              URL
            </Typography>
            <TextField
              {...register('url')}
              fullWidth
              variant="outlined"
              error={Boolean(errors?.url)}
              helperText={'url은 필수입니다'}
            />
          </Box>
          <Grid item xs={12} lg={6}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle1"
            >
              작은 이미지
            </Typography>

            <input
              id="image"
              name="image"
              accept="image/*"
              type="file"
              onChange={(e) =>
                onChangeImage(
                  e,
                  SideBannerCreateActionKind.CHANGE_SMALL_IMAGE,
                )
              }
            />
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                dispatch({
                  type: SideBannerCreateActionKind.CHANGE_SMALL_IMAGE,
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
              {loading && <LinearProgress />}
              <img
                style={{ width: '100%', maxHeight: 400 }}
                alt={''}
                src={sideBannerCreateState.newSideBanner.smallImgUrl}
              />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle1"
            >
              큰 이미지
            </Typography>

            <input
              id="image"
              name="image"
              accept="image/*"
              type="file"
              onChange={(e) =>
                onChangeImage(
                  e,
                  SideBannerCreateActionKind.CHANGE_BIG_IMAGE,
                )
              }
            />
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                dispatch({
                  type: SideBannerCreateActionKind.CHANGE_BIG_IMAGE,
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
              {loading && <LinearProgress />}
              <img
                style={{ width: '100%', maxHeight: 400 }}
                alt={''}
                src={sideBannerCreateState.newSideBanner.bigImgUrl}
              />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle1"
            >
              비회원 이미지
            </Typography>

            <input
              id="image"
              name="image"
              accept="image/*"
              type="file"
              onChange={(e) =>
                onChangeImage(
                  e,
                  SideBannerCreateActionKind.CHANGE_SIGNUP_IMAGE,
                )
              }
            />
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                dispatch({
                  type: SideBannerCreateActionKind.CHANGE_SIGNUP_IMAGE,
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
              {loading && <LinearProgress />}
              <img
                style={{ width: '100%', maxHeight: 400 }}
                alt={''}
                src={sideBannerCreateState.newSideBanner.signupImgUrl}
              />
            </Box>
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
              to={`/dashboard/`}
            >
              이전
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              size="large"
            >
              {mode === 'edit' ? '수정' : '생성'}
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
};

export default SideBannerCreatePresenter;
