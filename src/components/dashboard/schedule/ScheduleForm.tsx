import React, { useState, useEffect, useCallback, useRef, useMemo, useReducer } from "react"
import qs from "qs"
import dayjs from "dayjs"
import { debounce } from "lodash"
import DateRangePicker from "src/components/widgets/inputs/DateRangePicker"
import PlusIcon from "src/icons/Plus"
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

import { Schedule, Priority, Stock, Tag, Category } from "src/types/schedule"
import axios, { apiServer } from "../../../lib/axios"
import CircularProgress from "@material-ui/core/CircularProgress"
import ConfirmModal from "src/components/widgets/modals/ConfirmModal"
import useAuth from "src/hooks/useAuth"
import { AxiosResponse } from "axios"
import { IRoleType } from "src/types/user"

const customFilter = createFilterOptions<any>()
const customFilter2 = createFilterOptions<any>()

interface scheduleFormProps {
  reload: () => void
}
const formatDate = (date): string => dayjs(date).format("YYYY-MM-DD")

const createStockNameMap = (stockList: Stock[]) => {
  let map = {}
  for (let stock of stockList) {
    map[stock.stockname] = stock
  }
  return map
}

interface newScheduleType {
  title: string
  comment: string
  startDate: string
  endDate: string
  categories: Category[]
  stocks: Stock[]
  keywords: Tag[]
  priority: Priority
}

const initialSchedule: newScheduleType = {
  title: "",
  comment: "",
  startDate: formatDate(dayjs()),
  endDate: formatDate(dayjs()),
  categories: [],
  stocks: [],
  keywords: [],
  priority: Priority.MIDDLE,
}

