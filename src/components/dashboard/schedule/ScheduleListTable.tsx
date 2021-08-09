import React, { ChangeEvent, useState } from "react"
import PropTypes from "prop-types"
import dayjs from "dayjs"
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  CircularProgress,
  Dialog,
} from "@material-ui/core"

import DeleteIcon from "@material-ui/icons/Delete"
import Label from "../../Label"
import SearchIcon from "../../../icons/Search"
import { Priority, Schedule } from "../../../types/schedule"
import ConfirmModal from "src/components/widgets/modals/ConfirmModal"

const getPriorityLabel = (priority) => {
  const scale =
    priority > Priority.MIDDLE ? "high" : priority === Priority.MIDDLE ? "middle" : "low"
  const map = {
    high: {
      color: "error",
      text: "HIGH",
    },
    middle: {
      color: "success",
      text: "MIDDLE",
    },
    low: {
      color: "warning",
      text: "LOW",
    },
  }
  const { text, color }: any = map[scale]

  return <Label color={color}>{text}</Label>
}

type Sort =
  | "updated_at|desc"
  | "updated_at|asc"
  | "startDate|desc"
  | "startDate|asc"
  | "author|desc"
  | "priority|desc"

interface SortOption {
  value: Sort
  label: string
}
const sortOptions: SortOption[] = [
  {
    label: "최신 등록순",
    value: "updated_at|desc",
  },
  {
    label: "오래된 등록순",
    value: "updated_at|asc",
  },
  {
    label: "시작일자 내림차순",
    value: "startDate|desc",
  },
  {
    label: "시작일자 오름차순",
    value: "startDate|asc",
  },
  {
    label: "작성자 내림차순",
    value: "author|desc",
  },
  {
    label: "중요도 내림차순",
    value: "priority|desc",
  },
]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

const getComparator = (order: "asc" | "desc", orderBy: string) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}
const applySort = (schedules: Schedule[], sort: Sort): Schedule[] => {
  const [orderBy, order] = sort.split("|") as [string, "asc" | "desc"]
  const comparator = getComparator(order, orderBy)
  const stabilizedThis = schedules.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    // @ts-ignore
    return a[1] - b[1]
  })
  // @ts-ignore
  return stabilizedThis.map((el) => el[0])
}

interface ScheduleListTableProps {
  schedules: Schedule[]
  search: string
  setSearch: (value) => void
  postDelete: (id: number) => void
  reload: () => void
}

const applyPagination = (schedules: Schedule[], page: number, limit: number): Schedule[] =>
  schedules.slice(page * limit, page * limit + limit)

const ScheduleListTable: React.FC<ScheduleListTableProps> = (props) => {
  const { schedules, postDelete, search, setSearch } = props
  const [page, setPage] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [sort, setSort] = useState<Sort>(sortOptions[0].value)
  const [targetSchedule, setTargetSchedule] = useState<Schedule>(null)
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState<boolean>(false)

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage)
  }

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10))
  }

  const handleSort = (event): void => {
    setSort(event.target.value)
  }
  const sortedSchedules = applySort(schedules, sort)
  const paginatedSchedule = applyPagination(sortedSchedules, page, limit)

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
      }}
    >
      <Card>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            m: -1,
            p: 2,
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: "100%",
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
              name={"_q"}
              placeholder="제목 또는 코멘트를 검색해주세요"
              onChange={(event) => setSearch(event.target.value)}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: "100%",
              width: 240,
            }}
          >
            <TextField
              fullWidth
              label="정렬"
              name="priority"
              select
              onChange={(event) => handleSort(event)}
              SelectProps={{ native: true }}
              variant="outlined"
            >
              {sortOptions.map((sort, i) => {
                return (
                  <option key={i} value={sort.value}>
                    {sort.label}
                  </option>
                )
              })}
            </TextField>
          </Box>
        </Box>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell width="20%">제목</TableCell>
                <TableCell width="30%">코멘트</TableCell>
                <TableCell width="10%">중요도</TableCell>
                <TableCell width="10%">작성자</TableCell>
                <TableCell width="15%">시작</TableCell>
                <TableCell width="15%">끝</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSchedule.map((schedule) => {
                const { comment, priority, author, startDate, endDate } = schedule
                return (
                  <TableRow hover key={schedule.id}>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" />
                    </TableCell>
                    <TableCell>
                      <Link color="textPrimary" underline="none" variant="subtitle2">
                        {schedule.title}
                      </Link>
                    </TableCell>
                    <TableCell>{comment}</TableCell>
                    <TableCell>{getPriorityLabel(priority)}</TableCell>
                    <TableCell>{author.username}</TableCell>
                    <TableCell>{`${dayjs(startDate).format("YYYY-MM-DD")}`}</TableCell>
                    <TableCell>{`${dayjs(endDate).format("YYYY-MM-DD")}`}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setTargetSchedule(schedule)
                          setIsOpenDeleteConfirm(true)
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={schedules.length} //TODO
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
        {targetSchedule && (
          <Dialog
            aria-labelledby="ConfirmModal"
            open={isOpenDeleteConfirm}
            onClose={() => setIsOpenDeleteConfirm(false)}
          >
            <ConfirmModal
              title={`${targetSchedule.title} 일정을 삭제하시겠습니까?`}
              content={`삭제하면 되돌리기 어렵습니다.`}
              confirmTitle={"네 삭제합니다."}
              handleOnClick={() => {
                postDelete(targetSchedule.id)
                setTargetSchedule(null)
              }}
              handleOnCancel={() => {
                setTargetSchedule(null)
                setIsOpenDeleteConfirm(false)
              }}
            />
          </Dialog>
        )}
      </Card>
    </Box>
  )
}

export default ScheduleListTable

ScheduleListTable.propTypes = {
  schedules: PropTypes.array.isRequired,
}
