import React from 'react';
import TextField from '@material-ui/core/TextField';
import DateRangePicker from '@material-ui/lab/DateRangePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Box from '@material-ui/core/Box';

interface BasicDateRangePickerProps {
  startDate: string;
  endDate: string;
  handleChange: (startDate, endDate) => void;
}

const BasicDateRangePicker: React.FC<BasicDateRangePickerProps> = (
  props,
) => {
  const { startDate, endDate, handleChange } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText="시작 날짜"
        endText="끝 날짜"
        value={[startDate, endDate]}
        //* 이대표님 요청사항. 경고 메시지가 console에 나와도 그대로 진행
        inputFormat={'yyyy-MM-dd'}
        onChange={(newValue) => {
          const [startDate, endDate] = newValue;
          handleChange(startDate, endDate);
        }}
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} fullWidth />
            <Box sx={{ mx: 2 }}> ~ </Box>
            <TextField {...endProps} fullWidth />
          </>
        )}
      />
    </LocalizationProvider>
  );
};

export default BasicDateRangePicker;
