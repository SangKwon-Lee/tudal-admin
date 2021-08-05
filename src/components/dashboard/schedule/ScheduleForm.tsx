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
import { createFilterOptions } from "@material-ui/lab/Autocomplete"

import AsyncCreatableSelect from "react-select/async-creatable"
import { Schedule, Priority, Stock, Tag, Category } from "src/types/schedule"
import axios, { apiServer } from "../../../lib/axios"
import CircularProgress from "@material-ui/core/CircularProgress"
import ConfirmModal from "src/components/widgets/modals/ConfirmModal"
import useAuth from "src/hooks/useAuth"

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

  const handleDate = (startDate, endDate): void =>
    setNewSchedule((prev) => ({
      ...prev,
      startDate,
      endDate,
    }))

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
  const handleTag = (keywords: Tag[]): void => {
    setNewSchedule((prev) => {
      return {
        ...prev,
        keywords,
      }
    })
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

    const response = await axios.post(`/schedules`, {
      title,
      comment,
      priority,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      author: user.id, // author.id,
      keywords: keywords.map((keyword) => keyword.id),
      stockCodes: stocks.map((stock) => stock.stockcode),
      categories: categories.map((category) => category.id),
    })

    if (response.status == 200) {
      reload()
      closeConfirmDialog()
      clearScheduleForm()
    }
  }

  const stockMap = useMemo(() => createStockNameMap(stockList), [stockList])

  const handleExtraction = (value: string) => {
    const tokens = value.trim().split("/s+/")
    for (let i = 0; i < tokens.length; i++) {
      // 먼저 token이 종목에 포함되어 있는지 확인
      if (stockMap[tokens[i]]) {
        addStock(stockMap[tokens[i]])
        tokens.splice(i, 1)
        continue
      }
    }
    const promises = tokens.map((token) => {
      return axios.get(`/tags-excluded?_where[name]=${token}`)
    })
    console.log("키워드 들어감", tokens)
    Promise.all(promises)
      .then((response) => {
        console.log("keywords autocomplete response", response)
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
      {console.log("##dayjs", newSchedule.startDate)}
      {console.log("##now", newSchedule.endDate)}
      {console.log("stock==>", newSchedule.stocks)}
      {console.log("keyword==>", newSchedule.keywords)}
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
              helperText="줄 바꾸기 ctrl(cmd) + enter"
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
              options={stockList}
              value={newSchedule.stocks}
              getOptionLabel={(option) => `${option.stockname}(${option.stockcode})`}
              getOptionSelected={(option, value) => option.stockcode === value.stockcode}
              onChange={(event, stocks: Stock[]) => {
                handleStock(stocks)
              }}
              fullWidth
              autoHighlight
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="종목 이름"
                  name="stocks"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              multiple
              options={tagList}
              value={newSchedule.keywords}
              getOptionLabel={(option) => `${option.name}`}
              getOptionSelected={(option, value) => option.id === value.id}
              onChange={(event, value: Tag[]) => {
                console.log("ONCHANGE", value)
                handleTag(value)
              }}
              fullWidth
              autoHighlight
              filterOptions={(options, params) => {
                const filtered = filter(options, params)

                // Suggest the creation of a new value
                if (params.inputValue !== "") {
                  filtered.push({
                    inputValue: params.inputValue,
                    title: `Add "${params.inputValue}"`,
                  })
                }

                return filtered
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={debounceOnChange}
                  fullWidth
                  label="태그 이름"
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
              options={categoryList}
              value={newSchedule.categories}
              getOptionLabel={(option) => `${option.name}`}
              getOptionSelected={(option, value) => option.id === value.id}
              onChange={(event, value: Category[]) => {
                handleCategory(value)
              }}
              fullWidth
              autoHighlight
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="카테고리 이름"
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
      {console.log(newSchedule.keywords)}
    </Box>
  )
}

export default ScheduleForm
