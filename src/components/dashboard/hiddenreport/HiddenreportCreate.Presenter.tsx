import { Link as RouterLink } from 'react-router-dom';
import { FC, useRef } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  OutlinedInput,
  LinearProgress,
  Paper,
  TextField,
  InputAdornment,
  Typography,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/lab';

import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import WebEditor from 'src/components/common/WebEditor';

import { Stock, Tag } from 'src/types/schedule';
import { Formik } from 'formik';
import {
  HiddenReportCreateAction,
  HiddenReportCreateActionKind,
  HiddenReportCreateState,
} from './HiddenreportCreate.Container';
import toast from 'react-hot-toast';

interface IMasterContentFormProps {
  reportCreateState: HiddenReportCreateState;
  dispatch: (params: HiddenReportCreateAction) => void;
  editorRef: React.MutableRefObject<any>;
  handleSubmit: (event: any) => Promise<void>;

  tagInput: React.MutableRefObject<any>;
  tagList: Tag[];
  tagLoading: boolean;
  stockList: Stock[];
  stockLoading: boolean;
  stockInput: React.MutableRefObject<any>;
  handleStockChange: _.DebouncedFunc<() => void>;
  handleTagChange: _.DebouncedFunc<() => void>;
}
const HiddenREportCreatePresenter: FC<IMasterContentFormProps> = (
  props,
) => {
  const {
    editorRef,
    handleSubmit,
    reportCreateState,
    tagInput,
    tagList,
    tagLoading,
    stockList,
    stockLoading,
    stockInput,
    handleStockChange,
    handleTagChange,
    dispatch,
  } = props;
  console.log('123', reportCreateState);
  const { newReport, loading } = reportCreateState;
  const initialPrice = useRef(null);

  return (
    <Formik
      initialValues={{
        submit: null,
      }}
      onSubmit={() => {}}
    >
      {({ setFieldValue }): JSX.Element => (
        <form>
          <Card sx={{ p: 3 }}>
            <Typography color="textPrimary" variant="h6">
              피드 내용을 입력해주세요.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                helperText={'3글자 이상 입력하세요'}
                label="제목"
                name="title"
                onChange={(event) => {
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
                value={newReport?.title || ''}
                variant="outlined"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                inputRef={initialPrice}
                helperText={
                  '5 GOLD 단위로 입력해주세요 (e.g. 10G: 1000원)'
                }
                name="price"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      가격 (GOLD)
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
                onBlur={(event) => {
                  const value = parseInt(event.target.value, 10);
                  if (value % 5 !== 0) {
                    toast.error('5골드 단위로 입력해주세요');
                    return;
                  }
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
                value={newReport?.price || ''}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                helperText={'3글자 이상 입력하세요'}
                label="도입배경"
                name="intro"
                multiline
                onChange={(event) => {
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
                value={newReport?.intro || ''}
                variant="outlined"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                helperText={'3글자 이상 입력하세요'}
                multiline
                label="요점"
                name="summary"
                onChange={(event) => {
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
                value={newReport?.summary || ''}
                variant="outlined"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              {tagLoading && <LinearProgress />}
              <Autocomplete
                multiple
                fullWidth
                autoHighlight
                options={tagList}
                value={newReport.tags}
                getOptionLabel={(option) => option.name}
                onChange={(event, keywords: Tag[], reason, item) => {
                  if (reason === 'selectOption') {
                    const tags = [...newReport.tags, item.option];
                    dispatch({
                      type: HiddenReportCreateActionKind.CHANGE_TAGS,
                      payload: tags,
                    });

                    setFieldValue('tags', [
                      ...newReport.tags,
                      item.option,
                    ]);
                  }
                  if (reason === 'removeOption') {
                    const tags = newReport?.tags.filter(
                      //@ts-ignore
                      (tag) => tag.id !== item.option.id,
                    );
                    dispatch({
                      type: HiddenReportCreateActionKind.CHANGE_TAGS,
                      payload: tags,
                    });
                    setFieldValue('tags', tags);
                  }
                  if (reason === 'clear') {
                    dispatch({
                      type: HiddenReportCreateActionKind.CHANGE_TAGS,
                      payload: [],
                    });
                    setFieldValue('tags', []);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    onChange={handleTagChange}
                    inputRef={tagInput}
                    label="키워드"
                    name="keyword"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {tagLoading && (
                            <CircularProgress
                              color="inherit"
                              size={20}
                            />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              {console.log(newReport.stocks)}
              {stockLoading && <LinearProgress />}
              <Autocomplete
                multiple
                fullWidth
                autoHighlight
                options={stockList}
                value={newReport.stocks}
                getOptionLabel={(option) =>
                  option.name + `(${option.code})`
                }
                onChange={(
                  event,
                  keywords: Stock[],
                  reason,
                  item,
                ) => {
                  if (reason === 'selectOption') {
                    const stocks = [...newReport.stocks, item.option];
                    dispatch({
                      type: HiddenReportCreateActionKind.CHANGE_STOCKS,
                      payload: stocks,
                    });
                    setFieldValue('stocks', [
                      ...newReport.stocks,
                      item.option,
                    ]);
                  }
                  if (reason === 'removeOption') {
                    const stocks = newReport?.stocks.filter(
                      (stocks) => stocks.id !== item.option.id,
                    );
                    dispatch({
                      type: HiddenReportCreateActionKind.CHANGE_STOCKS,
                      payload: stocks,
                    });
                    setFieldValue('stocks', stocks);
                  }
                  if (reason === 'clear') {
                    dispatch({
                      type: HiddenReportCreateActionKind.CHANGE_STOCKS,
                      payload: [],
                    });
                    setFieldValue('stocks', []);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    onChange={handleStockChange}
                    inputRef={stockInput}
                    label="종목"
                    name="stocks"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {tagLoading && (
                            <CircularProgress
                              color="inherit"
                              size={20}
                            />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="만료일"
                value={newReport.expirationDate}
                onChange={(newValue) => {
                  console.log(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

            <Paper sx={{ mt: 3 }} variant="outlined">
              <WebEditor
                editorRef={editorRef}
                contents={newReport.contents}
              />
            </Paper>
            {/* <Box sx={{ mt: 2 }}>
                <FormHelperText error>
                  {FormHelperText}
                </FormHelperText>
              </Box> */}

            <Box
              sx={{
                display: 'flex',
                mt: 6,
              }}
            >
              <Button
                color="primary"
                size="large"
                variant="text"
                component={RouterLink}
                to={`/dashboard/master`}
              >
                이전
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
              >
                완료
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default HiddenREportCreatePresenter;
