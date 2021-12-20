import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Button,
} from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';

import dayjs from 'dayjs';
import { ICPQuestion } from 'src/types/cp';
import Label from 'src/components/widgets/Label';
import useAuth from 'src/hooks/useAuth';
import { IUserType } from 'src/types/user';

interface IProps {
  question: ICPQuestion;
  loading: boolean;
  postConfirm: () => void;
}

const CPQandADetailPresenter: React.FC<IProps> = ({
  question,
  postConfirm,
  loading,
}) => {
  const { user } = useAuth();

  const isAdmin = user.type === IUserType.ADMIN;

  return (
    <Box sx={{ pt: 2 }}>
      <Card>
        <CardHeader title={question?.title} />
        <Divider />
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
                  완료 여부
                </Typography>
              </TableCell>
              <TableCell>
                <Label
                  color={question?.isCompleted ? 'primary' : 'error'}
                >
                  {question?.isCompleted ? '완료' : '미완료'}
                </Label>
                <Typography
                  color="textSecondary"
                  variant="body1"
                ></Typography>
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
          </TableBody>
        </Table>
      </Card>

      {Boolean(question?.answers.length) &&
        question.answers.map((answer) => (
          <Box sx={{ mt: 2 }}>
            <Card>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '3px',
                }}
              >
                <CardHeader title={`답변) ${answer.title}`} />
                {isAdmin && (
                  <Button
                    color="primary"
                    size="large"
                    variant="text"
                    component={RouterLink}
                    to={`/dashboard/qas/${question.id}/answer/${answer.id}/edit`}
                  >
                    수정
                  </Button>
                )}
              </Box>

              <Divider />
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        내용
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {answer?.description && (
                        <Viewer initialValue={answer.description} />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        작성일
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body1"
                      >
                        {`${dayjs(answer.created_at).format(
                          'YYYY년 M월 D일 HH:mm',
                        )}`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </Box>
        ))}
      {isAdmin && (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '12px',
          }}
        >
          <Button variant="contained" onClick={postConfirm}>
            {question?.isCompleted ? '미완료 처리' : '완료 처리'}
          </Button>
          <Button
            color="primary"
            size="large"
            variant="contained"
            component={RouterLink}
            to={`/dashboard/qas/${question?.id}/answer`}
          >
            답변 작성
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CPQandADetailPresenter;
