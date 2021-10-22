import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
} from 'react';
import { applyPagination } from 'src/utils/pagination';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import dayjs from 'dayjs';

import {
  FormLabel,
  Checkbox,
  Tooltip,
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
  Chip,
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
  Collapse,
  Pagination,
} from '@material-ui/core';

import useSettings from 'src/hooks/useSettings';
import toast, { Toaster } from 'react-hot-toast';
import Scrollbar from 'src/components/layout/Scrollbar';
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
import AliasIcon from '@material-ui/icons/Repeat';
import SearchIcon from 'src/icons/Search';
import { APITag } from 'src/lib/api';
import { ITagAlias, Tag } from 'src/types/schedule';
import useAuth from 'src/hooks/useAuth';

import KeywordEditDialog from 'src/components/dashboard/keyword/KeywordEditDialog';
import EditTextDialog from 'src/components/dialogs/Dialog.EditText';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import DialogEditMultiSelect from 'src/components/dialogs/Dialog.EditMultiSelect';
import Label from 'src/components/widgets/Label';
import { errorMessage } from 'src/common/error';
import { isStringEmpty } from 'src/utils/funcs';
import {
  IKeywordListDispatch,
  IKeywordListState,
  KeywordActionKind,
} from './KeywordList.Container';

const customFilter = createFilterOptions<any>();
interface ISortOption {
  label: string;
  value: string;
}

const sortOptions: ISortOption[] = [
  {
    label: '기본',
    value: 'id:asc',
  },
  {
    label: '이름순',
    value: 'name:desc',
  },
  {
    label: '수정일 최신순',
    value: 'updated_at:desc',
  },
];

const filterOptions = [
  {
    label: '요약문',
    name: 'summary_null',
    value: false,
  },
  {
    label: '설명문',
    name: 'description_null',
    value: false,
  },
];

interface IKeywordListPresenterProps {
  state: IKeywordListState;
  multiTagInputRef: React.RefObject<HTMLTextAreaElement>;
  tagAddInputRef: React.RefObject<HTMLInputElement>;
  keywordAutocomplete: { loading: boolean; data: Tag[]; error: any };

  dispatch: (params: IKeywordListDispatch) => void;
  postKeyword: () => void;
  updateKeyword: (id, body) => void;
  deleteKeyword: (tag: Tag) => void;
  createAlias: (name: string) => void;
  deleteAlias: (alias: ITagAlias) => void;
  postMultiKeywords: () => void;
  refetchKeywordAutocomplete: () => void;
}

