import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  LinearProgress,
  Pagination,
  Link,
} from '@material-ui/core';
import Scrollbar from 'src/components/layout/Scrollbar';
import ArrowRightIcon from 'src/icons/ArrowRight';

import {
  CpListAction,
  ICPQandAListState,
  CPQandAActionKind,
  sortOption,
} from './CpQandAList.Container';
import dayjs from 'dayjs';
import PencilAlt from 'src/icons/PencilAlt';
import useAuth from 'src/hooks/useAuth';
import { IUserType } from 'src/types/user';
import Label from 'src/components/widgets/Label';
interface CpListProps {
  dispatch: (params: CpListAction) => void;
  state: ICPQandAListState;
}

const CPQandAListPresenter: React.FC<CpListProps> = (props) => {
  const { user } = useAuth();
  const { state, dispatch } = props;
  const { loading, questions } = state;
  const isCP = user.type === IUserType.CP;
  const isAdmin = user.type === IUserType.ADMIN;
  return (
    <>
      <Card sx={{ my: 4 }}>
        {loading && <LinearProgress />}

        {isAdmin && (
          <TextField
            select
            sx={{ mx: 2, pt: 2, pb: 2 }}
            defaultValue="전체"
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={(event) => {
              dispatch({
                type: CPQandAActionKind.CHANGE_FILTER,
                payload: event.target.value,
              });
            }}
          >
            {sortOption.map((date: any, i) => (
              <option key={i} value={date.value}>
                {date.title}
              </option>
            ))}
          </TextField>
        )}

        <Divider />
        <Scrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>분류</TableCell>
                  <TableCell>작성자</TableCell>
                  <TableCell>답변</TableCell>
                  <TableCell>완료</TableCell>
                  <TableCell>작성일</TableCell>
                  <TableCell>자세히</TableCell>
                  {isCP && <TableCell>수정</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  questions.map((question, i) => {
                    return (
                      <TableRow hover key={question.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{question.title}</TableCell>
                        <TableCell>{question.category}</TableCell>
                        <TableCell>
                          {question.writer?.username}
                        </TableCell>
                        <TableCell>
                          <Label
                            color={
                              question.answers.length
                                ? 'primary'
                                : 'error'
                            }
                          >
                            {question.answers.length}개
                          </Label>
                        </TableCell>
                        <TableCell>
                          {question.isCompleted ? (
                            <Label color="primary">O</Label>
                          ) : (
                            <Label color="error">X</Label>
                          )}
                        </TableCell>
                        <TableCell>
                          {`${dayjs(question.created_at).format(
                            'YYYY년 M월 D일 HH:mm',
                          )}`}
                        </TableCell>

                        <TableCell>
                          <IconButton>
                            <Link
                              color="textPrimary"
                              component={RouterLink}
                              to={`/dashboard/qas/${question.id}`}
                              variant="subtitle2"
                            >
                              <ArrowRightIcon fontSize="small" />
                            </Link>
                          </IconButton>
                        </TableCell>
                        {isCP && (
                          <TableCell>
                            <IconButton>
                              <Link
                                color="textPrimary"
                                component={RouterLink}
                                to={`/dashboard/qas/${question.id}/edit`}
                                variant="subtitle2"
                              >
                                <PencilAlt fontSize="small" />
                              </Link>
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <Pagination
          sx={{ p: 1 }}
          size="small"
          color="primary"
          variant="text"
          count={Math.ceil(state.questionLength / 50)}
          page={state.page}
          onChange={(event, page) => {
            dispatch({
              type: CPQandAActionKind.CHANGE_PAGE,
              payload: page,
            });
          }}
        />
      </Card>
    </>
  );
};

export default CPQandAListPresenter;
