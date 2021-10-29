import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
  createFilterOptions,
  Button,
  Card,
  Divider,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  LinearProgress,
  IconButton,
  Dialog,
  Pagination,
} from '@material-ui/core';
import React from 'react';
import Scrollbar from '../../layout/Scrollbar';
import RefreshIcon from '@material-ui/icons/Refresh';
import BuildIcon from '@material-ui/icons/Build';
import SearchIcon from '../../../icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from 'src/components/widgets/Label';
import dayjs from 'dayjs';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import {
  CategoryListAction,
  CategoryListState,
  CategoryListActionKind,
} from './CategoryList.Container';
import { Category } from 'src/types/schedule';
import _ from 'lodash';
import CategoryEditDialogContainer from './CategoryEditDialog.Container';

interface CategoryListProps {
  categoryListState: CategoryListState;
  dispatch: (params: CategoryListAction) => void;
  category: string;
  categoryCreateRef: React.MutableRefObject<any>;
  handleCreateInput: _.DebouncedFunc<() => void>;
  categoryList: Category[];
  categoryListLoading: boolean;
  handleCreate: () => void;
  handleDelete: (category: Category) => void;
  handleUpdate: (id, body) => void;
  getList: () => void;
}

const customFilter = createFilterOptions<any>();

const CategoryListPresenter: React.FC<CategoryListProps> = (
  props,
) => {
  const {
    categoryListState,
    dispatch,
    category,
    categoryCreateRef,
    handleCreateInput,
    categoryList,
    categoryListLoading,
    handleCreate,
    handleDelete,
    handleUpdate,
    getList,
  } = props;
  const {
    categoryListLength,
    loading,
    openUpdate,
    openDeleteTag,
    targetCategory,
  } = categoryListState;
  return (
    <>
      <Box my={3}>
        <Typography color="textPrimary" variant="h6" sx={{ mb: 2 }}>
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
                dispatch({
                  type: CategoryListActionKind.CHANGE_NEW_CATEGORY,
                  payload: newValue,
                });
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
                        <CircularProgress color="inherit" size={20} />
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
                dispatch({
                  type: CategoryListActionKind.CHANGE_QUERY,
                  payload: e.target.value,
                });
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
                {categoryListState.categoryList &&
                  categoryListState.categoryList.map((category) => {
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
                              category.isDeleted ? 'error' : 'success'
                            }
                          >
                            {category.isDeleted ? '삭제' : '정상'}
                          </Label>{' '}
                        </TableCell>

                        <TableCell>
                          <IconButton
                            onClick={() => {
                              dispatch({
                                type: CategoryListActionKind.CHANGE_TARGET_CATEGORY,
                                payload: category,
                              });
                              dispatch({
                                type: CategoryListActionKind.CHANGE_OPEN_UPDATE,
                                payload: true,
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
                                type: CategoryListActionKind.CHANGE_TARGET_CATEGORY,
                                payload: category,
                              });
                              dispatch({
                                type: CategoryListActionKind.CHANGE_OPEN_DELETE,
                                payload: true,
                              });
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
        <Pagination
          variant="outlined"
          count={Math.ceil(categoryListLength / 20)}
          onChange={(event, page) => {
            dispatch({
              type: CategoryListActionKind.CHANGE_PAGE,
              payload: page,
            });
          }}
        />
      </Card>
      {/* Dialogs */}
      {openUpdate && (
        <CategoryEditDialogContainer
          open={openUpdate}
          setClose={() => {
            dispatch({
              type: CategoryListActionKind.CHANGE_OPEN_UPDATE,
              payload: true,
            });
            dispatch({
              type: CategoryListActionKind.CHANGE_TARGET_CATEGORY,
              payload: null,
            });
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
          onClose={() =>
            dispatch({
              type: CategoryListActionKind.CHANGE_OPEN_DELETE,
              payload: false,
            })
          }
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
            confirmTitle={targetCategory.isDeleted ? '복구' : '삭제'}
            type={targetCategory.isDeleted ? 'CONFIRM' : 'ERROR'}
            handleOnClick={() => handleDelete(targetCategory)}
            handleOnCancel={() => {
              dispatch({
                type: CategoryListActionKind.CHANGE_OPEN_DELETE,
                payload: false,
              });
              dispatch({
                type: CategoryListActionKind.CHANGE_TARGET_CATEGORY,
                payload: null,
              });
            }}
          />
        </Dialog>
      )}
    </>
  );
};

export default CategoryListPresenter;
