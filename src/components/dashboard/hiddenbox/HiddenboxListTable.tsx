import { useState, useEffect, forwardRef } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
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
import ChatIcon from '../../../icons/ChatAlt';
import type { Hiddenbox } from '../../../types/hiddenbox';
import Scrollbar from '../../layout/Scrollbar';
import axios, { CMSURL, apiServer } from '../../../lib/axios';
import ConfirmModal from '../../../components/widgets/modals/ConfirmModal';
import { SocialPostComment, SocialPostCommentAdd } from '../social';

interface HiddenboxListTableProps {
  hiddenboxes: Hiddenbox[];
  reload: () => void;
}

// 감싼 컴포넌트에 React.forwardRef를 사용해 ref를 제공해주면 된다.
const Bar = forwardRef((props: any, ref: any) => (
  <div {...props} ref={ref}>
    {props.children}
  </div>
));

type Sort =
  | 'updated_at|desc'
  | 'updated_at|asc'
  | 'orders|desc'
  | 'orders|asc'
  | 'productId|desc'
  | 'productId|asc'
  | 'likes|desc'
  | 'likes|asc';

interface SortOption {
  value: Sort;
  label: string;
}

const tabs = [
  {
    label: '전체',
    value: 'all',
  },
  {
    label: '판매 전',
    value: 'beforeSale',
  },
  {
    label: '판매 중',
    value: 'onSale',
  },
  {
    label: '판매 완료',
    value: 'afterSale',
  },
  {
    label: '공개',
    value: 'public',
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
    label: '판매량 최고',
    value: 'orders|desc',
  },
  {
    label: '판매량 최저',
    value: 'orders|asc',
  },
  {
    label: '가격 높은순',
    value: 'productId|desc',
  },
  {
    label: '가격 낮은순',
    value: 'productId|asc',
  },
  {
    label: '좋아요 높은순',
    value: 'likes|desc',
  },
  {
    label: '좋아요 낮은순',
    value: 'likes|asc',
  },
];

