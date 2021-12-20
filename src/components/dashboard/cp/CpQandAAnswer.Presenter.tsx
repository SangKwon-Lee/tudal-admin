import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import WebEditor from 'src/components/common/WebEditor';
import { Link as RouterLink } from 'react-router-dom';
import {
  CPQandAAnswerAction,
  ICPQandAAnswerState,
  IAnswerForm,
} from './CpQandAAnswer.Container';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { IBuckets } from 'src/components/common/conf/aws';
import { Viewer } from '@toast-ui/react-editor';
import dayjs from 'dayjs';
import Label from 'src/components/widgets/Label';
const schema = yup
  .object({
    title: yup.string().required(),
  })
  .required();

interface CpMasterCreateProps {
  state: ICPQandAAnswerState;
  mode: string;
  editorRef: React.RefObject<HTMLDivElement>;

  dispatch: (params: CPQandAAnswerAction) => void;
  postAnswer: (data: IAnswerForm) => Promise<void>;
}

const CPQandACreateAnswerPresenter: React.FC<CpMasterCreateProps> = (
  props,
) => {
  const { state, mode, postAnswer, editorRef } = props;
  const { form, question } = state;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IAnswerForm>({
    defaultValues: form,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, form.id]);

  return (
    <>
      <form onSubmit={handleSubmit(postAnswer)}>
        <Card sx={{ p: 3, my: 4, mx: '10%' }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    내용
                  </Typography>
                </TableCell>
                <TableCell>
                  {question?.description && (
                    <Viewer initialValue={question.description} />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    작성일
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body1">
                    {`${dayjs(question?.created_at).format(
                      'YYYY년 M월 D일 HH:mm',
                    )}`}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    이유
                  </Typography>
                </TableCell>
                <TableCell>
                  <Label
                    color={
                      question?.isCompleted ? 'primary' : 'error'
                    }
                  >
                    {question?.isCompleted ? '완료' : '미완료'}
                  </Label>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

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
          <Paper sx={{ mt: 3 }} variant="outlined">
            <WebEditor
              editorRef={editorRef}
              contents={form.description}
              bucket_name={IBuckets.CP_PHOTO}
            />
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
            to={`/dashboard/qas`}
          >
            이전
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="submit" color="primary" variant="contained">
            {mode === 'edit' ? '수정' : '작성'}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CPQandACreateAnswerPresenter;
