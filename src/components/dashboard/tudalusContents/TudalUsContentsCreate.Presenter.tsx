import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';
import '@toast-ui/editor/dist/toastui-editor.css';
import WebEditor from 'src/components/common/WebEditor';
import '../../../lib/codemirror.css';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
} from '@material-ui/core';
import { IBuckets } from 'src/components/common/conf/aws';
import { useEffect } from 'react';

const scheme = yup
  .object({
    title: yup.string().required(),
  })
  .required();

interface TudalUsContentsCreatePresenterProps {
  mode: string;
  input: {
    title: string;
    contents: string;
  };
  thumbnail: string;
  deleteImage: () => void;
  editorRef: React.MutableRefObject<any>;
  onChangeImage: (event: any) => Promise<void>;
  handleCreateContents: (data: any) => Promise<void>;
}

const TudalUsContentsCreatePresenter = ({
  mode,
  input,
  thumbnail,
  editorRef,
  deleteImage,
  onChangeImage,
  handleCreateContents,
}: TudalUsContentsCreatePresenterProps) => {
  const { contents, title } = input;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { title },
    resolver: yupResolver(scheme),
  });

  useEffect(() => {
    if (reset) {
      reset({ title });
    }
  }, [reset, title]);
  return (
    <>
      <form onSubmit={handleSubmit(handleCreateContents)}>
        <Card sx={{ p: 3, my: 4 }}>
          <Box sx={{ my: 2 }}>
            <TextField
              {...register('title')}
              fullWidth
              label="제목"
              variant="outlined"
              error={Boolean(errors?.title)}
              helperText={'제목은 필수입니다.'}
            />
          </Box>
          <Typography sx={{ my: 2 }}>섬네일 이미지</Typography>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <TextField
              id="image"
              name="thumbnail"
              type="file"
              helperText={'섬네일은 필수입니다.'}
              onChange={onChangeImage}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={deleteImage}
              sx={{ ml: 3 }}
            >
              이미지 삭제
            </Button>
          </Box>
          <Box>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              sx={{ mt: 1 }}
            >
              파일 이름이 너무 길 경우 오류가 생길 수 있습니다. (15자
              내외)
            </Typography>
            <Typography sx={{ my: 2 }}>이미지 미리보기</Typography>
            <img
              style={{ width: '100%', maxHeight: 400 }}
              alt={''}
              src={thumbnail}
            />
          </Box>
          {mode === 'edit' && contents.length > 0 && (
            <WebEditor
              editorRef={editorRef}
              bucket_name={IBuckets.MASTER_FEED}
              contents={contents}
            />
          )}
          {mode !== 'edit' && (
            <WebEditor
              editorRef={editorRef}
              bucket_name={IBuckets.MASTER_FEED}
              contents={''}
            />
          )}

          <Box
            sx={{
              display: 'flex',
              mt: 3,
              mx: '10%',
            }}
          >
            <Button
              color="secondary"
              size="large"
              variant="text"
              component={RouterLink}
              to={`/dashboard/tudalus/contents/list`}
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

export default TudalUsContentsCreatePresenter;
