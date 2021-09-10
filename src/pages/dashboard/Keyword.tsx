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
import { subDays, subHours } from 'date-fns';
import {
  Avatar,
  Box,
  Container,
  Breadcrumbs,
  Grid,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  Tab,
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
import BuildIcon from '@material-ui/icons/Build';
import SearchIcon from '../../icons/Search';
import { APITag } from 'src/lib/api';
import { Tag } from 'src/types/schedule';
import useAuth from 'src/hooks/useAuth';

import KeywordEditDialog from 'src/components/dashboard/keyword/KeywordEditDialog';
import EditTextDialog from 'src/components/widgets/dialogs/Dialog.EditText';

const now = new Date();

const customFilter = createFilterOptions<any>();

const Keywords: React.FC = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const tagInput = useRef(null);
  const scrollRef = useRef(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newKeyword, setNewKeyword] = useState<Tag>(null);
  const [addType, setAddType] = useState<boolean>(true);
  const [targetTag, setTarget] = useState<Tag>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(false);

  // Dialogs
  const [openTag, setOpenTag] = useState<boolean>(false);
  const [openSummary, setOpenSummary] = useState<boolean>(false);
  const [openDescription, setOpenDescription] =
    useState<boolean>(false);

  const rowsPerPage = 20;

  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList(value);
  }, [tagInput]);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput], []);
  const handleTagChange = _.debounce(refetchTag, 300);

  const getList = useCallback(async () => {
    setLoading(true);
    try {
      const { data, status } = await APITag.getList(search);
      if (status === 200) {
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
      const { data, status } = await APITag.getList(search, start);
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
    try {
      if (!newKeyword.isNew) {
        alert('이미 등록된 키워드입니다.');
        return;
      }
      const value = newKeyword.inputValue;
      const { status, data } = await APITag.postItem(value);
      console.log(status, data);
      if (status === 200) {
        alert('완료되었습니다.');
        setNewKeyword(null);
        tagInput.current.value = '';
      }
    } catch (error) {
      alert('키워드를 다시 확인해주세요');
    }
  };

  const reload = () => getList();

  const updateTag = async (id, body) => {
    try {
      await APITag.update(id, body);
      setOpenTag(false);
      setTarget(null);
      reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await APITag.remove(id);
      reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    loadMore && loadMoreList();
  }, [loadMore]);

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
      {openTag && targetTag && (
        <KeywordEditDialog
          open={openTag}
          setClose={() => {
            setOpenTag(false);
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
                label={addType ? '한개씩 등록' : '여러개 등록'}
                control={
                  <Switch
                    checked={addType}
                    onChange={(event) =>
                      setAddType(event.target.checked)
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
                {addType ? (
                  <Autocomplete
                    freeSolo
                    value={keyword}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    options={tagList}
                    style={{ width: 500, marginRight: 10 }}
                    onChange={(event, newValue) => {
                      if (!newValue) {
                        setNewKeyword(null);
                        return;
                      }
                      if (typeof newValue !== 'string') {
                        console.log(newValue);
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
                      const filtered = customFilter(options, params);

                      if (params.inputValue !== '') {
                        filtered.push({
                          id: Math.random(),
                          isNew: true,
                          name: `Add "${params.inputValue}"`,
                          inputValue: params.inputValue,
                        });
                      }

                      return filtered;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={handleTagChange}
                        fullWidth
                        label="키워드"
                        name="keyword"
                        variant="outlined"
                        inputRef={tagInput}
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
                ) : (
                  <TextField
                    style={{ width: 500, marginRight: 10 }}
                    multiline
                    rows={3}
                    helperText="띄어쓰기로 나누어 태그를 등록해주세요."
                  ></TextField>
                )}

                <Button variant="outlined" onClick={handleCreate}>
                  추가
                </Button>
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="키워드를 검색해주세요"
                  variant="outlined"
                  onChange={_.debounce(
                    (e) => setSearch(e.target.value),
                    300,
                  )}
                />
              </Box>
            </Box>
            {loading && <LinearProgress />}
            <Scrollbar>
              <Box sx={{ minWidth: 700 }}>
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
                              {tag.summary ? '더보기' : '작성'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => {
                                setTarget(tag);
                                setOpenDescription(true);
                              }}
                            >
                              {tag.description ? '더보기' : '작성'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setTarget(tag);
                                setOpenTag(true);
                              }}
                            >
                              <BuildIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleDelete(tag.id)}
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
            </Scrollbar>
            <TablePagination
              component="div"
              count={tags.length}
              onPageChange={handlePage}
              page={page}
              rowsPerPage={20}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Keywords;
