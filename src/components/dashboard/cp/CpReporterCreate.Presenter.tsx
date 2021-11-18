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
  CpReporterCreateAction,
  CpReporterCreateActionKind,
  CpReporterCreateState,
} from './CpReporterCreate.Container';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { CP_Hidden_Reporter } from 'src/types/cp';
import ImageCropper from 'src/components/common/ImageCropper';

const schema = yup
  .object({
    user: yup.string().required(),
    nickname: yup.string().required(),
    catchphrase: yup.string().required(),
    intro: yup.string().required(),
    tudalRecommendScore: yup.number().required(),
  })
  .required();

const tudalRecommendScoreOption = [
  {
    title: '1단계',
    value: 1,
  },
  {
    title: '2단계',
    value: 2,
  },
  {
    title: '3단계',
    value: 3,
  },
];

interface CpReporterCreateProps {
  dispatch: (params: CpReporterCreateAction) => void;
  cpCreateState: CpReporterCreateState;
  mode: string;
  createCpReporter: (data: CP_Hidden_Reporter) => Promise<void>;
  // onChangeImgae: (event: any) => Promise<boolean>;
}

const CpReporterCreatePresenter: React.FC<CpReporterCreateProps> = (
  props,
) => {
  const { cpCreateState, dispatch, mode, createCpReporter } = props;
  const { newCpReporter, users } = cpCreateState;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CP_Hidden_Reporter>({
    defaultValues: newCpReporter,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(newCpReporter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, newCpReporter.id]);

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
          type: CpReporterCreateActionKind.PRE_CROP_IMAGE,
          payload: reader.result,
        });
      });

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(createCpReporter)}>
        <Card sx={{ p: 3, my: 4, mx: '10%' }}>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              유저 선택
            </Typography>
            <Autocomplete
              {...register('user')}
              fullWidth
              disabled={newCpReporter.id ? true : false}
              autoHighlight
              options={users}
              onChange={(e, options, reason, item) => {
                if (!item) {
                  return;
                }
                setValue('user', item.option.id);
              }}
              getOptionLabel={(users) => users.username}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              닉네임
            </Typography>
            <TextField
              {...register('nickname')}
              fullWidth
              variant="outlined"
              error={Boolean(errors?.nickname)}
              helperText={'닉네임은 필수입니다.'}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              캐치 프레이즈
            </Typography>
            <TextField
              {...register('catchphrase')}
              fullWidth
              multiline
              variant="outlined"
              error={Boolean(errors?.catchphrase)}
              helperText={'캐치 프레이즈는 필수입니다.'}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              소개글
            </Typography>
            <TextField
              {...register('intro')}
              fullWidth
              multiline
              variant="outlined"
              error={Boolean(errors?.intro)}
              helperText="줄 바꾸기 enter (필수 사항)"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              추천 순위
            </Typography>
            <TextField
              {...register('tudalRecommendScore')}
              fullWidth
              select
              SelectProps={{ native: true }}
              variant="outlined"
              error={Boolean(errors?.tudalRecommendScore)}
              helperText="1단계가 가장 높은 우선순위입니다."
            >
              {tudalRecommendScoreOption.map((data) => (
                <option key={data.value} value={data.value}>
                  {data.title}
                </option>
              ))}
            </TextField>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ my: 2 }}>프로필 이미지 등록</Typography>
            <TextField
              name="imageUrl"
              type="file"
              onChange={onUploadFile}
            />
            <Button
              sx={{ ml: 2 }}
              color="primary"
              variant="contained"
              onClick={() => {
                dispatch({
                  type: CpReporterCreateActionKind.CHANGE_IMAGE,
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
                    type: CpReporterCreateActionKind.CHANGE_IMAGE,
                    payload: croppedImage[0],
                  });
                  dispatch({
                    type: CpReporterCreateActionKind.SAVE_CROP_IMAGE,
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
                {newCpReporter.imageUrl && (
                  <div>
                    <img
                      alt="Cropped"
                      src={newCpReporter.imageUrl}
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

export default CpReporterCreatePresenter;
