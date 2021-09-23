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
  FormControlLabel,
  Switch,
  Dialog,
} from '@material-ui/core';

import useSettings from 'src/hooks/useSettings';
import toast, { Toaster } from 'react-hot-toast';
import Scrollbar from '../../components/layout/Scrollbar';
import ChevronRightIcon from 'src/icons/ChevronRight';
import { IRoleType } from 'src/types/user';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import * as _ from 'lodash';
import ArrowRightIcon from 'src/icons/ArrowRight';
import useAsync from 'src/hooks/useAsync';
import PencilAltIcon from 'src/icons/PencilAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import BuildIcon from '@material-ui/icons/Build';
import AliasIcon from '@material-ui/icons/ShoppingBag';
import SearchIcon from '../../icons/Search';
import { APITag } from 'src/lib/api';
import { ITagAlias, Tag } from 'src/types/schedule';
import useAuth from 'src/hooks/useAuth';

import KeywordEditDialog from 'src/components/dashboard/keyword/KeywordEditDialog';
import EditTextDialog from 'src/components/dialogs/Dialog.EditText';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import DialogEditMultiSelect from 'src/components/dialogs/Dialog.EditMultiSelect';
import Label from 'src/components/widgets/Label';
import { errorMessage } from 'src/common/error';

const customFilter = createFilterOptions<any>();

