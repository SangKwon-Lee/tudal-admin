import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { applyPagination } from 'src/utils/pagination';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import dayjs from 'dayjs';

import {
  Box,
  Container,
  Breadcrumbs,
  Grid,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Autocomplete,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Dialog,
} from '@material-ui/core';

import useSettings from 'src/hooks/useSettings';
import toast, { Toaster } from 'react-hot-toast';
import Scrollbar from '../../components/layout/Scrollbar';
import ChevronRightIcon from 'src/icons/ChevronRight';
import { IRoleType } from 'src/types/user';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import * as _ from 'lodash';
import useAsync from 'src/hooks/useAsync';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import BuildIcon from '@material-ui/icons/Build';
import SearchIcon from '../../icons/Search';
import { APICategory } from 'src/lib/api';
import { Category } from 'src/types/schedule';
import useAuth from 'src/hooks/useAuth';

import CategoryEditDialog from 'src/components/dashboard/category/CategoryEditDialog';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import Label from 'src/components/widgets/Label';
import { errorMessage } from 'src/common/error';

const customFilter = createFilterOptions<any>();

const CategoryPage: React.FC = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const categoryCreateRef = useRef(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>(null);
  const [targetCategory, setTarget] = useState<Category>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(false);

  // Dialogs
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDeleteTag, setOpenDeleteTag] = useState<boolean>(false);

  const rowsPerPage = 25;

  const getTagList = useCallback(() => {
    const value = categoryCreateRef.current
      ? categoryCreateRef.current.value
      : '';
    return APICategory.getList(value);
  }, []);

  const [
    { data: categoryList, loading: categoryListLoading },
    refetchCategory,
  ] = useAsync<Category[]>(getTagList, [], []);

  const handleCreateInput = _.debounce(refetchCategory, 300);

  const getList = useCallback(async () => {
    setLoading(true);
    try {
      const { data, status } = await APICategory.getList(search);
      if (status === 200) {
        setCategories(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const loadMoreList = useCallback(async () => {
    setLoading(true);
    try {
      const start = (page + 1) * rowsPerPage; //rows per page
      const { data, status } = await APICategory.getList(
        search,
        start,
      );
      if (status === 200) {
        setCategories((prev) => [...prev, ...data]);
        setLoadMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  const handlePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number,
  ): void => {
    if ((page + 1) * rowsPerPage >= categories.length - rowsPerPage) {
      setLoadMore(true);
    }
    setPage(newPage);
  };

  const handleCreate = async () => {
    setLoading(true);

    try {
      if (!newCategory) {
        toast.error('입력을 확인해주세요.');
        return;
      }
      if (!newCategory.isNew) {
        toast.error('이미 등록된 카테고리입니다.');
        return;
      }
      const value = newCategory.inputValue;
      const { status, data } = await APICategory.postItem(value);
      if (status === 200) {
        toast.success('추가되었습니다.');
        setSearch('');
        setNewCategory(null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const reload = () => getList();

  const handleUpdate = async (id, body) => {
    try {
      if (!body && !body.name) {
        toast.error('카테고리를 입력해주세요');
        return;
      }
      const { data, status } = await APICategory.get(body.name);
      if (status !== 200) {
        toast.error(errorMessage.TEMP_SERVER_ERROR);
        return;
      }
      if (data && !_.isEmpty(data)) {
        toast.error('중복된 카테고리 입니다.');
        return;
      }
      await APICategory.update(id, body);
      setOpenUpdate(false);
      setTarget(null);
      reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      if (user.role.type === IRoleType.Author) {
        toast.error('삭제는 관리자 권한이 필요합니다.');
      } else {
        const { status, data } = await APICategory.update(
          category.id,
          {
            isDeleted: !category.isDeleted,
          },
        );
        if (status === 200) {
          toast.success(
            data.isDeleted ? '삭제되었습니다.' : '복구되었습니다.',
          );
          reload();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenDeleteTag(false);
      setTarget(null);
    }
  };

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    loadMore && loadMoreList();
  }, [loadMore]);

  useEffect(() => {
    scrollRef.current &&
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [page]);

  const category = newCategory
    ? newCategory.isNew
      ? newCategory.inputValue
      : newCategory.name
    : '';

  const paginatedCategories = applyPagination(
    categories,
    page,
    rowsPerPage,
  );
  return (
    <>
      <Helmet>
        <title>Dashboard: Category List | TUDAL Admin</title>
      </Helmet>
      <Toaster />
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container
          maxWidth={settings.compact ? 'xl' : false}
          ref={scrollRef}
        >
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                카테고리 리스트
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  대시보드
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  컨텐츠관리
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  카테고리
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box my={3}>
            <Typography color="textPrimary" variant="h6">
              카테고리 추가
            </Typography>
            <Box display="flex">
              <Autocomplete
                freeSolo
                value={category}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={categoryList}
                style={{
                  width: 500,
                  marginRight: 10,
                }}
                onChange={(event, newValue) => {
                  console.log(newValue);
                  if (typeof newValue !== 'string') {
                    setNewCategory(newValue);
                  }
                }}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') {
                    return option;
                  }
                  if (option.isNew) {
                    return option.name;
                  }
                  return option.name;
                }}
                filterOptions={(options, params) => {
                  const filtered = customFilter(options, params);

                  if (params.inputValue !== '') {
                    filtered.push({
                      id: Math.random(),
                      isNew: true,
                      name: `+ "${params.inputValue}"`,
                      inputValue: params.inputValue,
                    });
                  }

                  return filtered;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="카테고리 추가"
                    name="category"
                    variant="outlined"
                    onChange={handleCreateInput}
                    inputRef={categoryCreateRef}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {categoryListLoading && (
                            <CircularProgress
                              color="inherit"
                              size={20}
                            />
                          )}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
              <Button variant="contained" onClick={handleCreate}>
                추가
              </Button>
            </Box>
          </Box>
          <Card>
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
                    id: 'search',
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  id="search"
                  placeholder="검색"
                  variant="outlined"
                  onChange={_.debounce((e) => {
                    setSearch(e.target.value);
                  }, 300)}
                />
              </Box>
            </Box>
            {loading && (
              <div data-testid="keyword-list-loading">
                <LinearProgress />
              </div>
            )}
            <Scrollbar>
              <Box
                sx={{ minWidth: 700 }}
                data-testid="keyword-list-table"
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>카테고리</TableCell>
                      <TableCell>최종수정일시</TableCell>
                      <TableCell>상태</TableCell>
                      <TableCell>수정</TableCell>
                      <TableCell>삭제</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCategories.map((category) => {
                      return (
                        <TableRow hover key={category.id}>
                          <TableCell>{category.id}</TableCell>
                          <TableCell>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {category.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {dayjs(category.updated_at).format(
                                'YYYY-MM-DD',
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Label
                              color={
                                category.isDeleted
                                  ? 'error'
                                  : 'success'
                              }
                            >
                              {category.isDeleted ? '삭제' : '정상'}
                            </Label>{' '}
                          </TableCell>

                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setTarget(category);
                                setOpenUpdate(true);
                              }}
                            >
                              <BuildIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setOpenDeleteTag(true);
                                setTarget(category);
                              }}
                            >
                              {category.isDeleted ? (
                                <RefreshIcon fontSize="small" />
                              ) : (
                                <DeleteIcon fontSize="small" />
                              )}
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
              count={categories.length}
              onPageChange={handlePage}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Card>

          {/* Dialogs */}
          {openUpdate && (
            <CategoryEditDialog
              open={openUpdate}
              setClose={() => {
                setOpenUpdate(false);
                setTarget(null);
              }}
              category={targetCategory}
              update={handleUpdate}
              reload={getList}
            />
          )}

          {targetCategory && (
            <Dialog
              aria-labelledby="ConfirmModal"
              open={openDeleteTag}
              onClose={() => setOpenDeleteTag(false)}
            >
              <ConfirmModal
                title={
                  targetCategory.isDeleted
                    ? '카테고리 복구'
                    : '카테고리 삭제'
                }
                content={
                  targetCategory.isDeleted
                    ? '해당 카테고리를 복구하시겠습니까'
                    : '해당 카테고리를 삭제하시겠습니까'
                }
                confirmTitle={
                  targetCategory.isDeleted ? '복구' : '삭제'
                }
                type={targetCategory.isDeleted ? 'CONFIRM' : 'ERROR'}
                handleOnClick={() => handleDelete(targetCategory)}
                handleOnCancel={() => {
                  setOpenDeleteTag(false);
                  setTarget(null);
                }}
              />
            </Dialog>
          )}
        </Container>
      </Box>
    </>
  );
};

export default CategoryPage;
