import React, { useEffect, useState } from "react"
import TextField from "@material-ui/core/TextField"
import DateRangePicker, { DateRange } from "@material-ui/lab/DateRangePicker"
import AdapterDateFns from "@material-ui/lab/AdapterDateFns"
import LocalizationProvider from "@material-ui/lab/LocalizationProvider"
import Box from "@material-ui/core/Box"
import dayjs from "dayjs"

interface BasicDateRangePickerProps {
  startDate: string
  endDate: string
  handleChange: (startDate, endDate) => void
}

const BasicDateRangePicker: React.FC<BasicDateRangePickerProps> = (props) => {
  const { startDate, endDate, handleChange } = props
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText="시작 날짜"
        endText="끝 날짜"
        value={[startDate, endDate]}
        onChange={(newValue) => {
          const [startDate, endDate] = newValue
          handleChange(startDate, endDate)
        }}
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> ~ </Box>
            <TextField {...endProps} />
          </>
        )}
      />
    </LocalizationProvider>
  )
}

export default BasicDateRangePicker
