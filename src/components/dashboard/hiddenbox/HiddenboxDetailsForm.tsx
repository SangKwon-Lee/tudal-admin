import { useRef, useCallback } from 'react';
import type { FC } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  FormHelperText,
  TextField,
  Typography,
  CircularProgress,
  LinearProgress,
  Autocomplete,
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/lab';
import { APIStock, APITag } from 'src/lib/api';
import useAsync from 'src/hooks/useAsync';
import { Tag } from 'src/types/schedule';
import * as _ from 'lodash';
import useAuth from 'src/hooks/useAuth';

interface HiddenboxDetailsProps {
  onBack?: () => void;
  onNext?: () => void;
  setValues?: (any) => void;
  values: any;
  mode: string;
}

type Stock = {
  stockcode: string;
  stockname: string;
};

const HiddenboxDetailsForm: FC<HiddenboxDetailsProps> = (props) => {
  const { onBack, onNext, setValues, values, mode, ...other } = props;
  const { user } = useAuth();
  const tagInput = useRef(null);
  const stockInput = useRef(null);

  const categoryOptions = {
    1: [
      { label: '베이직(5,900원)', value: 'hiddenbox_basic' },
      { label: '스탠다드(33,000원)', value: 'hiddenbox_standard' },
      { label: '프리미엄(115,000원)', value: 'hiddenbox_premium' },
    ],
    2: [
      { label: '베이직(5,900원)', value: 'hiddenbox_basic' },
      { label: '스탠다드(33,000원)', value: 'hiddenbox_standard' },
      { label: '프리미엄(115,000원)', value: 'hiddenbox_premium' },
    ],
    3: [
      { label: '베이직(5,900원)', value: 'hiddenbox_basic' },
      { label: '스탠다드(33,000원)', value: 'hiddenbox_standard' },
      { label: '프리미엄(115,000원)', value: 'hiddenbox_premium' },
    ],
  };

  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList(value);
  }, [tagInput]);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput.current], []);

  const handleTagChange = _.debounce(refetchTag, 300);

  const getStockListTest = useCallback(() => {
    const value = stockInput.current ? stockInput.current.value : '';
    return APIStock.getDetailList(value);
  }, [stockInput]);

  const [
    { data: stockListTest, loading: stockLoading },
    refetchStock,
  ] = useAsync<any>(getStockListTest, [stockInput.current], []);

  const handleStockChange = _.debounce(refetchStock, 300);

  // const fetchStockList = async () => {
  //   const response = await apiServer.get('/stocks/stkNmCd');
  //   if (response.status === 200) {
  //     console.log('stocklist', response.data);
  //   }
  // };

  // const isStock = (object: any): object is Stock => {
  //   return object && object.stockcode !== undefined;
  // };

  return (
    <Formik
      initialValues={{
        ...values,
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .min(3, '3글자 이상 입력해주세요.')
          .max(255)
          .required('필수 입력사항 입니다.'),
        description: Yup.string().max(1024),
        productId: Yup.string(),
        tags: Yup.array(),
        stocks: Yup.array(),
        startDate: Yup.date(),
        endDate: Yup.date(),
        publicDate: Yup.date(),
      })}
      onSubmit={async (
        values,
        { setErrors, setStatus, setSubmitting },
      ): Promise<void> => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          setValues({
            ...values,
            title: values.title,
            description: values.description,
            tags: values.tags,
            stocks: values.stocks,
            productId: values.productId,
            startDate: values.startDate,
            endDate: values.endDate,
            publicDate: values.publicDate,
          });

          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        touched,
        values,
      }): JSX.Element => (
        <form onSubmit={handleSubmit} {...other}>
          <Card sx={{ p: 3 }}>
            <Typography color="textPrimary" variant="h6">
              히든박스 생성
            </Typography>
            <Typography color="textSecondary" variant="body1">
              판매 시작일부터 고객에게 상품이 공개되며, 판매
              종료일까지 판매가 가능합니다. 그리고 공개일 이후부터
              구매하지 않은 모든 고객에게 해당 상품이 보여집니다.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(touched.title && errors.title)}
                fullWidth
                helperText={touched.title && errors.title}
                label="상품명"
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                value={values.title}
                variant="outlined"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(
                  touched.description && errors.description,
                )}
                fullWidth
                multiline
                helperText={touched.description && errors.description}
                label="상품요약"
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                variant="outlined"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                select
                fullWidth
                label="상품타입"
                name="productId"
                value={values.productId}
                SelectProps={{ native: true }}
                variant="outlined"
                onChange={handleChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                {categoryOptions[user.role.Lv].map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mt: 2 }}>
              {stockLoading && <LinearProgress />}
              <Autocomplete
                multiple
                fullWidth
                autoHighlight
                options={stockListTest}
                value={values.stocks}
                getOptionLabel={(option) =>
                  option.name + `(${option.code})`
                }
                onChange={(
                  event,
                  keywords: Stock[],
                  reason,
                  item,
                ) => {
                  console.log(values);
                  console.log(item);
                  if (reason === 'selectOption') {
                    setFieldValue('stocks', [
                      ...values.stocks,
                      item.option,
                    ]);
                  }
                  if (reason === 'removeOption') {
                    const stocks = values.stocks.filter(
                      (stocks) => stocks.id !== item.option.id,
                    );
                    setFieldValue('stocks', stocks);
                  }
                  if (reason === 'clear') {
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
                    helperText="신규 생성 권한은 관리자에게 문의 바랍니다."
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
              {tagLoading && <LinearProgress />}
              <Autocomplete
                multiple
                fullWidth
                autoHighlight
                options={tagList}
                value={values.tags}
                getOptionLabel={(option) => option.name}
                onChange={(event, keywords: Tag[], reason, item) => {
                  console.log(reason);
                  if (reason === 'selectOption') {
                    setFieldValue('tags', [
                      ...values.tags,
                      item.option,
                    ]);
                  }
                  if (reason === 'removeOption') {
                    const tags = values.tags.filter(
                      (tag) => tag.id !== item.option.id,
                    );
                    setFieldValue('tags', tags);
                  }
                  if (reason === 'clear') {
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
                    helperText="신규 생성 권한은 관리자에게 문의 바랍니다."
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
              {Boolean(touched.stocks && errors.stocks) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.stocks}
                  </FormHelperText>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  mt: 4,
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <DateTimePicker
                    label="판매 시작일"
                    onAccept={() => setFieldTouched('startDate')}
                    onChange={(date) =>
                      setFieldValue('startDate', date)
                    }
                    onClose={() => setFieldTouched('startDate')}
                    value={values.startDate}
                    disablePast={mode === 'edit' ? false : true}
                    renderInput={(props) => <TextField {...props} />}
                  />
                </Box>
                <Box sx={{ mr: 2 }}>
                  <DateTimePicker
                    label="판매 종료일"
                    onChange={(date) =>
                      setFieldValue('endDate', date)
                    }
                    onClose={() => setFieldTouched('endDate')}
                    value={values.endDate}
                    disablePast={mode === 'edit' ? false : true}
                    minDate={values.startDate}
                    renderInput={(props) => <TextField {...props} />}
                  />
                </Box>
                <Box sx={{ mr: 2 }}>
                  <DateTimePicker
                    label="공개일"
                    onAccept={() => setFieldTouched('publicDate')}
                    onChange={(date) =>
                      setFieldValue('publicDate', date)
                    }
                    onClose={() => setFieldTouched('publicDate')}
                    value={values.publicDate}
                    disablePast={mode === 'edit' ? false : true}
                    minDate={values.endDate}
                    renderInput={(props) => <TextField {...props} />}
                  />
                </Box>
              </Box>
              {Boolean(touched.startDate && errors.startDate) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.startDate}
                  </FormHelperText>
                </Box>
              )}
              {Boolean(touched.endDate && errors.endDate) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.endDate}
                  </FormHelperText>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                mt: 6,
              }}
            >
              {onBack && (
                <Button
                  color="primary"
                  onClick={onBack}
                  size="large"
                  variant="text"
                >
                  이전
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                다음
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default HiddenboxDetailsForm;
