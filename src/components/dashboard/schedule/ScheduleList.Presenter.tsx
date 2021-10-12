import React, { ChangeEvent, useState, RefObject } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Pagination,
  TableRow,
  TextField,
  Dialog,
  Chip,
} from '@material-ui/core';

import * as _ from 'lodash';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import Label from '../../widgets/Label';
import SearchIcon from '../../../icons/Search';
import { Priority, Schedule } from '../../../types/schedule';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import {
  IScheduleListDispatch,
  IScheduleListState,
  ScheduleActionKind,
} from './ScheduleList.Container';

const applyPagination = (
  schedules: Schedule[],
  page: number,
  limit: number,
): Schedule[] => schedules.slice(page * limit, page * limit + limit);

const getPriorityLabel = (priority) => {
  const scale =
    priority > Priority.MIDDLE
      ? 'high'
      : priority === Priority.MIDDLE
      ? 'middle'
      : 'low';
  const map = {
    high: {
      color: 'error',
      text: 'HIGH',
    },
    middle: {
      color: 'success',
      text: 'MIDDLE',
    },
    low: {
      color: 'warning',
      text: 'LOW',
    },
  };
  const { text, color }: any = map[scale];

  return <Label color={color}>{text}</Label>;
};

interface ScheduleListTableProps {
  state: IScheduleListState;
  dispatch: (param: IScheduleListDispatch) => void;
  setTargetModify: (schedule: Schedule) => void;
  setShouldUpdate: (value: boolean) => void;
  sortOptions: Array<{ value: string; label: string }>;
  postDelete: (id: number) => void;
}

const ScheduleListTable: React.FC<ScheduleListTableProps> = (
  props,
) => {
  const {
    state,
    dispatch,
    sortOptions,
    postDelete,
    setTargetModify,
    setShouldUpdate,
  } = props;

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    _.debounce(
      () =>
        dispatch({
          type: ScheduleActionKind.CHANGE_SEARCH,
          payload: event.target.value,
        }),
      300,
    );
  };

  const paginatedSchedule = applyPagination(
    state.list,
    state.page,
    50,
  );

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
      }}
    >
      <Card>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2,
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 400,
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              name={'_q'}
              placeholder="제목 또는 코멘트를 검색해주세요"
              onChange={handleSearch}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 240,
            }}
          >
            <TextField
              fullWidth
              label="정렬"
              name="priority"
              select
              onChange={(event) =>
                dispatch({
                  type: ScheduleActionKind.CHANGE_SORT,
                  payload: event.target.value,
                })
              }
              SelectProps={{ native: true }}
              variant="outlined"
            >
              {sortOptions.map((sort, i) => {
                return (
                  <option key={i} value={sort.value}>
                    {sort.label}
                  </option>
                );
              })}
            </TextField>
          </Box>

          <TextField
            id="date"
            label="시작일"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) =>
              dispatch({
                type: ScheduleActionKind.CHANGE_STARTDATE,
                payload: event.target.value,
              })
            }
          />

          <TextField
            id="date"
            label="종료일"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) =>
              dispatch({
                type: ScheduleActionKind.CHANGE_ENDDATE,
                payload: event.target.value,
              })
            }
          />
        </Box>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell width="30%">제목</TableCell>
                <TableCell width="30%">코멘트</TableCell>
                <TableCell width="5%">중요도</TableCell>
                <TableCell width="10%">작성자</TableCell>
                <TableCell width="15%">적용 일시</TableCell>

                <TableCell>수정</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.list.map((schedule) => {
                const {
                  comment,
                  priority,
                  author,
                  startDate,
                  endDate,
                  keywords,
                  stocks,
                  categories,
                } = schedule;
                return (
                  <TableRow hover key={schedule.id}>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>
                      <Link
                        color="textPrimary"
                        underline="none"
                        variant="subtitle2"
                      >
                        {schedule.id} {schedule.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {comment}
                      </pre>
                      <Box m={1} />
                      {keywords.map((keyword) => (
                        <Chip
                          key={keyword.id}
                          color="default"
                          label={keyword.name}
                          size={'small'}
                        />
                      ))}
                      {stocks.map((stock, i) => (
                        <Chip
                          size={'small'}
                          key={i}
                          color="primary"
                          //@ts-ignore
                          label={stock.name}
                        />
                      ))}
                      {categories.map((category) => (
                        <Chip
                          size={'small'}
                          key={category.id}
                          color="secondary"
                          label={category.name}
                        />
                      ))}
                      {/* </div> */}
                    </TableCell>
                    <TableCell>
                      {getPriorityLabel(priority)}
                    </TableCell>
                    <TableCell>
                      {author ? author.username : '알 수 없음'}
                    </TableCell>
                    <TableCell>{`${dayjs(startDate).format(
                      'YYYY-MM-DD',
                    )} ~ ${dayjs(endDate).format(
                      'YYYY-MM-DD',
                    )}`}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setTargetModify(schedule);
                        }}
                      >
                        <BuildIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          dispatch({
                            type: ScheduleActionKind.SHOW_DELETE_DIALOG,
                            payload: schedule,
                          });
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Pagination
            page={state.page}
            onChange={(e, page) =>
              dispatch({
                type: ScheduleActionKind.CHANGE_PAGE,
                payload: page,
              })
            }
            count={10}
            variant="outlined"
            shape="rounded"
          />
        </Box>

        {state.delete.target && (
          <Dialog
            aria-labelledby="ConfirmModal"
            open={state.delete.isDeleting}
            onClose={() =>
              dispatch({
                type: ScheduleActionKind.CLOSE_DELETE_DIALOG,
              })
            }
          >
            <ConfirmModal
              title={`${state.delete.target.title} 일정을 삭제하시겠습니까?`}
              content={`삭제하면 되돌리기 어렵습니다.`}
              confirmTitle={'네 삭제합니다.'}
              handleOnClick={() => {
                postDelete(state.delete.target.id);
              }}
              handleOnCancel={() => {
                dispatch({
                  type: ScheduleActionKind.CLOSE_DELETE_DIALOG,
                });
              }}
            />
          </Dialog>
        )}
      </Card>
    </Box>
  );
};

export default ScheduleListTable;
