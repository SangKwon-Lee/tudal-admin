import * as React from 'react';

import { Tags } from 'src/types/tags';
import {
  Button,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  InputAdornment,
  TextField,
  Drawer,
  LinearProgress,
  Pagination,
  Link,
  Chip,
} from '@mui/material';
import BuildIcon from '@material-ui/icons/Build';
import dayjs from 'dayjs';
import _ from 'lodash';
import SearchIcon from 'src/icons/Search';
import { Container } from '@material-ui/core';
import NewKeywordDrawer from './NewKeywordDrawer';
import styled from '@emotion/styled';

const CustomDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 60%;
  }
`;
interface Props {
  page: number;
  handlePage: (e: any) => void;
  loading: boolean;
  keywordList: Tags[];
  handleSearch: (e: any) => void;
  search: {
    _q: string;
    _sort: string;
    _start: number;
    _limit: number;
  };
  listLength: number;
  sortOptions: {
    label: string;
    value: string;
  }[];
  open: boolean;
  keywordId: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKeywordId: React.Dispatch<React.SetStateAction<number>>;
}
export default function NewKeywordPresenter(props: Props) {
  const theme = useTheme();
  const {
    search,
    page,
    listLength,
    handlePage,
    loading,
    keywordList,
    handleSearch,
    sortOptions,
    setOpen,
    open,
    keywordId,
    setKeywordId,
  } = props;

  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Box display={'flex'} sx={{ mb: 2 }}>
        <TextField
          InputProps={{
            id: '_q',
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          id="_q"
          placeholder="키워드 검색"
          variant="outlined"
          onChange={_.debounce((e) => {
            handleSearch(e);
          }, 300)}
          sx={{ mr: 2, flex: 1 }}
        />
        <TextField
          InputProps={{
            id: 'stocks.name',
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          id="stocks.name"
          placeholder="종목 검색(종목명이 정확하게 일치해야 합니다)"
          variant="outlined"
          onChange={_.debounce((e) => {
            handleSearch(e);
          }, 300)}
          sx={{ mr: 2, flex: 1 }}
        />
        <TextField
          label="정렬"
          name="sort"
          id="_sort"
          select
          SelectProps={{ native: true }}
          variant="outlined"
          sx={{ flex: 0.7 }}
          onChange={(e) => {
            handleSearch(e);
          }}
          style={{ marginLeft: '5px', marginRight: '5px' }}
        >
          {sortOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={() => {
            setKeywordId(0);
            setOpen(true);
          }}
        >
          키워드 추가
        </Button>
      </Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          {loading && (
            <div data-testid="keyword-list-loading">
              <LinearProgress />
            </div>
          )}
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell align="center">생성일</TableCell>
                <TableCell align="center">수정일</TableCell>
                <TableCell align="center">요약문</TableCell>
                <TableCell align="center">설명문</TableCell>
                <TableCell align="center">수정</TableCell>
                <TableCell align="center">상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keywordList
                .sort(
                  (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime(),
                )
                .map((row: Tags, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow
                        sx={{
                          '& > *': {
                            borderBottom: 'none',
                            border: 'none !important',
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          variant="head"
                          sx={{
                            width: '200px',
                            fontSize: 24,
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setKeywordId(row?.id);
                            setOpen(true);
                          }}
                        >
                          <Link>{row?.name}</Link>
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(row?.created_at).format(
                            'YYYY-MM-DD',
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(row?.updated_at).format(
                            'YYYY-MM-DD',
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={row?.summary}>
                            {row?.summary ? (
                              <Button
                                color="primary"
                                // disabled
                                sx={{
                                  ':disabled': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                                onClick={() => {}}
                              >
                                작성완료
                              </Button>
                            ) : (
                              <Button
                                color="error"
                                onClick={() => {
                                  setKeywordId(row?.id);
                                  setOpen(true);
                                }}
                              >
                                작성 필요
                              </Button>
                            )}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={row?.description}>
                            {row?.description ? (
                              <Button
                                color="primary"
                                // disabled
                                sx={{
                                  ':disabled': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                                onClick={() => {}}
                              >
                                작성완료
                              </Button>
                            ) : (
                              <Button
                                color="error"
                                onClick={() => {
                                  setKeywordId(row.id);
                                  setOpen(true);
                                }}
                              >
                                작성 필요
                              </Button>
                            )}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => {
                              setKeywordId(row.id);
                              setOpen(true);
                            }}
                          >
                            <BuildIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton>
                            <Chip
                              color={
                                row?.isDeleted ? 'error' : 'info'
                              }
                              label={row?.isDeleted ? '삭제' : '정상'}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          borderBottom: `1px solid ${theme.palette.grey[300]}`,
                        }}
                      >
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={true}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box>
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 1 }}
                              >
                                종목
                              </Typography>
                              {Array.isArray(row?.stocks) &&
                              row.stocks.length > 0 ? (
                                row.stocks
                                  //@ts-ignore
                                  .sort((a, b) =>
                                    a.name < b.name
                                      ? -1
                                      : a.name > b.name
                                      ? 1
                                      : 0,
                                  )
                                  .map((data) => (
                                    <Chip
                                      key={data.code}
                                      onClick={() => {}}
                                      variant="outlined"
                                      sx={{ mr: 1, mb: 1 }}
                                      label={data.name}
                                      color="primary"
                                    />
                                  ))
                              ) : (
                                <Typography
                                  color={theme.palette.primary.main}
                                >
                                  종목이 없습니다.
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ my: 2 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 1 }}
                              >
                                Aliases
                              </Typography>

                              {Array.isArray(row?.tag_aliases) &&
                              row.tag_aliases.length > 0 ? (
                                row.tag_aliases
                                  .sort((a, b) =>
                                    a.name < b.name
                                      ? -1
                                      : a.name > b.name
                                      ? 1
                                      : 0,
                                  )
                                  .map((data) => (
                                    <Chip
                                      sx={{ mr: 1, mb: 1 }}
                                      color="success"
                                      onClick={() => {}}
                                      key={data.id}
                                      label={data.name}
                                      variant="outlined"
                                    />
                                  ))
                              ) : (
                                <Typography
                                  color={theme.palette.success.main}
                                >
                                  Aliases가 없습니다.
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
          <Pagination
            page={page}
            onChange={(e, page) => handlePage(page)}
            count={Math.ceil(listLength / search._limit)}
            variant="outlined"
            shape="rounded"
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          />
        </TableContainer>
      </Paper>
      <CustomDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Container
          sx={{
            width: '100%',
            padding: 0,
          }}
        >
          <NewKeywordDrawer keywordId={keywordId} />
        </Container>
      </CustomDrawer>
    </Box>
  );
}
