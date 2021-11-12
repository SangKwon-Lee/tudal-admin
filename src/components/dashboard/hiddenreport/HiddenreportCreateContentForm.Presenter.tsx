import { Link as RouterLink } from 'react-router-dom';
import React, { FC, useRef } from 'react';
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
  InputAdornment,
  Typography,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/lab';

import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import WebEditor from 'src/components/common/WebEditor';

import { Stock, Tag } from 'src/types/schedule';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import toast from 'react-hot-toast';

import {
  IHiddenReportForm,
  HiddenReportCreateAction,
  HiddenReportCreateState,
} from './HiddenreportCreate.Container';

interface IHRContentFormProps {
  reportCreateState: HiddenReportCreateState;
  dispatch: (params: HiddenReportCreateAction) => void;
  editorRef: React.MutableRefObject<any>;
  onSubmitContentForm: (data, e) => void;

  tagInput: React.MutableRefObject<any>;
  tagList: Tag[];
  tagLoading: boolean;
  stockList: Stock[];
  stockLoading: boolean;
  stockInput: React.MutableRefObject<any>;
  handleStockChange: _.DebouncedFunc<() => void>;
  handleTagChange: _.DebouncedFunc<() => void>;
  onPDFChange: (event) => void;
  onTagChange: (event, tag: Tag[], reason, item) => void;
  onStockChange: (event, stock: Stock[], reason, item) => void;
}
const schema = yup
  .object()
  .shape({
    title: yup.string().required(),
    // thumnail_text: yup.string().required(),
    // price: yup.number().required().max(9900),
    // category: yup.string().required(),
    // intro: yup.string().required(),
    // catchphrase: yup.string().required(),
    // summary: yup.string().required(),
    // reason: yup.string().required(),
  })
  .required();

const HRContentForm: FC<IHRContentFormProps> = (props) => {
  const {
    editorRef,
    onSubmitContentForm,
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
    onPDFChange,
    onStockChange,
    onTagChange,
  } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IHiddenReportForm>({
    defaultValues: reportCreateState.newReport,
    resolver: yupResolver(schema),
  });
  const { newReport, loading } = reportCreateState;

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
                helperText={'3글자 이상 입력하세요'}
                variant="outlined"
                {...register('title')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                도입배경
              </Typography>
              <TextField
                fullWidth
                helperText={
                  '현 시점에 리포트를 작성한 계기나 배경, 이유 등을 쉽게 풀어 2줄 이내로 표현해 주세요.'
                }
                multiline
                {...register('intro')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                요점
              </Typography>
              <TextField
                fullWidth
                placeholder={'-\n-\n-\n'}
                helperText={'요약문 세가지를 적어주세요.'}
                multiline
                {...register('summary')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                근거
              </Typography>
              <TextField
                fullWidth
                helperText={'근거를 적어주세요.'}
                multiline
                {...register('reason')}
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
            <Grid item xs={12} lg={6}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                variant="subtitle2"
              >
                PDF 첨부
              </Typography>
              <input
                id="image"
                name="image"
                accept="pdf/*"
                type="file"
                onChange={onPDFChange}
              />

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
