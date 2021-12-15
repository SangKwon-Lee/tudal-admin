import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Select,
} from '@material-ui/core';
import WebEditor from 'src/components/common/WebEditor';
import { Link as RouterLink } from 'react-router-dom';
import {
  CPQandACreateAction,
  CPQandACreateActionKind,
  ICPQandACreateState,
  IQuestionForm,
  QA_CATEGORIES,
} from './CpQandACreate.Container';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { IBuckets } from 'src/components/common/conf/aws';

const schema = yup
  .object({
    title: yup.string().required(),
  })
  .required();

interface CpMasterCreateProps {
  state: ICPQandACreateState;
  mode: string;
  editorRef: React.RefObject<HTMLDivElement>;

  dispatch: (params: CPQandACreateAction) => void;
  postForm: (data: IQuestionForm) => Promise<void>;
}

const CPQandACreatePresenter: React.FC<CpMasterCreateProps> = (
  props,
) => {
  const { state, dispatch, mode, postForm, editorRef } = props;
  const { form } = state;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IQuestionForm>({
    defaultValues: form,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, form.id]);

  return (
    <>
      <form onSubmit={handleSubmit(postForm)}>
        <Card sx={{ p: 3, my: 4, mx: '10%' }}>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              제목
            </Typography>
            <TextField
              fullWidth
              {...register('title')}
              variant="outlined"
              error={Boolean(errors?.title)}
              helperText={'제목은 필수입니다.'}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ my: 1 }}>
              분류
            </Typography>
            <Select
              size="medium"
              variant="outlined"
              name="category"
              {...register('category')}
              value={state.form.category}
              fullWidth
              onChange={(e) => {
                dispatch({
                  type: CPQandACreateActionKind.CHANGE_CATEGORY,
                  payload: e,
                });
              }}
            >
              {QA_CATEGORIES.map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Paper sx={{ mt: 3 }} variant="outlined">
            {form.description && (
              <WebEditor
                editorRef={editorRef}
                contents={form?.description}
                bucket_name={IBuckets.CP_PHOTO}
              />
            )}
            {!form.description && (
              <WebEditor
                editorRef={editorRef}
                contents={form?.description}
                bucket_name={IBuckets.CP_PHOTO}
              />
            )}
          </Paper>
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
            to={`/dashboard`}
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

export default CPQandACreatePresenter;
