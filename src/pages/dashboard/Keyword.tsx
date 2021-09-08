import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { applyPagination } from 'src/utils/pagination';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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

const now = new Date();

const customFilter = createFilterOptions<any>();

const Keywords: React.FC = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const tagInput = useRef(null);
  const scrollRef = useRef(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newKeyword, setNewKeyword] = useState<string[]>([
    '',
    '',
    '',
  ]);
  const [targetTag, setTarget] = useState<Tag>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(false);
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
      console.log('load more');
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

  const handleNewKeyword = (event, index) => {
    const _newKeyword = [...newKeyword];
    _newKeyword[index] = event.target.value;
    setNewKeyword(_newKeyword);
  };

  const handlePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number,
  ): void => {
    if ((page + 1) * rowsPerPage >= tags.length - rowsPerPage) {
      setLoadMore(true);
    }
    setPage(newPage);
  };

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    loadMore && loadMoreList();
  }, [loadMore]);

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
          <Box display="flex" mt={3}>
            <Autocomplete
              fullWidth
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={tagList}
              // onChange={}
              getOptionLabel={(option) => {
                const label = option.name;
                if (option.hasOwnProperty('isNew')) {
                  return `+ '${label}'`;
                }
                return label;
              }}
              filterOptions={(options, params) => {
                const filtered = customFilter(options, params);
                if (
                  user.role.type !== IRoleType.Author &&
                  filtered.length === 0 &&
                  params.inputValue !== ''
                ) {
                  filtered.push({
                    id: Math.random(),
                    isNew: true,
                    name: params.inputValue,
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
                        {tagLoading ? (
                          <CircularProgress
                            color="inherit"
                            size={20}
                          />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            <TextField
              label="키워드_1"
              name="title"
              required
              variant="outlined"
              onChange={(event) => handleNewKeyword(event, 0)}
            />
            <TextField
              label="키워드_2"
              name="title"
              required
              variant="outlined"
              onChange={(event) => handleNewKeyword(event, 1)}
            />
            <TextField
              label="키워드_3"
              name="title"
              required
              variant="outlined"
              onChange={(event) => handleNewKeyword(event, 2)}
            />

            {console.log(newKeyword)}
            <Button variant="outlined">수정</Button>
          </Box>
          <Card>
            {/* <Tabs
              indicatorColor="primary"
              scrollButtons="auto"
              textColor="primary"
              value="all"
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs> */}
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
                  placeholder="Search customers"
                  variant="outlined"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </Box>
            </Box>
            {loading && <LinearProgress />}
            <Scrollbar>
              <Box sx={{ minWidth: 700 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" />
                      </TableCell>
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
                          <TableCell padding="checkbox">
                            <Checkbox color="primary" />
                          </TableCell>
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
                              {tag.updated_at}
                            </Typography>
                          </TableCell>
                          <TableCell>{'요약문'}</TableCell>
                          <TableCell>{'설명문'}</TableCell>
                          <TableCell>
                            <IconButton>
                              <BuildIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton>
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
