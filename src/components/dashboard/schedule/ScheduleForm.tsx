import React, { useState, useEffect, useCallback, useRef, useMemo, useReducer } from "react"
import dayjs from "dayjs"
import { debounce } from "lodash"
import DateRangePicker from "src/components/widgets/inputs/DateRangePicker"
import PlusIcon from "src/icons/Plus"
import * as _ from "lodash"
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
} from "@material-ui/core"

import { createFilterOptions } from "@material-ui/core/Autocomplete"
import { Priority, Stock, Tag, Category } from "src/types/schedule"
import axios, { apiServer } from "../../../lib/axios"
import CircularProgress from "@material-ui/core/CircularProgress"
import ConfirmModal from "src/components/widgets/modals/ConfirmModal"
import useAuth from "src/hooks/useAuth"
import { IRoleType } from "src/types/user"
import useAsync from "src/hooks/useAsync"
import { APICategory, APISchedule, APIStock, APITag } from "src/lib/api"

const customFilter = createFilterOptions<any>()
const customFilter2 = createFilterOptions<any>()

const formatDate = (date): string => dayjs(date).format("YYYY-MM-DD")

const createStockNameMap = (stockList: Stock[]) => {
  let map = {}
  for (let stock of stockList) {
    map[stock.stockname] = stock
  }
  return map
}

interface scheduleFormProps {
  reload: () => void
}

export interface IScheduleFormState {
  title: string
  comment: string
  startDate: string
  endDate: string
  categories: Category[]
  stocks: Stock[]
  keywords: Tag[]
  priority: Priority
  showConfirm: boolean
  submitForm: boolean
}

const initialSchedule: IScheduleFormState = {
  title: "",
  comment: "",
  stocks: [],
  keywords: [],
  categories: [],
  priority: Priority.MIDDLE,
  startDate: formatDate(dayjs()),
  endDate: formatDate(dayjs()),

  showConfirm: false,
  submitForm: false,
}

enum ScheduleActionKind {
  CLEAR = "CLEAR",
  ADD_STOCK = "ADD_STOCK",
  ADD_KEYWORD = "ADD_KEYWORD",
  REPLACE_STOCK = "REPLACE_STOCK",
  REPLACE_KEYWORD = "REPLACE_KEYWORD",
  REPLACE_CATEGORY = "REPLACE_CATEGORY",
  REPLACE_DATES = "REPLACE_DATES",
  HANDLE_CHANGES = "HANDLE_CHANGES",

  SHOW_CONFIRM = "SHOW_CONFIRM",
  CLOSE_CONFIRM = "CLOSE_CONFIRM",
  SUBMIT = "SUBMIT",
}

interface ScheduleAction {
  type: ScheduleActionKind
  payload?: any
}

const scheduleFormReducer = (
  state: IScheduleFormState,
  action: ScheduleAction
): IScheduleFormState => {
  const { type, payload } = action

  switch (type) {
    case ScheduleActionKind.CLEAR:
      return initialSchedule

    case ScheduleActionKind.HANDLE_CHANGES:
      const { name, value } = payload.target
      return { ...state, [name]: value }

    case ScheduleActionKind.REPLACE_DATES:
      return { ...state, startDate: payload.startDate, endDate: payload.endDate }

    case ScheduleActionKind.ADD_STOCK:
      if (_.find(state.stocks, ["id", payload.id])) {
        return state
      }
      return { ...state, stocks: [...state.stocks, action.payload] }

    case ScheduleActionKind.REPLACE_STOCK:
      return { ...state, stocks: payload }

    case ScheduleActionKind.ADD_KEYWORD:
      if (_.find(state.keywords, ["id", payload.id])) {
        return state
      }
      return { ...state, keywords: [...state.keywords, action.payload] }

    case ScheduleActionKind.REPLACE_KEYWORD:
      return { ...state, keywords: payload }

    case ScheduleActionKind.REPLACE_CATEGORY:
      return { ...state, categories: payload }

    case ScheduleActionKind.SHOW_CONFIRM: {
      return { ...state, showConfirm: true }
    }

    case ScheduleActionKind.SHOW_CONFIRM: {
      return { ...state, showConfirm: true }
    }
    case ScheduleActionKind.CLOSE_CONFIRM: {
      return { ...state, showConfirm: false, submitForm: false }
    }

    case ScheduleActionKind.SUBMIT: {
      return { ...state, showConfirm: false, submitForm: true }
    }
  }
}

