import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';
import '@toast-ui/editor/dist/toastui-editor.css';
import WebEditor from 'src/components/common/WebEditor';
import '../../../lib/codemirror.css';
import { Box, Button, Card, TextField } from '@material-ui/core';
import { IBuckets } from 'src/components/common/conf/aws';
import { useEffect } from 'react';

const scheme = yup
  .object({
    title: yup.string().required(),
  })
  .required();

interface TudalUsContentsCreatePresenterProps {
  mode: string;
  title: string;
  contents: string;
  editorRef: React.MutableRefObject<any>;
  handleCreateContents: (data: any) => Promise<void>;
}

const TudalUsContentsCreatePresenter = ({
  mode,
  title,
  contents,
  editorRef,
  handleCreateContents,
}: TudalUsContentsCreatePresenterProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { title, contents },
    resolver: yupResolver(scheme),
  });

  useEffect(() => {
    if (reset) {
      reset({ title, contents });
    }
  }, [reset, title, contents]);
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
          <WebEditor
            editorRef={editorRef}
            bucket_name={IBuckets.MASTER_FEED}
            contents={contents}
          />
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
