import React, { FC, useEffect } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  LinearProgress,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';

import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import WebEditor from 'src/components/common/WebEditor';

import { Stock, Tag } from 'src/types/schedule';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import {
  IHiddenReportForm,
  HiddenReportCreateAction,
  HiddenReportCreateActionKind,
  HiddenReportCreateState,
  HIDDENREPORT_CATEGORIES,
} from './HiddenreportCreate.Container';
import { DatePicker } from '@material-ui/lab';
import { IBuckets } from 'src/components/common/conf/aws';

interface IHRContentFormProps {
  mode: string;
  reportCreateState: HiddenReportCreateState;
  editorRef: React.MutableRefObject<any>;
  tagInput: React.MutableRefObject<any>;
  tagList: Tag[];
  tagLoading: boolean;
  stockList: Stock[];
  stockLoading: boolean;
  stockInput: React.MutableRefObject<any>;
  handleStockChange: _.DebouncedFunc<() => void>;
  handleTagChange: _.DebouncedFunc<() => void>;
  dispatch: (params: HiddenReportCreateAction) => void;
  onSubmitContentForm: (data, e) => void;
  onPDFChange: (event) => void;
  onTagChange: (event, tag: Tag[], reason, item) => void;
  onStockChange: (event, stock: Stock[], reason, item) => void;
}

const schema = yup
  .object()
  .shape({
    title: yup.string().required(),
    price: yup
      .number()
      .max(990)
      .min(0)
      .test('divided-by-5', 'invalid', (value) => value % 5 === 0)
      .required(),
    intro: yup.string().required(),
    catchphrase: yup.string().required(),
    summary: yup.string().required(),
    reason: yup.string().required(),
  })
  .required();

