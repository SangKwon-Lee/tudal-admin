import React, { ChangeEvent } from 'react';
import DateRangePicker from 'src/components/widgets/inputs/DateRangePicker';
import PlusIcon from 'src/icons/Plus';
import Cancel from '@material-ui/icons/Cancel';
import SaveAlt from '@material-ui/icons/SaveAlt';
import {
  Box,
  Button,
  Grid,
  Select,
  MenuItem,
  TextField,
  Dialog,
  InputLabel,
  FormControl,
  Autocomplete,
} from '@material-ui/core';

import { createFilterOptions } from '@material-ui/core/Autocomplete';
import {
  Priority,
  Stock,
  Tag,
  Category,
  Schedule,
} from 'src/types/schedule';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';

import { IRoleType } from 'src/types/user';
import {
  IScheduleDispatch,
  IScheduleFormState,
  ScheduleActionKind,
} from './ScheduleForm.Container';
import useAuth from 'src/hooks/useAuth';

const customFilter = createFilterOptions<any>();
const categoryFilter = createFilterOptions<any>();

interface scheduleFormProps {
  newScheduleForm: IScheduleFormState;
  dispatch: (param: IScheduleDispatch) => void;
  handleExtract: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  showConfirm: boolean;
  updateSchedule: () => void;
  createSchedule: () => void;

  stockList: Stock[];
  tagList: Tag[];
  tagLoading: boolean;
  categoryList: Category[];
  refetchTag: () => void;

  tagInput: React.RefObject<HTMLInputElement>;
  targetModify: Schedule;
  clearTargetModify: () => void;
}

const ScheduleFormPresenter: React.FC<scheduleFormProps> = (
  props,
) => {
  const {
    newScheduleForm,
    dispatch,
    handleExtract,
    refetchTag,
    stockList,
    tagList,
    categoryList,
    tagInput,
    targetModify,
    clearTargetModify,
    tagLoading,
    showConfirm,
    updateSchedule,
    createSchedule,
  } = props;

  const { user } = useAuth();

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        pt: 1,
        m: 3,
      }}
    >
      <form onSubmit={(event) => event.preventDefault()}>
        <Grid container spacing={3} alignItems="center">
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label="제목"
              name="title"
              required
              helperText=" "
              value={newScheduleForm.title}
              onChange={(event) =>
                dispatch({
                  type: ScheduleActionKind.HANDLE_CHANGES,
                  payload: event,
                })
              }
              onBlur={handleExtract}
              variant="outlined"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label="코멘트"
              name="comment"
              helperText="줄 바꾸기 enter"
              value={newScheduleForm.comment}
              onBlur={handleExtract}
              onChange={(event) =>
                dispatch({
                  type: ScheduleActionKind.HANDLE_CHANGES,
                  payload: event,
                })
              }
              variant="outlined"
              multiline
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              options={stockList}
              value={newScheduleForm.stocks}
              getOptionLabel={(option) =>
                `${option.name}(${option.code})`
              }
              onChange={(event, stocks: Stock[]) => {
                dispatch({
                  type: ScheduleActionKind.REPLACE_STOCK,
                  payload: stocks,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="종목"
                  name="stocks"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              options={tagList}
              value={newScheduleForm.keywords}
              onChange={(event, keywords: Tag[]) => {
                dispatch({
                  type: ScheduleActionKind.REPLACE_KEYWORD,
                  payload: keywords,
                });
              }}
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
                  onChange={refetchTag}
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
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              options={categoryList}
              value={newScheduleForm.categories}
              getOptionLabel={(option) => {
                const label = option.name;
                if (option.hasOwnProperty('isNew')) {
                  return `+ '${label}'`;
                }
                return label;
              }}
              onChange={(event, categories: Category[]) => {
                dispatch({
                  type: ScheduleActionKind.REPLACE_CATEGORY,
                  payload: categories,
                });
              }}
              filterOptions={(options, params) => {
                const filtered = categoryFilter(options, params);
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
                  fullWidth
                  label="카테고리"
                  name="category"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl variant="filled" fullWidth>
              <InputLabel htmlFor="filled-age-native-simple">
                중요도
              </InputLabel>
              <Select
                name="priority"
                value={newScheduleForm.priority}
                fullWidth
                inputProps={{
                  name: 'priority',
                }}
                onChange={(event) =>
                  dispatch({
                    type: ScheduleActionKind.HANDLE_CHANGES,
                    payload: event,
                  })
                }
              >
                <MenuItem value={Priority.LOW}>하</MenuItem>
                <MenuItem value={Priority.MIDDLE}>중</MenuItem>
                <MenuItem value={Priority.HIGH}>상</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={5} xs={12}>
            <DateRangePicker
              startDate={newScheduleForm.startDate}
              endDate={newScheduleForm.endDate}
              handleChange={(startDate, endDate) =>
                dispatch({
                  type: ScheduleActionKind.REPLACE_DATES,
                  payload: { startDate, endDate },
                })
              }
            />
          </Grid>
          <Grid padding={0} paddingLeft={3}>
            <Button
              color={targetModify ? 'secondary' : 'primary'}
              startIcon={
                targetModify ? (
                  <PlusIcon fontSize="small" />
                ) : (
                  <SaveAlt />
                )
              }
              sx={{ m: 1 }}
              variant="contained"
              onClick={() => {
                dispatch({
                  type: ScheduleActionKind.SHOW_CONFIRM,
                });
              }}
            >
              {targetModify ? '일정 수정' : '일정 등록'}
            </Button>
            {targetModify && (
              <Button
                color={'primary'}
                startIcon={<Cancel fontSize="small" />}
                sx={{ m: 1 }}
                variant="contained"
                onClick={() => {
                  dispatch({
                    type: ScheduleActionKind.CLEAR,
                  });
                  clearTargetModify();
                }}
              >
                수정 취소
              </Button>
            )}
          </Grid>
        </Grid>
        <Dialog
          aria-labelledby="ConfirmModal"
          open={showConfirm}
          onClose={() =>
            dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM })
          }
        >
          <ConfirmModal
            title={targetModify ? '일정 수정' : '일정 등록'}
            content={
              targetModify
                ? '일정을 수정하시겠습니까?'
                : '일정을 추가하시겠습니까?'
            }
            type={'CONFIRM'}
            confirmTitle={targetModify ? '수정' : '추가'}
            handleOnClick={() =>
              targetModify ? updateSchedule() : createSchedule()
            }
            handleOnCancel={() =>
              dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM })
            }
          />
        </Dialog>
        <Box sx={{ mt: 2 }}></Box>
      </form>
    </Box>
  );
};

export default ScheduleFormPresenter;
