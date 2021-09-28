import React, {
  ChangeEvent,
  useState,
  useRef,
  RefObject,
} from 'react';
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
  TablePagination,
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
  schedules: Schedule[];
  page: number;
  limit: number;
  search: string;
  sort: string;
  startDate: string;
  endDate: string;
  sortOptions: Array<{ value: string; label: string }>;
  scrollRef: RefObject<HTMLDivElement>;
  handleDate: (startDate, endDate) => void;
  handleSort: (event: any) => void;
  handlePage: (event: any, newPage: number) => void;
  handleLimit: (event: ChangeEvent<HTMLInputElement>) => void;
  setSearch: (word: string) => void;
  postDelete: (id: number) => void;
  reload: () => void;
  setTargetModify: (target: Schedule) => void;
}

const applyPagination = (
  schedules: Schedule[],
  page: number,
  limit: number,
): Schedule[] => schedules.slice(page * limit, page * limit + limit);

const ScheduleListTable: React.FC<ScheduleListTableProps> = (
  props,
) => {
  const {
    schedules,
    scrollRef,
    page,
    limit,
    sortOptions,
    startDate,
    endDate,
    handleDate,
    postDelete,
    setSearch,
    setTargetModify,
    handleSort,
    handlePage,
    handleLimit,
  } = props;
  const [targetSchedule, setTargetDelete] = useState<Schedule>(null);
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] =
    useState<boolean>(false);

  const scrollToTop = () => {
    scrollRef.current &&
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const paginatedSchedule = applyPagination(schedules, page, limit);

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
              onChange={(event) => setSearch(event.target.value)}
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
              onChange={(event) => handleSort(event.target.value)}
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
            onChange={(e) => handleDate(e.target.value, null)}
          />

          <TextField
            id="date"
            label="종료일"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => handleDate(null, e.target.value)}
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
              {paginatedSchedule.map((schedule) => {
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
                      {/* <div className={classes.tags}> */}
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
                          scrollToTop();
                        }}
                      >
                        <BuildIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setTargetDelete(schedule);
                          setIsOpenDeleteConfirm(true);
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
        </Box>
        <TablePagination
          component="div"
          count={schedules.length} //TODO
          onPageChange={handlePage}
          onRowsPerPageChange={handleLimit}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
        {targetSchedule && (
          <Dialog
            aria-labelledby="ConfirmModal"
            open={isOpenDeleteConfirm}
            onClose={() => setIsOpenDeleteConfirm(false)}
          >
            <ConfirmModal
              title={`${targetSchedule.title} 일정을 삭제하시겠습니까?`}
              content={`삭제하면 되돌리기 어렵습니다.`}
              confirmTitle={'네 삭제합니다.'}
              handleOnClick={() => {
                postDelete(targetSchedule.id);
                setTargetDelete(null);
              }}
              handleOnCancel={() => {
                setTargetDelete(null);
                setIsOpenDeleteConfirm(false);
              }}
            />
          </Dialog>
        )}
      </Card>
    </Box>
  );
};

export default ScheduleListTable;

ScheduleListTable.propTypes = {
  schedules: PropTypes.array.isRequired,
};