const ScheduleForm: React.FC<scheduleFormProps> = (props) => {
  const { reload } = props
  const [newSchedule, setNewSchedule] = useState<newScheduleType>(initialSchedule)
  const [stockList, setStockList] = useState<Stock[]>([])
  const [tagList, setTagList] = useState<Tag[]>([])
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [tagLoading, setTagLoading] = useState<boolean>(false)
  const [isConfirm, setIsConfirm] = useState<boolean>(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
  const { user } = useAuth()

  const tagInput = useRef(null)

  const fetchStockList = async () => {
    try {
      const response = await apiServer.get("/stocks/stkNmCd")
      if (response.status === 200) {
        setStockList(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCategoryList = async () => {
    const response = await axios.get(`/categories`)
    if (response.status === 200) {
      setCategoryList(response.data)
    }
  }

  const fetchTagList = async () => {
    setTagLoading(true)
    let q: any = { _limit: 30 }
    if (tagInput) {
      q._q = tagInput.current.value
    }
    const response = await axios.get(`/tags?` + qs.stringify(q))
    if (response.status === 200) {
      setTagList(response.data)
      setTagLoading(false)
      return response.data.map((el) => {
        return { label: el.name, value: el.id }
      })
    }
  }
  const debounceOnChange = useCallback(debounce(fetchTagList, 400), [])

  useEffect(() => {
    fetchStockList()
    fetchCategoryList()
    fetchTagList()
  }, [])

  useEffect(() => {
    if (isFormSubmitted) {
      handleSubmit()
    }
  }, [isFormSubmitted])

  const handleChange = (event): void => {
    const { name, value } = event.target
    setNewSchedule((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDate = (startDate, endDate): void => {
    setNewSchedule((prev) => {
      return { ...prev, startDate, endDate }
    })
  }

  const addStock = (stock: Stock): void => {
    setNewSchedule((prev) => {
      for (let element of prev.stocks) {
        if (stock.stockcode && stock.stockcode === element.stockcode) {
          return { ...prev }
        }
      }
      const stocks = [...prev.stocks, stock]
      return { ...prev, stocks }
    })
  }

  const addKeyword = (keyword: Tag): void => {
    setNewSchedule((prev) => {
      for (let element of prev.keywords) {
        if (element.id === keyword.id) {
          return { ...prev }
        }
      }
      const newKeywords = [...prev.keywords, keyword]
      return { ...prev, keywords: newKeywords }
    })
  }

  const handleStock = (stocks: Stock[]): void => {
    setNewSchedule((prev) => ({
      ...prev,
      stocks,
    }))
  }
  const handleCategory = (categories: Category[]): void => {
    setNewSchedule((prev) => ({
      ...prev,
      categories,
    }))
  }
  const handleKeyword = (event, newKeywords: Tag[]): void => {
    setNewSchedule((prev) => {
      return { ...prev, keywords: newKeywords }
    })
    console.log("AFTER CHANGE state.keyword", newSchedule.keywords)
  }

  const clearScheduleForm = (): void => setNewSchedule(initialSchedule)
  const closeConfirmDialog = (): void => {
    setIsFormSubmitted(false)
    setIsConfirm(false)
  }

  const handleSubmit = async () => {
    if (newSchedule.title.trim() === "") {
      alert("일정 제목을 등록해주세요")
      closeConfirmDialog()
      return
    }
    const { categories, endDate, startDate, priority, title, comment, keywords, stocks } =
      newSchedule

    const oldKeywords = keywords.filter((keyword) => !keyword.hasOwnProperty("isNew"))
    const newKeywords = keywords
      .filter((keyword) => keyword.hasOwnProperty("isNew"))
      .map((keyword) => axios.post("/tags", { name: keyword.name }))

    await Promise.all(newKeywords)
      .then((responses) => {
        responses.forEach((res) => oldKeywords.push(res.data))
      })
      .catch((e) => console.log(e))

    const oldCategories = categories.filter((category) => !category.hasOwnProperty("isNew"))
    const createNewCategories: Array<Promise<AxiosResponse<Category>>> = categories
      .filter((category) => category.hasOwnProperty("isNew"))
      .map((category) => axios.post<Category>("/categories", { name: category.name }))

    await Promise.all(createNewCategories)
      .then((responses) => {
        responses.forEach((res) => oldCategories.push(res.data))
      })
      .catch((e) => console.log(e))

    const response = await axios.post(`/schedules`, {
      title,
      comment,
      priority,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      author: user.id,
      keywords: oldKeywords.map((keyword) => keyword.id),
      stockCodes: stocks.map((stock) => stock.stockcode),
      categories: oldCategories.map((category) => category.id),
    })

    if (response.status == 200) {
      reload()
      closeConfirmDialog()
      clearScheduleForm()
    }
  }

  // stock
  const stockMap = useMemo(() => createStockNameMap(stockList), [stockList])

  const handleExtraction = (value: string) => {
    // const tokens = value.trim().split("[\\r\\n]+\\s")
    const tokens = value.replaceAll("\n", " ").split(" ")
    console.log("TOKENS", tokens)
    for (let i = 0; i < tokens.length; i++) {
      // 먼저 token이 종목에 포함되어 있는지 확인
      if (stockMap[tokens[i]]) {
        addStock(stockMap[tokens[i]])
        tokens.splice(i, 1)
        console.log("TOKENS after stock", tokens)
        continue
      }
    }
    const promises = tokens.map((token) => {
      return axios.get(`/tags-excluded?_where[name]=${token}`)
    })
    Promise.all(promises)
      .then((response) => {
        const filtered: Tag[] = response
          .filter((response) => response.data.length === 1)
          .map((response) => response.data[0])
        filtered.forEach((tag) => addKeyword(tag))
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
              value={newSchedule.title}
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleExtraction(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item md={8} xs={12}>
            <TextField
              fullWidth
              label="코멘트"
              name="comment"
              helperText="줄 바꾸기 shift + enter"
              value={newSchedule.comment}
              onBlur={(e) => handleExtraction(e.target.value)}
              onChange={(e) => handleChange(e)}
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
              value={newSchedule.stocks}
              getOptionLabel={(option) => `${option.stockname}(${option.stockcode})`}
              getOptionSelected={(option, value) => option.stockcode === value.stockcode}
              onChange={(event, stocks: Stock[]) => {
                handleStock(stocks)
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
              value={newSchedule.keywords}
              getOptionSelected={(option, value) => option.id === value.id}
              onChange={handleKeyword}
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
              value={newSchedule.categories}
              getOptionSelected={(option, value) => option.id === value.id}
              getOptionLabel={(option) => {
                const label = option.name
                if (option.hasOwnProperty("isNew")) {
                  return `+ '${label}'`
                }
                return label
              }}
              onChange={(event, value: Category[]) => {
                handleCategory(value)
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
          {console.log(user)}
          <Grid item md={3} xs={12}>
            <FormControl variant="filled" fullWidth>
              <InputLabel htmlFor="filled-age-native-simple">중요도</InputLabel>
              <Select
                name="priority"
                value={newSchedule.priority}
                fullWidth
                inputProps={{
                  name: "중요도",
                }}
                onChange={(e) => handleChange(e)}
              >
                <MenuItem value={Priority.LOW}>하</MenuItem>
                <MenuItem value={Priority.MIDDLE}>중</MenuItem>
                <MenuItem value={Priority.HIGH}>상</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <DateRangePicker
              startDate={newSchedule.startDate}
              endDate={newSchedule.endDate}
              handleChange={handleDate}
            />
          </Grid>
          <Grid padding={0} paddingLeft={3}>
            <Button
              color="primary"
              startIcon={<PlusIcon fontSize="small" />}
              sx={{ m: 1 }}
              variant="contained"
              onClick={() => setIsConfirm(true)}
            >
              일정 등록
            </Button>
          </Grid>
        </Grid>
        <Dialog aria-labelledby="ConfirmModal" open={isConfirm} onClose={() => setIsConfirm(false)}>
          <ConfirmModal
            title={"일정 추가"}
            content={"일정을 추가하시겠습니까?"}
            confirmTitle={"추가"}
            handleOnClick={() => setIsFormSubmitted(true)}
            handleOnCancel={() => setIsConfirm(false)}
          />
        </Dialog>
        <Box sx={{ mt: 2 }}></Box>
      </form>
    </Box>
  )
}

export default ScheduleForm