const KeywordListPresenter: React.FC<IKeywordListPresenterProps> = (
  props,
) => {
  const {
    state,
    dispatch,
    postMultiKeywords,
    postKeyword,
    multiTagInputRef,
    tagAddInputRef,
    keywordAutocomplete,
    refetchKeywordAutocomplete,
    createAlias,
    deleteAlias,
    updateKeyword,
    deleteKeyword,
  } = props;

  const {
    loading: keywordAutocompleteLoading,
    data: keywordAutocompleteList,
    error,
  } = keywordAutocomplete;

  const { alias, update, summary, description } = state;
  return (
    <>
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
                checked={state.isMultiCreate}
                onChange={() =>
                  dispatch({
                    type: KeywordActionKind.SET_MULTI_CREATE,
                  })
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
            {state.isMultiCreate ? (
              <>
                <TextField
                  style={{ width: 500, marginRight: 10 }}
                  multiline
                  rows={3}
                  inputRef={multiTagInputRef}
                  helperText="띄어쓰기로 나누어 태그를 등록해주세요."
                />
                <Button
                  variant="contained"
                  onClick={postMultiKeywords}
                >
                  추가
                </Button>
              </>
            ) : (
              <>
                <Autocomplete
                  freeSolo
                  value={state.newKeyword}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  options={keywordAutocompleteList}
                  style={{
                    width: 500,
                    marginRight: 10,
                  }}
                  onChange={(event, newValue) => {
                    if (typeof newValue !== 'string') {
                      if (
                        newValue &&
                        newValue.isNew &&
                        newValue.inputValue
                      ) {
                        dispatch({
                          type: KeywordActionKind.SET_NEW_KEYWORD,
                          payload: newValue,
                        });
                      } else {
                        toast.error('이미 등록된 키워드입니다');
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
                      inputRef={tagAddInputRef}
                      onChange={refetchKeywordAutocomplete}
                      label="키워드 추가"
                      name="keyword"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {keywordAutocompleteLoading && (
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
                <Button variant="contained" onClick={postKeyword}>
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
                dispatch({
                  type: KeywordActionKind.CHANGE_SEARCH,
                  payload: e.target.value,
                });
              }, 300)}
            />
          </Box>
          <TextField
            label="정렬"
            name="sort"
            select
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={(e) => {
              dispatch({
                type: KeywordActionKind.CHANGE_SORT,
                payload: e.target.value,
              });
            }}
            style={{ marginLeft: '5px', marginRight: '5px' }}
          >
            {sortOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          {filterOptions.map((filter, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={filter.value}
                    color="primary"
                    name={filter.label}
                    onChange={() =>
                      dispatch({
                        type: KeywordActionKind.SET_SUMMARY_FILTER,
                      })
                    }
                  />
                }
                label={
                  <>
                    <Typography color="textPrimary" variant="body1">
                      {filter.label}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                    >
                      (작성되지 않은)
                    </Typography>
                  </>
                }
              />
            );
          })}
        </Box>
        {state.loading && (
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
                {state.list.map((tag, index) => {
                  const [depth_1, depth_2, depth_3] =
                    tag.name.split('.');
                  return (
                    <React.Fragment key={index}>
                      <TableRow
                        key={tag.id}
                        sx={{
                          '& > *': {
                            border: 'none',
                          },
                        }}
                      >
                        <TableCell>{tag.id}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            <Box sx={{ ml: 1, maxWidth: '150px' }}>
                              <Typography
                                color="textSecondary"
                                variant="body2"
                              >
                                {depth_1}{' '}
                              </Typography>
                            </Box>
                          </Box>
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
                          <Tooltip
                            title={
                              isStringEmpty(tag.summary)
                                ? '작성해주세요'
                                : tag.summary
                            }
                            placement="bottom"
                          >
                            <Button
                              onClick={() => {
                                dispatch({
                                  type: KeywordActionKind.HANDLE_SUMMARY_DIALOG,
                                  payload: {
                                    isOpen: true,
                                    target: tag,
                                  },
                                });
                              }}
                            >
                              <Typography
                                color={
                                  isStringEmpty(tag.summary)
                                    ? 'lightgrey'
                                    : ''
                                }
                                variant="button"
                              >
                                {isStringEmpty(tag.summary)
                                  ? '작성'
                                  : '확인'}
                              </Typography>
                            </Button>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              isStringEmpty(tag.description)
                                ? '작성해주세요'
                                : tag.description
                            }
                            placement="bottom"
                          >
                            <Button
                              onClick={() => {
                                dispatch({
                                  type: KeywordActionKind.HANDLE_DESCRIPTION_DIALOG,
                                  payload: {
                                    isOpen: true,
                                    target: tag,
                                  },
                                });
                              }}
                            >
                              <Typography
                                color={
                                  isStringEmpty(tag.description)
                                    ? 'lightgrey'
                                    : ''
                                }
                                variant="button"
                              >
                                {isStringEmpty(tag.description)
                                  ? '작성'
                                  : '확인'}
                              </Typography>
                            </Button>
                          </Tooltip>
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
                          <Tooltip
                            title={
                              !tag.alias.length
                                ? '존재하지 않습니다'
                                : tag.alias.map((alias, index) => {
                                    return (
                                      <Chip
                                        key={index}
                                        color="primary"
                                        label={alias.aliasName}
                                        style={{ marginLeft: 3 }}
                                      />
                                    );
                                  })
                            }
                            placement="bottom"
                          >
                            <IconButton
                              onClick={() => {
                                dispatch({
                                  type: KeywordActionKind.HANDLE_ALIAS_DIALOG,
                                  payload: {
                                    isEditing: true,
                                    target: tag,
                                  },
                                });
                              }}
                            >
                              <AliasIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              dispatch({
                                type: KeywordActionKind.SHOW_UPDATE_DIALOG,
                                payload: tag,
                              });
                            }}
                          >
                            <BuildIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              dispatch({
                                type: KeywordActionKind.SHOW_DELETE_DIALOG,
                                payload: tag,
                              });
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
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <Pagination
          page={state.page}
          onChange={(e, page) =>
            dispatch({
              type: KeywordActionKind.CHANGE_PAGE,
              payload: page,
            })
          }
          count={Math.ceil(state.listLength / state.status._limit)}
          variant="outlined"
          shape="rounded"
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        />
      </Card>

      {/* Dialogs */}

      {alias.isEditing && (
        <DialogEditMultiSelect
          id={'id'}
          name={'aliasName'}
          isOpen={alias.isEditing}
          options={alias.target.alias}
          handleOpen={(isOpen) => {
            dispatch({
              type: KeywordActionKind.HANDLE_ALIAS_DIALOG,
              payload: { isEditing: isOpen },
            });
          }}
          handleCreate={createAlias}
          handleDelete={deleteAlias}
        />
      )}
      {update.isUpdating && (
        <KeywordEditDialog
          open={update.isUpdating}
          setClose={() => {
            dispatch({ type: KeywordActionKind.CLOSE_UPDATE_DIALOG });
          }}
          tag={update.target}
          updateTag={updateKeyword}
        />
      )}

      {summary.isEditing && (
        <EditTextDialog
          open={summary.isEditing}
          setOpen={(isOpen) => {
            dispatch({
              type: KeywordActionKind.HANDLE_SUMMARY_DIALOG,
              payload: { isOpen },
            });
          }}
          onSubmit={(_text) =>
            updateKeyword(summary.target.id, { summary: _text })
          }
          title={'요약문 변경'}
          description={'요약문을 변경합니다.'}
          defaultText={summary.target.summary}
          isMultiLine={true}
        />
      )}
      {description.isEditing && (
        <EditTextDialog
          open={description.isEditing}
          setOpen={(isOpen) => {
            dispatch({
              type: KeywordActionKind.HANDLE_DESCRIPTION_DIALOG,
              payload: { isOpen },
            });
          }}
          onSubmit={(_text) =>
            updateKeyword(description.target.id, {
              description: _text,
            })
          }
          title={'요약문 변경'}
          description={'요약문을 변경합니다.'}
          defaultText={description.target.description}
          isMultiLine={true}
        />
      )}
      {state.delete.isDeleting && (
        <Dialog
          aria-labelledby="ConfirmModal"
          open={state.delete.isDeleting}
          onClose={() =>
            dispatch({
              type: KeywordActionKind.CLOSE_DELETE_DIALOG,
            })
          }
        >
          <ConfirmModal
            title={
              state.delete.target.isDeleted
                ? '키워드 복구'
                : '키워드 삭제'
            }
            content={
              state.delete.target.isDeleted
                ? '해당 키워드를 복구하시겠습니까'
                : '해당 키워드를 삭제하시겠습니까'
            }
            confirmTitle={
              state.delete.target.isDeleted ? '복구' : '삭제'
            }
            type={state.delete.target.isDeleted ? 'CONFIRM' : 'ERROR'}
            handleOnClick={deleteKeyword}
            handleOnCancel={() => {
              dispatch({
                type: KeywordActionKind.CLOSE_DELETE_DIALOG,
              });
            }}
          />
        </Dialog>
      )}
    </>
  );
};

export default KeywordListPresenter;
