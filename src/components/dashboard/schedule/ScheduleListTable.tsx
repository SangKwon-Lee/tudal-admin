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
  Checkbox,
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
  CircularProgress,
  Dialog,
  Chip,
} from '@material-ui/core';
import {
  createStyles,
  Theme,
  makeStyles,
} from '@material-ui/core/styles';

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

type Sort =
  | 'updated_at|desc'
  | 'updated_at|asc'
  | 'startDate|desc'
  | 'startDate|asc'
  | 'author|desc'
  | 'priority|desc';

interface SortOption {
  value: Sort;
  label: string;
}
const sortOptions: SortOption[] = [
  {
    label: '최신 등록순',
    value: 'updated_at|desc',
  },
  {
    label: '오래된 등록순',
    value: 'updated_at|asc',
  },
  {
    label: '시작일자 내림차순',
    value: 'startDate|desc',
  },
  {
    label: '시작일자 오름차순',
    value: 'startDate|asc',
  },
  {
    label: '작성자 내림차순',
    value: 'author|desc',
  },
  {
    label: '중요도 내림차순',
    value: 'priority|desc',
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};
const applySort = (schedules: Schedule[], sort: Sort): Schedule[] => {
  const [orderBy, order] = sort.split('|') as [
    string,
    'asc' | 'desc',
  ];
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = schedules.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    // @ts-ignore
    return a[1] - b[1];
  });
  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

interface ScheduleListTableProps {
  schedules: Schedule[];
  search: string;
  setSearch: (value) => void;
  postDelete: (id: number) => void;
  reload: () => void;
  setTargetModify: (target: Schedule) => void;
  scrollRef: RefObject<HTMLDivElement>;
}

const applyPagination = (
  schedules: Schedule[],
  page: number,
  limit: number,
): Schedule[] => schedules.slice(page * limit, page * limit + limit);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tags: {
      display: 'flex',
      justifyContent: 'start',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.2),
      },
    },
  }),
);

const ScheduleListTable: React.FC<ScheduleListTableProps> = (
  props,
) => {
  const {
    schedules,
    postDelete,
    setSearch,
    setTargetModify,
    scrollRef,
  } = props;
  const classes = useStyles();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [targetSchedule, setTargetDelete] = useState<Schedule>(null);
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] =
    useState<boolean>(false);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleSort = (event): void => {
    setSort(event.target.value);
  };

  const scrollToTop = () => {
    scrollRef.current &&
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const sortedSchedules = applySort(schedules, sort);
  const paginatedSchedule = applyPagination(
    sortedSchedules,
    page,
    limit,
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
              width: 500,
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
              onChange={(event) => handleSort(event)}
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
        </Box>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell width="20%">제목</TableCell>
                <TableCell width="30%">코멘트</TableCell>
                <TableCell width="10%">중요도</TableCell>
                <TableCell width="10%">작성자</TableCell>
                <TableCell width="15%">적용 일시</TableCell>

                <TableCell>삭제</TableCell>
                <TableCell>수정</TableCell>
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
                    <TableCell padding="checkbox">
                      {schedule.id}
                    </TableCell>
                    <TableCell>
                      <Link
                        color="textPrimary"
                        underline="none"
                        variant="subtitle2"
                      >
                        {schedule.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <TableRow>
                        <pre>{comment}</pre>
                      </TableRow>
                      <Box m={2} />
                      <TableRow className={classes.tags}>
                        {keywords.map((keyword) => (
                          <>
                            <Chip
                              key={keyword.id}
                              color="default"
                              label={keyword.name}
                              size={'small'}
                            />
                            <Box m={1}></Box>
                          </>
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
                      </TableRow>
                    </TableCell>
                    <TableCell>
                      {getPriorityLabel(priority)}
                    </TableCell>
                    <TableCell>
                      {author ? author.username : '알 수 없음'}
                    </TableCell>
                    <TableCell>{`${dayjs(startDate).format(
                      'YYYY-MM-DD',
                    )} - ${dayjs(endDate).format(
                      'YYYY-MM-DD',
                    )}`}</TableCell>
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={schedules.length} //TODO
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
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
