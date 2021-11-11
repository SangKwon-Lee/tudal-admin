import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
  LinearProgress,
  Autocomplete,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import {
  CpMasterCreateAction,
  CpMasterCreateActionKind,
  CpMasterCreateState,
} from './CpMasterCreate.Container';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { CP_Master } from 'src/types/cp';

const schema = yup
  .object({
    user: yup.string().required(),
    nickname: yup.string().required(),
    intro: yup.string().required(),
    keyword: yup.string().required(),
  })
  .required();

interface CpMasterCreateProps {
  dispatch: (params: CpMasterCreateAction) => void;
  cpCreateState: CpMasterCreateState;
  mode: string;
  createCpMaster: (data: CP_Master) => Promise<void>;
  onChangeImgae: (event: any) => Promise<boolean>;
}

const CpMasterCreatePresenter: React.FC<CpMasterCreateProps> = (
  props,
) => {
  const {
    cpCreateState,
    dispatch,
    mode,
    onChangeImgae,
    createCpMaster,
  } = props;
  const { newCpMaster, loading, users } = cpCreateState;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CP_Master>({
    defaultValues: newCpMaster,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(newCpMaster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, newCpMaster.id]);

  useEffect(() => {
    register('user', {
      validate: (value) => {
        return value;
      },
    });
  }, [register]);

  return (
    <>
      <form onSubmit={handleSubmit(createCpMaster)}>
        <Card sx={{ p: 3, my: 2 }}>
          <Typography color="textPrimary" variant="h6">
            {mode === 'edit'
              ? '수정할 내용을 입력해주세요.'
              : '생성할 내용을 입력해주세요.'}
          </Typography>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ my: 1 }}>
              유저 선택
            </Typography>
            <Autocomplete
              {...register('user')}
              fullWidth
              disabled={newCpMaster.id ? true : false}
              autoHighlight
              options={users}
              onChange={(e, options, reason, item) =>
                setValue('user', item.option.id)
              }
              getOptionLabel={(users) => users.username}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ my: 1 }}>
              닉네임 (채널 이름)
            </Typography>
            <TextField
              fullWidth
              {...register('nickname')}
              variant="outlined"
              error={errors.nickname ? true : false}
              helperText={'닉네임 (채널 이름) 은 필수입니다.'}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ my: 1 }}>
              소개 글
            </Typography>
            <TextField
              fullWidth
              {...register('intro')}
              multiline
              variant="outlined"
              helperText="줄 바꾸기 enter. (필수 항목)"
              error={errors.intro ? true : false}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ my: 1 }}>
              키워드
            </Typography>
            <TextField
              fullWidth
              {...register('keyword')}
              variant="outlined"
              helperText="쉼표(,)로 구분해주세요. (필수 항목)"
              error={errors.keyword ? true : false}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ my: 2 }}>프로필 이미지 등록</Typography>
            <TextField
              name="profile_image_url"
              type="file"
              onChange={onChangeImgae}
            />
            <Button
              sx={{ ml: 2 }}
              color="primary"
              variant="contained"
              onClick={() => {
                dispatch({
                  type: CpMasterCreateActionKind.CHANGE_IMAGE,
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
              {loading && (
                <div data-testid="news-list-loading">
                  <LinearProgress />
                </div>
              )}
              <img
                style={{ width: '100%' }}
                alt={''}
                src={newCpMaster.profile_image_url}
              />
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
                to={`/dashboard/cp`}
              >
                이전
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                type="submit"
                color="primary"
                variant="contained"
              >
                {mode === 'edit' ? '수정' : '생성'}
              </Button>
            </Box>
          </Box>
        </Card>
      </form>
    </>
  );
};

export default CpMasterCreatePresenter;
