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

interface IKeywordListComponentProps {
  state: IKeywordListState;
  multiTagInputRef: React.RefObject<HTMLTextAreaElement>;
  keywordAutocomplete: object;

  dispatch: (params: IKeywordListDispatch) => void;
  postKeyword: () => void;
  postMultiKeywords: () => void;
  refetchKeywordAutocomplete: () => void;
}

const KeywordListComponent: React.FC<IKeywordListComponentProps> = (
  props,
) => {
  const {
    state,
    dispatch,
    postMultiKeywords,
    postKeyword,
    multiTagInputRef,
  } = props;
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
                      inputRef={tagCreateRef}
                      onChange={handleTagInput}
                      label="키워드 추가"
                      onKeyDown={(event) => {
                        if (event.code === 'ENTER') {
                          console.log('asdasd');
                        }
                      }}
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
                setSearch(e.target.value);
              }, 300)}
            />
          </Box>
          <TextField
            label="정렬"
            name="sort"
            select
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={handleSort}
            style={{ marginLeft: '5px', marginRight: '5px' }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          {filterOptions.map((filter, index) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filter.value}
                    color="primary"
                    name={filter.label}
                    onChange={() =>
                      handleFilter(index, !filter.value)
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
                    <>
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
                                setTarget(tag);
                                setOpenSummary(true);
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
                                setTarget(tag);
                                setOpenDescription(true);
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
                            title={tag.alias?.map((alias) => {
                              return (
                                <Chip
                                  color="primary"
                                  label={alias.aliasName}
                                  style={{ marginLeft: 3 }}
                                />
                              );
                            })}
                            placement="bottom"
                          >
                            <IconButton
                              onClick={() => {
                                setTarget(tag);
                                setOpenAlias(true);
                              }}
                            >
                              <AliasIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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
                    </>
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
    </>
  );
};

export default KeywordListComponent;
