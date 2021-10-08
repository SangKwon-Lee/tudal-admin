import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  Dialog,
  LinearProgress,
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import type { Expert } from '../../../types/expert';
import Scrollbar from '../../layout/Scrollbar';
import ConfirmModal from '../../widgets/modals/ConfirmModal';
import { ChangeEvent, FC } from 'react';
import { AxiosError } from 'axios';
import useAuth from 'src/hooks/useAuth';

// 감싼 컴포넌트에 React.forwardRef를 사용해 ref를 제공해주면 된다.
// const Bar = forwardRef((props: any, ref: any) => (
//   <div {...props} ref={ref}>
//     {props.children}
//   </div>
// ));

// 정렬 로직
type Sort =
  | 'updated_at|desc'
  | 'updated_at|asc'
  | 'likes|desc'
  | 'likes|asc'
  | 'viewCount|desc'
  | 'viewCount|asc';

interface SortOption {
  value: Sort;
  label: string;
}

const tabs = [
  {
    label: '전체',
    value: 'all',
  },
];

const sortOptions: SortOption[] = [
  {
    label: '최신순 (수정일 기준)',
    value: 'updated_at|desc',
  },
  {
    label: '오래된순 (수정일 기준)',
    value: 'updated_at|asc',
  },
  {
    label: '좋아요 높은순',
    value: 'likes|desc',
  },
  {
    label: '좋아요 낮은순',
    value: 'likes|asc',
  },
  {
    label: '조회수 높은순',
    value: 'viewCount|desc',
  },
  {
    label: '조회수 낮은순',
    value: 'viewCount|asc',
  },
];

interface newState {
  experts: Expert[];
  page: number;
  limit: number;
  query: string;
  open: boolean;
  sort: Sort;
  roomSort: any;
  selectedExperts: number[];
  loading: boolean;
  error: AxiosError<any> | boolean;
}
interface IExpertListTableProps {
  newState: newState;
  currentTab: string;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRoomChange: (event: ChangeEvent<HTMLInputElement>) => void;
  enableBulkActions: boolean;
  onClickDelete: () => void;
  paginatedExperts: any[];
  handleSelectOneExpert: (
    __: ChangeEvent<HTMLInputElement>,
    expertId: number,
  ) => void;
  handlePageChange: (__: any, newPage: number) => void;
  handleLimitChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickDeleteClose: () => void;
  handleDelete: () => Promise<void>;
  reload: () => void;
}
const ExpertListTablePresenter: FC<IExpertListTableProps> = (
  props,
) => {
  const {
    newState,
    reload,
    currentTab,
    handleQueryChange,
    handleSortChange,
    handleRoomChange,
    handleSelectOneExpert,
    enableBulkActions,
    onClickDelete,
    paginatedExperts,
    handlePageChange,
    handleLimitChange,
    onClickDeleteClose,
    handleDelete,
    ...other
  } = props;
  const {
    experts,
    page,
    limit,
    open,
    sort,
    query,
    roomSort,
    selectedExperts,
    loading,
  } = newState;
  const { user } = useAuth();
  const roomOption = [{ id: 0, title: '전체' }, ...user.cp_rooms];

  return (
    <>
      <Card {...other}>
        {loading && (
          <div data-testid="news-list-loading">
            <LinearProgress />
          </div>
        )}
        <Tabs
          indicatorColor="primary"
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Divider />
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
              onChange={handleQueryChange}
              placeholder="달인 검색"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              mx: 1,
            }}
          >
            <TextField
              label="정렬"
              name="sort"
              onChange={handleSortChange}
              select
              SelectProps={{ native: true }}
              value={sort}
              variant="outlined"
              sx={{ mx: 1 }}
            >
              {sortOptions &&
                sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </TextField>
            <TextField
              label={'방 정렬'}
              name="sort"
              onChange={handleRoomChange}
              select
              SelectProps={{ native: true }}
              value={roomSort}
              variant="outlined"
              sx={{ mx: 1 }}
            >
              {roomOption.length > 0 ? (
                roomOption.map((option) => (
                  <option key={option.title} value={option.title}>
                    {option.title}
                  </option>
                ))
              ) : (
                <option>방이 없습니다</option>
              )}
            </TextField>
          </Box>
        </Box>
        {enableBulkActions && (
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                backgroundColor: 'background.paper',
                px: '4px',
                width: '100%',
                zIndex: 2,
              }}
            >
              <Button
                color="primary"
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={onClickDelete}
              >
                삭제
              </Button>
              <Button
                color="primary"
                sx={{ ml: 2 }}
                variant="outlined"
                component={RouterLink}
                to={`/dashboard/expert/${selectedExperts[0]}/edit`}
              >
                수정
              </Button>
            </Box>
          </Box>
        )}
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>등록일</TableCell>
                  <TableCell>수정일</TableCell>
                  <TableCell>방 이름</TableCell>
                  <TableCell>좋아요</TableCell>
                  <TableCell>조회수</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedExperts.map((expert) => {
                  const isExpertSelected = selectedExperts.includes(
                    expert.id,
                  );
                  return (
                    <TableRow
                      hover
                      key={expert.id}
                      selected={isExpertSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isExpertSelected}
                          color="primary"
                          onChange={(event) =>
                            handleSelectOneExpert(event, expert.id)
                          }
                          value={isExpertSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Box sx={{ ml: 1, maxWidth: '150px' }}>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/dashboard/expert/${expert.id}`}
                              variant="subtitle2"
                            >
                              {expert.title
                                ? expert.title
                                : '제목이 없습니다.'}
                            </Link>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {`${
                                typeof expert.author === 'string'
                                  ? expert.author
                                  : user.nickname
                              }`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        style={{
                          maxWidth: '180px',
                          minWidth: '180px',
                        }}
                      >
                        {`${moment(expert.created_at).format(
                          'YYYY년 M월 D일 HH:mm',
                        )}`}
                      </TableCell>
                      <TableCell>
                        {moment(expert?.updated_at).format(
                          'YYYY년 M월 D일 HH:mm',
                        )}
                      </TableCell>
                      <TableCell>
                        {expert?.master_room?.title}
                      </TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          to={`/dashboard/expert/${expert.id}/edit`}
                        >
                          <PencilAltIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          component={RouterLink}
                          to={`/dashboard/expert/${expert.id}`}
                        >
                          <ArrowRightIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={experts.length ? experts.length : 0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={open}
        onClose={onClickDeleteClose}
      >
        <ConfirmModal
          title={'정말 삭제하시겠습니까?'}
          content={'삭제시 큰 주의가 필요합니다.'}
          confirmTitle={'삭제'}
          handleOnClick={handleDelete}
          handleOnCancel={onClickDeleteClose}
        />
      </Dialog>
    </>
  );
};

export default ExpertListTablePresenter;
