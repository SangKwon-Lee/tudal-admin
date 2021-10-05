import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
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
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import type { Expert } from '../../../types/expert';
import Scrollbar from '../../layout/Scrollbar';
import { apiServer } from '../../../lib/axios';
import ConfirmModal from '../../widgets/modals/ConfirmModal';
import {
  applyFilters,
  applyPagination,
  applySort,
} from '../../../utils/sort';

// 감싼 컴포넌트에 React.forwardRef를 사용해 ref를 제공해주면 된다.
// const Bar = forwardRef((props: any, ref: any) => (
//   <div {...props} ref={ref}>
//     {props.children}
//   </div>
// ));

interface ExpertListTableProps {
  experts: Expert[];
  reload: () => void;
}

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
    label: '최신순',
    value: 'updated_at|desc',
  },
  {
    label: '오래된순',
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

const ExpertListTable: FC<ExpertListTableProps> = (props) => {
  const { experts, reload, ...other } = props;
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [selectedExperts, setSelectedExperts] = useState<number[]>(
    [],
  );
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [open, setOpen] = useState<boolean>(false);

  //* 탭 변경
  const handleTabsChange = (
    __: ChangeEvent<{}>,
    value: string,
  ): void => {
    const updatedFilters = {
      beforeSale: null,
      onSale: null,
      afterSale: null,
      public: null,
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }
    setSelectedExperts([]);
    setCurrentTab(value);
  };

  //* 삭제 모달
  const onClickDelete = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      const expertId = selectedExperts[0];
      const response = await apiServer.delete(
        `/expert/${expertId.toString()}`,
      );
      if (response.status === 200) {
        props.reload();
      }
    } catch (e) {
    } finally {
      setOpen(false);
    }
  };

  //* 검색어
  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setQuery(event.target.value);
  };

  //* 정렬 변경
  const handleSortChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSort(event.target.value as Sort);
  };

  //* 페이지 변경
  const handlePageChange = (__: any, newPage: number): void => {
    setPage(newPage);
  };

  //* 리스트 수 변경
  const handleLimitChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  //* 리스트에서 게시글 선택
  const handleSelectOneExpert = (
    __: ChangeEvent<HTMLInputElement>,
    expertId: number,
  ): void => {
    if (!selectedExperts.includes(expertId)) {
      setSelectedExperts((prevSelected) => [expertId]);
    } else {
      setSelectedExperts((prevSelected) =>
        prevSelected.filter((id) => id !== expertId),
      );
    }
  };

  //* 최종 리스트, 정렬 데이터
  const filteredExperts = applyFilters(experts, query);
  const sortedExperts = applySort(filteredExperts, sort);
  const paginatedExperts = applyPagination(
    sortedExperts,
    page,
    limit,
  );
  const enableBulkActions = selectedExperts.length > 0;

  return (
    <>
      <Card {...other}>
        <Tabs
          indicatorColor="primary"
          onChange={handleTabsChange}
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
          </Box>
        </Box>
        {enableBulkActions && (
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                backgroundColor: 'background.paper',
                // position: 'absolute',
                px: '4px',
                width: '100%',
                zIndex: 2,
              }}
            >
              {/* <Checkbox
                checked={selectedAllExperts}
                color="primary"
                indeterminate={selectedSomeExperts}
                onChange={handleSelectAllExperts}
              /> */}
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
                  <TableCell padding="checkbox">
                    {/* <Checkbox
                      checked={selectedAllExperts}
                      color="primary"
                      indeterminate={selectedSomeExperts}
                      onChange={handleSelectAllExperts}
                    /> */}
                  </TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>등록일</TableCell>
                  <TableCell>수정일</TableCell>
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
                              타이틀
                              {expert.title}
                            </Link>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {expert.author && expert.author}
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
                        {moment(expert.updated_at).format(
                          'YYYY년 M월 D일 HH:mm',
                        )}
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
          count={experts.length}
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
        onClose={() => setOpen(false)}
      >
        <ConfirmModal
          title={'정말 삭제하시겠습니까?'}
          content={
            '고객들이 구매한 상품의 경우 삭제시 큰 주의가 필요합니다.'
          }
          confirmTitle={'삭제'}
          handleOnClick={handleDelete}
          handleOnCancel={() => setOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default ExpertListTable;
