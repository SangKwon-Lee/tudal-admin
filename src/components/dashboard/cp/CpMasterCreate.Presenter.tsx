import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
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
import ImageCropper from 'src/components/common/ImageCropper';

const schema = yup
  .object({
    nickname: yup.string().required(),
    price_gold: yup.number().positive().required(),
    subscription_days: yup.number().positive().required(),
    intro: yup.string().required(),
    keyword: yup.string().required(),
    type: yup.string().required(),
  })
  .required();

interface CpMasterCreateProps {
  dispatch: (params: CpMasterCreateAction) => void;
  cpCreateState: CpMasterCreateState;
  mode: string;
  createCpMaster: (data: CP_Master) => Promise<void>;
}

const CpMasterCreatePresenter: React.FC<CpMasterCreateProps> = (
  props,
) => {
  const { cpCreateState, dispatch, mode, createCpMaster } = props;
  const { newCpMaster, users, newMasterUser } = cpCreateState;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  const onUploadFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        dispatch({
          type: CpMasterCreateActionKind.PRE_CROP_IMAGE,
          payload: reader.result,
        });
      });

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(createCpMaster)}>
        <Card sx={{ p: 3, my: 4, mx: '10%' }}>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              유저 선택
            </Typography>
            {mode === 'create' ? (
              <Autocomplete
                fullWidth
                autoHighlight
                options={users}
                onChange={(e, options, reason, item) => {
                  if (!item) {
                    return;
                  }
                  dispatch({
                    type: CpMasterCreateActionKind.GET_USER,
                    payload: item,
                  });
                }}
                getOptionLabel={(users) => users.username}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            ) : (
              newMasterUser && (
                <TextField
                  fullWidth
                  variant="outlined"
                  disabled={true}
                  value={newMasterUser.nickname}
                />
              )
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              닉네임 (채널 이름)
            </Typography>
            <TextField
              fullWidth
              {...register('nickname')}
              variant="outlined"
              error={Boolean(errors?.nickname)}
              helperText={'닉네임 (채널 이름) 은 필수입니다.'}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              소개 글
            </Typography>
            <TextField
              fullWidth
              {...register('intro')}
              multiline
              variant="outlined"
              helperText="줄 바꾸기 enter. (필수 항목)"
              error={Boolean(errors?.intro)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              키워드
            </Typography>
            <TextField
              fullWidth
              {...register('keyword')}
              variant="outlined"
              helperText="쉼표(,)로 구분해주세요. (필수 항목)"
              error={Boolean(errors?.keyword)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              구독료 (Gold)
            </Typography>
            <TextField
              fullWidth
              {...register('price_gold')}
              variant="outlined"
              error={Boolean(errors?.price_gold)}
              helperText={'구독료 입력은 필수입니다.'}
            ></TextField>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              기본 구독 기간 (일)
            </Typography>
            <TextField
              fullWidth
              {...register('subscription_days')}
              variant="outlined"
              error={Boolean(errors?.subscription_days)}
              helperText={'구독기간 입력은 필수입니다. '}
            ></TextField>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              타입
            </Typography>
            <TextField
              select
              fullWidth
              {...register('type')}
              helperText="쉼표(,)로 구분해주세요. (필수 항목)"
              error={Boolean(errors?.type)}
              SelectProps={{ native: true }}
              variant="outlined"
              sx={{ mx: 1 }}
            >
              <option value="free">무료</option>
              <option value="paid">유료</option>
              <option value="test">테스트</option>
              <option value="hidden">숨김</option>
            </TextField>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 2 }}>
              프로필 이미지 등록
            </Typography>
            <TextField
              name="profile_image_url"
              type="file"
              onChange={onUploadFile}
            />
            <Button
              sx={{ ml: 2 }}
              color="primary"
              variant="contained"
              onClick={() => {
                dispatch({
                  type: CpMasterCreateActionKind.PRE_CROP_IMAGE,
                  payload: null,
                });
              }}
            >
              이미지 삭제
            </Button>
            <Typography
              variant="subtitle2"
              color="secondary"
              fontSize="14px"
              fontWeight="bold"
              sx={{ my: 2 }}
            >
              업로드시 이미지를 드래그하여 원하는 부분을 Crop해주세요.
              (프로필 미리보기에 이미지가 나와야 합니다.)
            </Typography>

            <div>
              <ImageCropper
                imageToCrop={cpCreateState.cropImg}
                onImageCropped={(croppedImage) => {
                  dispatch({
                    type: CpMasterCreateActionKind.CHANGE_IMAGE,
                    payload: croppedImage[0],
                  });
                  dispatch({
                    type: CpMasterCreateActionKind.SAVE_CROP_IMAGE,
                    payload: croppedImage[1],
                  });
                }}
              />
            </div>

            <Typography
              color="textSecondary"
              variant="subtitle2"
              sx={{ mt: 1 }}
            >
              파일 이름이 너무 길 경우 오류가 생길 수 있습니다. (15자
              내외)
            </Typography>
            <Box>
              <Typography sx={{ my: 2 }}>프로필 미리보기</Typography>
              <div>
                {newCpMaster.profile_image_url && (
                  <div>
                    <img
                      alt="Cropped"
                      src={newCpMaster.profile_image_url}
                      style={{ borderRadius: '50%', width: '100px' }}
                    />
                  </div>
                )}
              </div>
            </Box>
          </Box>
        </Card>
        <Box
          sx={{
            display: 'flex',
            mt: 6,
            mx: '10%',
          }}
        >
          <Button
            color="secondary"
            size="large"
            variant="text"
            component={RouterLink}
            to={`/dashboard/cp`}
          >
            이전
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="submit" color="primary" variant="contained">
            {mode === 'edit' ? '수정' : '생성'}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CpMasterCreatePresenter;