const HRContentForm: FC<IHRContentFormProps> = (props) => {
  const {
    mode,
    editorRef,
    onSubmitContentForm,
    reportCreateState,
    tagInput,
    tagList,
    tagLoading,
    stockList,
    stockInput,
    handleStockChange,
    handleTagChange,
    onPDFChange,
    onStockChange,
    onTagChange,
    dispatch,
  } = props;

  const {
    register,
    handleSubmit,

    reset,
    formState: { errors },
  } = useForm<IHiddenReportForm>({
    defaultValues: reportCreateState.newReport,
    resolver: yupResolver(schema),
  });
  const { newReport } = reportCreateState;

  useEffect(() => {
    if (mode === 'edit') {
      reset(newReport);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newReport.id, mode]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 6,
      }}
    >
      <Card sx={{ p: 3 }}>
        <form
          onSubmit={handleSubmit((d, e) => onSubmitContentForm(d, e))}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                제목
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                {...register('title')}
                error={Boolean(errors?.title)}
                helperText={'3글자 이상 입력하세요'}
                defaultValue={'asd'}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                작성 이유 (구매 후 노출)
              </Typography>
              <TextField
                fullWidth
                multiline
                error={Boolean(errors?.intro)}
                helperText={
                  '현 시점에 리포트를 작성한 계기나 배경, 이유 등을 쉽게 풀어 2줄 이내로 표현해 주세요.'
                }
                {...register('intro')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                주장 근거 (구매 후 노출)
              </Typography>
              <TextField
                fullWidth
                error={Boolean(errors?.reason)}
                helperText={'근거를 적어주세요.'}
                multiline
                {...register('reason')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                리포트 요약 (구매 전 노출)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                error={Boolean(errors?.summary)}
                helperText={'요약문 세가지를 적어주세요.'}
                placeholder={'-\n-\n-\n'}
                {...register('summary')}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                키워드
              </Typography>
              {tagLoading && <LinearProgress />}
              <Autocomplete
                multiple
                fullWidth
                autoHighlight
                options={tagList}
                value={newReport.tags}
                getOptionLabel={(option) => option.name}
                onChange={onTagChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    onChange={handleTagChange}
                    inputRef={tagInput}
                    name="keyword"
                    variant="outlined"
                    helperText={
                      '키워드는 최대 10개까지 등록이 가능합니다.'
                    }
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
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                종목
              </Typography>
              <Autocomplete
                multiple
                fullWidth
                autoHighlight
                options={stockList}
                value={newReport.stocks}
                getOptionLabel={(option) =>
                  option.name + `(${option.code})`
                }
                onChange={onStockChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    onChange={handleStockChange}
                    inputRef={stockInput}
                    helperText={
                      '종목은 최대 10개까지 등록이 가능합니다.'
                    }
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
            </Grid>
            <Grid item xs={12} lg={4}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                대상
              </Typography>

              <Select
                size="medium"
                variant="outlined"
                name="subject"
                value={reportCreateState.newReport.subject}
                {...register('subject')}
                fullWidth
                onChange={(e) => {
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_CATEGORY,
                    payload: {
                      value: e.target.value,
                      name: e.target.name,
                    },
                  });
                }}
              >
                {HIDDENREPORT_CATEGORIES.subject.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                유형
              </Typography>
              <Select
                size="medium"
                variant="outlined"
                name={'type'}
                value={reportCreateState.newReport.type}
                {...register('type')}
                fullWidth
                onChange={(e) => {
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_CATEGORY,
                    payload: {
                      value: e.target.value,
                      name: e.target.name,
                    },
                  });
                }}
              >
                {HIDDENREPORT_CATEGORIES.type.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                대응 전략
              </Typography>

              <Select
                size="medium"
                variant="outlined"
                name="counter"
                {...register('counter')}
                value={reportCreateState.newReport.counter}
                fullWidth
                onChange={(e) => {
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_CATEGORY,
                    payload: {
                      value: e.target.value,
                      name: e.target.name,
                    },
                  });
                }}
              >
                {HIDDENREPORT_CATEGORIES.counter.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} lg={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                캐치프레이즈
              </Typography>
              <TextField
                fullWidth
                helperText={'캐치프레이즈를 적어주세요.'}
                multiline
                error={Boolean(errors?.catchphrase)}
                {...register('catchphrase')}
              />
            </Grid>
            <Grid item xs={12} lg={2}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                가격
              </Typography>
              <TextField
                fullWidth
                disabled={mode === 'edit' ? true : false}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      GOLD
                    </InputAdornment>
                  ),
                }}
                helperText={
                  '5G 단위로 적어주세요. 설정한 가격은 변경이 불가능합니다. (최대 990G)'
                }
                error={Boolean(errors?.price)}
                {...register('price')}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                만료일
              </Typography>

              <DatePicker
                disablePast={false}
                value={newReport.expirationDate}
                onChange={(e) => {
                  dispatch({
                    type: HiddenReportCreateActionKind.CHANGE_EXPIRATION_DATE,
                    payload: e,
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                PDF 첨부
              </Typography>
              <input
                id="pdf"
                name="pdf"
                accept="*"
                type="file"
                onChange={onPDFChange}
              />

              {newReport.pdfUrl && (
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  sx={{ mt: 1 }}
                >
                  <a href={newReport.pdfUrl}>기존 파일 다운로드</a>
                </Typography>
              )}

              <Typography
                color="textSecondary"
                variant="subtitle2"
                sx={{ mt: 1 }}
              >
                파일 이름이 너무 길 경우 오류가 생길 수 있습니다.
                (15자 내외)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                본문
              </Typography>
              <Paper sx={{ mt: 3 }} variant="outlined">
                <WebEditor
                  editorRef={editorRef}
                  contents={newReport.contents}
                  bucket_name={IBuckets.HIDDENREPORT}
                />
              </Paper>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <Button
              color="primary"
              fullWidth
              size="large"
              variant="contained"
              type="submit"
            >
              완료
            </Button>
          </Box>
          <Typography
            align="center"
            color="textSecondary"
            sx={{ mt: 2 }}
            variant="body2"
          >
            By submitting this, you agree to the{' '}
            <Link
              color="textPrimary"
              href="#"
              underline="always"
              variant="subtitle2"
            >
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link
              color="textPrimary"
              href="#"
              underline="always"
              variant="subtitle2"
            >
              Cookie Policy
            </Link>
            .
          </Typography>
        </form>
      </Card>
    </Box>
  );
};

export default HRContentForm;