const ScheduleForm: React.FC<scheduleFormProps> = ({ reload }) => {
  const { user } = useAuth()
  const tagInput = useRef(null)

  const [newScheduleForm, dispatch] = useReducer(scheduleFormReducer, initialSchedule)
  const { showConfirm, submitForm } = newScheduleForm
  const [stockListState, refetchStock] = useAsync<Stock[]>(APIStock.getList, [], [])
  const [categoryListState, refetchCategory] = useAsync<Category[]>(APICategory.getList, [], [])
  const getTagList = () => APITag.getList(tagInput.current.value)
  const [tagListState, refetchTag] = useAsync<Tag[]>(getTagList, [tagInput.current], [])

  const { data: stockList, error: stockError, loading: stockLoading } = stockListState
  const { data: tagList, error: tagError, loading: tagLoading } = tagListState
  const { data: categoryList, error: categoryError, loading: categoryLoading } = categoryListState

  const debounceOnChange = debounce(refetchTag, 300)

  useEffect(() => {
    async function handleSubmit() {
      if (newScheduleForm.title.trim() === "") {
        alert("일정 제목을 등록해주세요")
        dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM })
        return
      }
      const { categories, endDate, startDate, priority, title, comment, keywords, stocks } =
        newScheduleForm

      const keywordCandidates = keywords
        .filter((keyword) => keyword.hasOwnProperty("isNew"))
        .map((keyword) => keyword.name)

      const newKeywords = await APITag.postItems(_.uniq(keywordCandidates))
      const keywordIDs = keywords
        .filter((keyword) => !keyword.hasOwnProperty("isNew"))
        .concat(newKeywords)
        .map((keyword) => keyword && keyword.id)

      const categoryCandidates = categories
        .filter((category) => category.hasOwnProperty("isNew"))
        .map((category) => category.name)

      const newCategories = await APICategory.postItems(_.uniq(categoryCandidates))
      const categoryIDs = categories
        .filter((category) => !category.hasOwnProperty("isNew"))
        .concat(newCategories)
        .map((category) => category && category.id)

      const stockCodes = stocks.map((stock) => stock.stockcode)

      await APISchedule.create({
        title,
        comment,
        stockCodes,
        author: user.id,
        keywords: keywordIDs,
        categories: categoryIDs,
        priority,
        startDate,
        endDate,
      })
        .then(({ status }) => {
          if (status == 200) {
            reload()
            dispatch({ type: ScheduleActionKind.CLEAR })
            dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    submitForm && handleSubmit()
  }, [submitForm, newScheduleForm])

  const stockMap = useCallback(() => createStockNameMap(stockListState.data), [stockList])

  const extractKeyword = (value: string) => {
    const tokens = value.replaceAll("\n", " ").split(" ")
    for (let i = 0; i < tokens.length; i++) {
      if (stockMap[tokens[i]]) {
        dispatch({ type: ScheduleActionKind.ADD_STOCK, payload: stockMap[tokens[i]] })
        tokens.splice(i, 1)
        continue
      }
    }
    const tagPromises = tokens.map((token) => {
      return axios.get(`/tags-excluded?_where[name]=${token}`)
    })
    Promise.all(tagPromises)
      .then((response) => {
        response
          .filter((response) => response.data.length === 1)
          .map((response) => response.data[0])
          .forEach((tag) => dispatch({ type: ScheduleActionKind.ADD_KEYWORD, payload: tag }))
      })
      .catch((e) => console.log(e))
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        pt: 1,
        m: 3,
      }}
    >
      <form onSubmit={(event) => event.preventDefault()}>
        <Grid container spacing={3} alignItems="center">
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label="제목"
              name="title"
              required
              helperText=" "
              value={newScheduleForm.title}
              onChange={(event) =>
                dispatch({ type: ScheduleActionKind.HANDLE_CHANGES, payload: event })
              }
              onBlur={(e) => extractKeyword(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item md={8} xs={12}>
            <TextField
              fullWidth
              label="코멘트"
              name="comment"
              helperText="줄 바꾸기 shift + enter"
              value={newScheduleForm.comment}
              onBlur={(e) => extractKeyword(e.target.value)}
              onChange={(event) =>
                dispatch({ type: ScheduleActionKind.HANDLE_CHANGES, payload: event })
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
              getOptionLabel={(option) => `${option.stockname}(${option.stockcode})`}
              getOptionSelected={(option, value) => option.stockcode === value.stockcode}
              onChange={(event, stocks: Stock[]) => {
                dispatch({ type: ScheduleActionKind.REPLACE_STOCK, payload: stocks })
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth label="종목" name="stocks" variant="outlined" />
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
              getOptionSelected={(option, value) => option.id === value.id}
              onChange={(event, keywords: Tag[]) => {
                dispatch({ type: ScheduleActionKind.REPLACE_KEYWORD, payload: keywords })
              }}
              getOptionLabel={(option) => {
                const label = option.name
                if (option.hasOwnProperty("isNew")) {
                  return `+ '${label}'`
                }
                return label
              }}
              filterOptions={(options, params) => {
                const filtered = customFilter(options, params)
                if (
                  user.role.type !== IRoleType.Author &&
                  filtered.length === 0 &&
                  params.inputValue !== ""
                ) {
                  filtered.push({
                    id: Math.random(),
                    isNew: true,
                    name: params.inputValue,
                  })
                }

                return filtered
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={debounceOnChange}
                  fullWidth
                  label="키워드"
                  name="keyword"
                  variant="outlined"
                  inputRef={tagInput}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {tagLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
              getOptionSelected={(option, value) => option.id === value.id}
              getOptionLabel={(option) => {
                const label = option.name
                if (option.hasOwnProperty("isNew")) {
                  return `+ '${label}'`
                }
                return label
              }}
              onChange={(event, categories: Category[]) => {
                dispatch({ type: ScheduleActionKind.REPLACE_CATEGORY, payload: categories })
              }}
              filterOptions={(options, params) => {
                const filtered = customFilter2(options, params)
                console.log(filtered, params)
                if (
                  user.role.type !== IRoleType.Author &&
                  filtered.length === 0 &&
                  params.inputValue !== ""
                ) {
                  filtered.push({
                    id: Math.random(),
                    isNew: true,
                    name: params.inputValue,
                  })
                }

                return filtered
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
              <InputLabel htmlFor="filled-age-native-simple">중요도</InputLabel>
              <Select
                name="priority"
                value={newScheduleForm.priority}
                fullWidth
                inputProps={{
                  name: "중요도",
                }}
                onChange={(event) =>
                  dispatch({ type: ScheduleActionKind.HANDLE_CHANGES, payload: event })
                }
              >
                <MenuItem value={Priority.LOW}>하</MenuItem>
                <MenuItem value={Priority.MIDDLE}>중</MenuItem>
                <MenuItem value={Priority.HIGH}>상</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
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
              color="primary"
              startIcon={<PlusIcon fontSize="small" />}
              sx={{ m: 1 }}
              variant="contained"
              onClick={() => dispatch({ type: ScheduleActionKind.SHOW_CONFIRM })}
            >
              일정 등록
            </Button>
          </Grid>
        </Grid>
        <Dialog
          aria-labelledby="ConfirmModal"
          open={showConfirm}
          onClose={() => dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM })}
        >
          <ConfirmModal
            title={"일정 추가"}
            content={"일정을 추가하시겠습니까?"}
            confirmTitle={"추가"}
            handleOnClick={() => dispatch({ type: ScheduleActionKind.SUBMIT })}
            handleOnCancel={() => dispatch({ type: ScheduleActionKind.CLOSE_CONFIRM })}
          />
        </Dialog>
        <Box sx={{ mt: 2 }}></Box>
      </form>
    </Box>
  )
}

export default React.memo(ScheduleForm)