const applyFilters = (
  hiddenboxes: Hiddenbox[],
  query: string,
  filters: any,
): Hiddenbox[] =>
  hiddenboxes.filter((hiddenbox) => {
    let matches = true;

    if (query) {
      const properties = ['title', 'author-username'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (property.indexOf('-') > -1) {
          const strArray = property.split('-');
          if (
            hiddenbox[strArray[0]][strArray[1]]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            containsQuery = true;
          }
        } else {
          if (
            hiddenbox[property]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            containsQuery = true;
          }
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      switch (key) {
        case 'beforeSale':
          if (
            value &&
            moment().diff(moment(hiddenbox.startDate)) > 0
          ) {
            matches = false;
          }
          break;
        case 'onSale':
          if (
            value &&
            (moment().diff(moment(hiddenbox.startDate)) < 0 ||
              moment().diff(moment(hiddenbox.endDate)) > 0)
          ) {
            matches = false;
          }
          break;
        case 'afterSale':
          if (value && moment().diff(moment(hiddenbox.endDate)) < 0) {
            matches = false;
          }
          break;
        case 'public':
          if (
            value &&
            moment().diff(moment(hiddenbox.publicDate)) < 0
          ) {
            matches = false;
          }
          break;
      }
    });

    return matches;
  });

const applyPagination = (
  hiddenboxes: Hiddenbox[],
  page: number,
  limit: number,
): Hiddenbox[] =>
  hiddenboxes.slice(page * limit, page * limit + limit);

const descendingComparator = (
  a: Hiddenbox,
  b: Hiddenbox,
  orderBy: string,
): number => {
  if (orderBy === 'productId' || orderBy === 'likes') {
    if (Number(b[orderBy]) < Number(a[orderBy])) {
      return -1;
    }

    if (Number(b[orderBy]) > Number(a[orderBy])) {
      return 1;
    }
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order: 'asc' | 'desc', orderBy: string) =>
  order === 'desc'
    ? (a: Hiddenbox, b: Hiddenbox) =>
        descendingComparator(a, b, orderBy)
    : (a: Hiddenbox, b: Hiddenbox) =>
        -descendingComparator(a, b, orderBy);

const applySort = (
  hiddenboxes: Hiddenbox[],
  sort: Sort,
): Hiddenbox[] => {
  const [orderBy, order] = sort.split('|') as [
    string,
    'asc' | 'desc',
  ];
  const comparator = getComparator(order, orderBy);

  const stabilizedThis = hiddenboxes.map((el, index) => [el, index]);
  console.log(stabilizedThis);
  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

const HiddenboxListTable: FC<HiddenboxListTableProps> = (props) => {
  const { hiddenboxes, reload, ...other } = props;
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [selectedHiddenboxes, setSelectedHiddenboxes] = useState<
    number[]
  >([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [filters, setFilters] = useState<any>({
    beforeSale: null,
    onSale: null,
    afterSale: null,
    public: null,
  });
  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [targetHiddenbox, setTargetHiddenbox] = useState(null);
  const [salesDataLoaded, setSalesDataLoaded] = useState(false);

  useEffect(() => {
    if (hiddenboxes.length > 0) {
      fetchSalesCount();
    }
  }, [hiddenboxes]);

  useEffect(() => {
    if (targetHiddenbox) {
      fetchComments(targetHiddenbox.id);
    }
  }, [targetHiddenbox]);

  const fetchSalesCount = async () => {
    await Promise.all(
      hiddenboxes.map(async (hiddenbox) => {
        const response = await axios.get(
          `/my-hiddenboxes/count?hiddenbox=${hiddenbox.id}`,
        );
        if (response.status === 200) {
          const theHiddenbox = hiddenboxes.find(
            (element) => element.id === hiddenbox.id,
          );
          theHiddenbox.orders = response.data;
        }
      }),
    );
    setSalesDataLoaded(true);
  };

  const fetchComments = async (hiddenboxId) => {
    try {
      const response = await axios.get(
        `/hiddenbox-comments?hiddenboxId=${hiddenboxId}`,
      );
      if (response.status === 200) {
        setComments(response.data);
        setCommentOpen(true);
      }
    } catch (e) {
    } finally {
    }
  };

  const onClickComment = (hiddenbox) => {
    if (targetHiddenbox && hiddenbox.id === targetHiddenbox.id) {
      fetchComments(hiddenbox.id);
    } else {
      setTargetHiddenbox(hiddenbox);
    }
  };

  const onClickDelete = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      const hiddenboxId = selectedHiddenboxes[0];
      const response = await apiServer.delete(
        `/hiddenbox/${hiddenboxId.toString()}`,
      );
      if (response.status === 200) {
        props.reload();
      }
    } catch (e) {
    } finally {
      setOpen(false);
    }
  };

  const handleTabsChange = (
    event: ChangeEvent<{}>,
    value: string,
  ): void => {
    const updatedFilters = {
      ...filters,
      beforeSale: null,
      onSale: null,
      afterSale: null,
      public: null,
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setSelectedHiddenboxes([]);
    setCurrentTab(value);
  };

  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setQuery(event.target.value);
  };

  const handleSortChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSort(event.target.value as Sort);
  };

  const handleSelectAllHiddenboxes = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedHiddenboxes(
      event.target.checked
        ? hiddenboxes.map((hiddenbox) => hiddenbox.id)
        : [],
    );
  };

  const handleSelectOneHiddenbox = (
    event: ChangeEvent<HTMLInputElement>,
    hiddenboxId: number,
  ): void => {
    if (!selectedHiddenboxes.includes(hiddenboxId)) {
      setSelectedHiddenboxes((prevSelected) => [hiddenboxId]);
    } else {
      setSelectedHiddenboxes((prevSelected) =>
        prevSelected.filter((id) => id !== hiddenboxId),
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleWriteComment = async (message: string) => {
    try {
      const newComment = {
        hiddenboxId: targetHiddenbox.id,
        author: targetHiddenbox.author.id,
        message,
      };
      const response = await axios.post(
        `/hiddenbox-comments`,
        newComment,
      );
      if (response.status === 200) {
        fetchComments(targetHiddenbox.id);
      }
    } catch (e) {
    } finally {
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await axios.delete(
        `/hiddenbox-comments/${commentId}`,
      );
      if (response.status === 200) {
        fetchComments(targetHiddenbox.id);
      }
    } catch (e) {
    } finally {
    }
  };

  const handleUpdateComment = async (
    commentId: number,
    message: string,
  ) => {
    try {
      const response = await axios.put(
        `/hiddenbox-comments/${commentId}`,
        { message },
      );
      if (response.status === 200) {
        fetchComments(targetHiddenbox.id);
      }
    } catch (e) {
    } finally {
    }
  };

  const filteredHiddenboxes = applyFilters(
    hiddenboxes,
    query,
    filters,
  );
  const sortedHiddenboxes = applySort(filteredHiddenboxes, sort);
  const paginatedHiddenboxes = applyPagination(
    sortedHiddenboxes,
    page,
    limit,
  );
  const enableBulkActions = selectedHiddenboxes.length > 0;
  const selectedSomeHiddenboxes =
    selectedHiddenboxes.length > 0 &&
    selectedHiddenboxes.length < hiddenboxes.length;
  const selectedAllHiddenboxes =
    selectedHiddenboxes.length === hiddenboxes.length;

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
              placeholder="히든박스 검색"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              m: 1,
              width: 240,
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
            >
              {sortOptions.map((option, index) => (
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
                checked={selectedAllHiddenboxes}
                color="primary"
                indeterminate={selectedSomeHiddenboxes}
                onChange={handleSelectAllHiddenboxes}
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
                to={`/dashboard/hiddenboxes/${selectedHiddenboxes[0]}/edit`}
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
                      checked={selectedAllHiddenboxes}
                      color="primary"
                      indeterminate={selectedSomeHiddenboxes}
                      onChange={handleSelectAllHiddenboxes}
                    /> */}
                  </TableCell>
                  <TableCell>상품명</TableCell>
                  <TableCell>판매일</TableCell>
                  <TableCell>공개일</TableCell>
                  <TableCell>가격</TableCell>
                  <TableCell>판매량</TableCell>
                  <TableCell>좋아요</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHiddenboxes.map((hiddenbox) => {
                  const isHiddenboxSelected =
                    selectedHiddenboxes.includes(hiddenbox.id);
                  return (
                    <TableRow
                      hover
                      key={hiddenbox.id}
                      selected={isHiddenboxSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isHiddenboxSelected}
                          color="primary"
                          onChange={(event) =>
                            handleSelectOneHiddenbox(
                              event,
                              hiddenbox.id,
                            )
                          }
                          value={isHiddenboxSelected}
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
                              to={`/dashboard/hiddenboxes/${hiddenbox.id}`}
                              variant="subtitle2"
                            >
                              {hiddenbox.title}
                            </Link>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {hiddenbox.author &&
                                hiddenbox.author.nickname}
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
                        {`${moment(hiddenbox.startDate).format(
                          'YYYY년 M월 D일 HH:mm',
                        )}-${moment(hiddenbox.endDate).format(
                          'YYYY년 M월 D일 HH:mm',
                        )}`}
                      </TableCell>
                      <TableCell>
                        {moment(hiddenbox.publicDate).format(
                          'YYYY년 M월 D일 HH:mm',
                        )}
                      </TableCell>
                      <TableCell>{hiddenbox.productId}</TableCell>
                      <TableCell>{hiddenbox.orders}</TableCell>
                      <TableCell>{hiddenbox.likes}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            onClickComment(hiddenbox);
                          }}
                        >
                          <ChatIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          component={RouterLink}
                          to={`/dashboard/hiddenboxes/${hiddenbox.id}/edit`}
                        >
                          <PencilAltIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          component={RouterLink}
                          to={`/dashboard/hiddenboxes/${hiddenbox.id}`}
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
          count={filteredHiddenboxes.length}
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
      <Dialog
        aria-labelledby="CommentModal"
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
      >
        <Box
          sx={{
            py: 3,
            px: 3,
          }}
        >
          <Box sx={{ pb: 3 }}>
            <Typography color="inherit" variant="h5">
              히든박스 코멘트
            </Typography>
          </Box>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <SocialPostComment
                commentId={comment.id}
                authorAvatar={
                  comment.author.avatar
                    ? `${CMSURL}${comment.author.avatar.url}`
                    : ''
                }
                authorName={comment.author.nickname}
                createdAt={comment.created_at}
                key={comment.id}
                message={comment.message}
                handleDeleteComment={handleDeleteComment}
                handleUpdateComment={handleUpdateComment}
              />
            ))
          ) : (
            <Box ml={3} mt={3}>
              <Typography variant={'body1'}>
                {'작성된 댓글이 없습니다.'}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <SocialPostCommentAdd
            handleWriteComment={handleWriteComment}
          />
        </Box>
      </Dialog>
    </>
  );
};

HiddenboxListTable.propTypes = {
  hiddenboxes: PropTypes.array.isRequired,
};

export default HiddenboxListTable;