const Keywords: React.FC = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const tagCreateRef = useRef(null);

  const [tags, setTags] = useState<Tag[]>([]);
  const [newKeyword, setNewKeyword] = useState<Tag>(null);
  const [isMultiCreate, setMultiCreate] = useState<boolean>(false);
  const [targetTag, setTarget] = useState<Tag>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(false);

  // Dialogs
  const [openUpdateTag, setOpenUpdateTag] = useState<boolean>(false);
  const [openSummary, setOpenSummary] = useState<boolean>(false);
  const [openDescription, setOpenDescription] =
    useState<boolean>(false);
  const [openDeleteTag, setOpenDeleteTag] = useState<boolean>(false);
  const [openAlias, setOpenAlias] = useState<boolean>(false);

  const rowsPerPage = 25;

  const getTagList = useCallback(() => {
    const value = tagCreateRef.current
      ? tagCreateRef.current.value
      : '';
    return APITag.getList(value, true);
  }, []);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [search], []);

  const handleTagInput = _.debounce(refetchTag, 300);

  const getList = useCallback(async () => {
    setLoading(true);
    try {
      const { data, status } = await APITag.getList(search, true);
      if (status === 200) {
        console.log('here');
        setTags(data);
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
      const { data, status } = await APITag.getList(
        search,
        true,
        start,
      );
      if (status === 200) {
        setTags((prev) => [...prev, ...data]);
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
    if ((page + 1) * rowsPerPage >= tags.length - rowsPerPage) {
      setLoadMore(true);
    }
    setPage(newPage);
  };

  const handleCreate = async () => {
    setLoading(true);

    try {
      if (!newKeyword) {
        toast.error('입력해주세요.');
        return;
      }
      if (!newKeyword.isNew) {
        toast.error('이미 등록된 키워드입니다.');
        return;
      }
      const value = newKeyword.inputValue;
      const { status, data } = await APITag.postItem(value);
      if (status === 200) {
        toast.success('추가되었습니다.');
        setSearch('');
        setNewKeyword(null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiCreate = async () => {
    setLoading(true);

    try {
      if (!tagCreateRef.current.value) {
        toast.error('키워드를 확인해 주세요');
        return;
      }
      const values = tagCreateRef.current.value.split('\n');

      const success = [];
      const errors = [];
      for (let i = 0; i < values.length; i++) {
        const { data, status } = await APITag.postItem(values[i]);
        if (status === 200 && Boolean(data)) {
          success.push(data.name);
        } else {
          errors.push(values[i]);
        }
      }
      success.forEach((success) => toast.success(success));
      errors.forEach((error) => toast.error(error));
      tagCreateRef.current.value = '';
    } catch (error) {
      toast.error('키워드를 다시 확인해주세요');
    } finally {
      setLoading(false);
    }
  };

  const reload = () => getList();
  const reloadTarget = async () => {
    try {
      const { data, status } = await APITag.getItem(targetTag.id);
      if (status === 200) {
        setTarget(data[0]);
        reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTag = async (id, body) => {
    try {
      console.log(id, body);
      if (body && body.name) {
        const { status, data } = await APITag.find(body.name);
        if (status !== 200) {
          toast.error(errorMessage.TEMP_SERVER_ERROR);
          return;
        }
        if (!_.isEmpty(data)) {
          toast.error('중복된 키워드가 있습니다');
          return;
        }
      }
      await APITag.update(id, body);
      setOpenUpdateTag(false);
      setTarget(null);
      reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (tag: Tag) => {
    try {
      if (user.role.type !== IRoleType.AUTHENTICATED) {
        toast.error('삭제는 관리자 권한이 필요합니다.');
      } else {
        const { status, data } = await APITag.update(tag.id, {
          isDeleted: !tag.isDeleted,
        });
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

  const handleCreateAlias = async (name) => {
    try {
      const { data, status } = await APITag.postAlias(
        targetTag.id,
        name,
      );
      if (status === 200) {
        toast.success('alias 추가에 성공했습니다.');
        reloadTarget();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAlias = async (tagAlias: ITagAlias) => {
    try {
      const { data, status } = await APITag.removeAlias(tagAlias.id);
      if (status === 200) {
        toast.success(
          `${tagAlias.aliasName}이(가) 성공적으로 삭제되었습니다.`,
        );
        reloadTarget();
      }
    } catch (error) {
      toast.error(error.message);
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

  const keyword = newKeyword
    ? newKeyword.isNew
      ? newKeyword.inputValue
      : newKeyword.name
    : '';

  const paginatedTags = applyPagination(tags, page, rowsPerPage);
  return (
    <>
      <Helmet>
        <title>Dashboard: Schedule List | TUDAL Admin</title>
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
                키워드 리스트
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
                  키워드
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box my={3}>
            <Typography color="textPrimary" variant="h6">
              키워드 추가
            </Typography>
            <Card>
              <FormControlLabel
                style={{ margin: '10px' }}
                label={'여러개 등록'}
                control={
                  <Switch
                    checked={isMultiCreate}
                    onChange={(event) =>
                      setMultiCreate(event.target.checked)
                    }
                    name="수동 등록"
                    color="primary"
                  />
                }
              />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  m: -1,
                  p: 4,
                }}
              >
                {isMultiCreate ? (
                  <>
                    <TextField
                      style={{ width: 500, marginRight: 10 }}
                      multiline
                      rows={3}
                      inputRef={tagCreateRef}
                      helperText="띄어쓰기로 나누어 태그를 등록해주세요."
                    />
                    <Button
                      variant="contained"
                      onClick={handleMultiCreate}
                    >
                      추가
                    </Button>
                  </>
                ) : (
                  <>
                    <Autocomplete
                      freeSolo
                      value={keyword}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      options={tagList}
                      style={{
                        width: 500,
                        marginRight: 10,
                      }}
                      onChange={(event, newValue) => {
                        if (!newValue) {
                          setNewKeyword(null);
                          return;
                        }
                        if (typeof newValue !== 'string') {
                          if (
                            newValue &&
                            newValue.isNew &&
                            newValue.inputValue
                          ) {
                            setNewKeyword(newValue);
                          }
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
                        const filtered = customFilter(
                          options,
                          params,
                        );

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
                          inputRef={tagCreateRef}
                          onChange={handleTagInput}
                          label="키워드 추가"
                          name="keyword"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {tagLoading && (
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
                    <Button
                      variant="contained"
                      onClick={handleCreate}
                    >
                      추가
                    </Button>
                  </>
                )}
              </Box>
            </Card>
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
                      <TableCell>키워드_1</TableCell>
                      <TableCell>키워드_2</TableCell>
                      <TableCell>키워드_3</TableCell>
                      <TableCell>최종수정일시</TableCell>
                      <TableCell>요약문</TableCell>
                      <TableCell>설명문</TableCell>
                      <TableCell>상태</TableCell>
                      <TableCell>Alias</TableCell>
                      <TableCell>수정</TableCell>
                      <TableCell>삭제</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTags.map((tag) => {
                      const [depth_1, depth_2, depth_3] =
                        tag.name.split('.');
                      return (
                        <TableRow hover key={tag.id}>
                          <TableCell>{tag.id}</TableCell>
                          <TableCell>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {depth_1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {depth_2}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {depth_3}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {dayjs(tag.updated_at).format(
                                'YYYY-MM-DD',
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => {
                                setTarget(tag);
                                setOpenSummary(true);
                              }}
                            >
                              {tag.summary ? '확인' : '작성'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => {
                                setTarget(tag);
                                setOpenDescription(true);
                              }}
                            >
                              {tag.description ? '확인' : '작성'}
                            </Button>
                          </TableCell>

                          <TableCell>
                            <Label
                              color={
                                tag.isDeleted ? 'error' : 'success'
                              }
                            >
                              {tag.isDeleted ? '삭제' : '정상'}
                            </Label>{' '}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setTarget(tag);
                                setOpenAlias(true);
                              }}
                            >
                              <AliasIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setTarget(tag);
                                setOpenUpdateTag(true);
                              }}
                            >
                              <BuildIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setOpenDeleteTag(true);
                                setTarget(tag);
                              }}
                            >
                              {tag.isDeleted ? (
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
              count={tags.length}
              onPageChange={handlePage}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Card>

          {/* Dialogs */}

          {openAlias && targetTag && (
            <DialogEditMultiSelect
              id={'id'}
              name={'aliasName'}
              isOpen={openAlias}
              options={targetTag.alias}
              handleOpen={setOpenAlias}
              handleCreate={handleCreateAlias}
              handleDelete={handleDeleteAlias}
            />
          )}
          {openUpdateTag && targetTag && (
            <KeywordEditDialog
              open={openUpdateTag}
              setClose={() => {
                setOpenUpdateTag(false);
                setTarget(null);
              }}
              tag={targetTag}
              updateTag={updateTag}
              reload={getList}
            />
          )}

          {openSummary && targetTag && (
            <EditTextDialog
              open={openSummary}
              setOpen={setOpenSummary}
              onSubmit={(_text) =>
                updateTag(targetTag.id, { summary: _text })
              }
              title={'요약문 변경'}
              description={'요약문을 변경합니다.'}
              defaultText={targetTag.summary}
              isMultiLine={true}
            />
          )}
          {openDescription && targetTag && (
            <EditTextDialog
              open={openDescription}
              setOpen={setOpenDescription}
              onSubmit={(_text) =>
                updateTag(targetTag.id, { description: _text })
              }
              title={'요약문 변경'}
              description={'요약문을 변경합니다.'}
              defaultText={targetTag.description}
              isMultiLine={true}
            />
          )}
          {targetTag && (
            <Dialog
              aria-labelledby="ConfirmModal"
              open={openDeleteTag}
              onClose={() => setOpenDeleteTag(false)}
            >
              <ConfirmModal
                title={
                  targetTag.isDeleted ? '키워드 복구' : '키워드 삭제'
                }
                content={
                  targetTag.isDeleted
                    ? '해당 키워드를 복구하시겠습니까'
                    : '해당 키워드를 삭제하시겠습니까'
                }
                confirmTitle={targetTag.isDeleted ? '복구' : '삭제'}
                type={targetTag.isDeleted ? 'CONFIRM' : 'ERROR'}
                handleOnClick={() => handleDelete(targetTag)}
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

export default Keywords;
