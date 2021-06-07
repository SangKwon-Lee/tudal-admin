import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import {
  Box,
  Button,
  Card,
  Chip,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
  Autocomplete
} from '@material-ui/core';
import PlusIcon from '../../../icons/Plus';
import moment from 'moment';
import type { Hiddenbox } from '../../../types/hiddenbox';
import { apiServer } from '../../../lib/axios';
import { ChangeCircleRounded } from '@material-ui/icons';

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
}

const HiddenboxDetailsForm: FC<HiddenboxDetailsProps> = (props) => {
  const { onBack, onNext, setValues, values, mode, ...other } = props;
  const [tag, setTag] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [stockList, setStockList] = useState<any[]>([]);
  const stockInput = useRef(null);
  const [valueForClear, setValueForClear] = useState('');
 
  const categoryOptions = [
    { label: '베이직(5,900원)', value: 'hiddenbox_basic' },
    { label: '스탠다드(33,000원)', value: 'hiddenbox_standard' },
    { label: '프리미엄(115,000원)', value: 'hiddenbox_premium' }
  ];

  useEffect(() => {
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    const response = await apiServer.get('/stocks/stkNmCd');
    if( response.status === 200 ){
      setStockList(response.data);
      console.log("stocklist", response.data)
    }
  }

  const isStock = (object: any): object is Stock => {
    return object && object.stockcode !== undefined;
  }

  return (
    <Formik
      initialValues={{
        ...values,
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            title: Yup
              .string()
              .min(3, '3글자 이상 입력해주세요.')
              .max(255)
              .required('필수 입력사항 입니다.'),
            description: Yup
              .string()
              .max(1024),
            productId: Yup.string(),
            tags: Yup.array(),
            stocks: Yup.array(),
            startDate: Yup.date(),
            endDate: Yup.date(),
            publicDate: Yup.date()
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
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
            publicDate: values.publicDate
          })

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
        values
      }): JSX.Element => (
        <form
          onSubmit={handleSubmit}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          {...other}
        >
          <Card sx={{ p: 3 }}>
            <Typography
              color="textPrimary"
              variant="h6"
            >
              히든박스 생성
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              판매 시작일부터 고객에게 상품이 공개되며, 판매 종료일까지 판매가 가능합니다.
              그리고 공개일 이후부터 구매하지 않은 모든 고객에게 해당 상품이 보여집니다.
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
                value={values.title}
                variant="outlined"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(touched.description && errors.description)}
                fullWidth
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
                fullWidth
                label="상품타입"
                name="productId"
                value={values.productId}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                onChange={handleChange}
              >
                {categoryOptions.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
                <TextField
                  fullWidth
                  label="태그"
                  name="tags"
                  onChange={(event): void => {
                    const val = (event.target.value || '').replace(/\s+/gi, '');
                    setTag(val)
                  }}
                  onKeyPress={(e): void => {
                    if (!tag || e.key !== 'Enter' ) {
                      return;
                    }

                    if( values.tags.find(element => element === tag) ){
                      return;
                    }

                    setFieldValue('tags', [
                      ...values.tags,
                      tag
                    ]);
                    setTag('');
                  }}
                  value={tag}
                  variant="outlined"
                />
                <IconButton
                  sx={{ ml: 2 }}
                  onClick={(): void => {
                    if (!tag) {
                      return;
                    }

                    if( values.tags.find(element => element === tag) ){
                      return;
                    }

                    setFieldValue('tags', [
                      ...values.tags,
                      tag
                    ]);
                    setTag('');
                  }}
                >
                  <PlusIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                {values.tags.map((_tag, i) => (
                  <Chip
                    onDelete={(): void => {
                      const newTags = values.tags.filter((t) => t !== _tag);

                      setFieldValue('tags', newTags);
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    label={_tag}
                    sx={{
                      '& + &': {
                        ml: 1
                      }
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
              {Boolean(touched.tags && errors.tags) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.tags}
                  </FormHelperText>
                </Box>
              )}
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
                <Autocomplete
                  options={stockList}
                  getOptionLabel={(option) => `${option.stockname}(${option.stockcode})`}
                  getOptionSelected={(option, value) => option.stockcode === value.stockcode}
                  onChange={(event, value:Stock ) => {
                    if( isStock(value) && value.stockcode ){
                      setStock(value.stockcode);
                    }
                  }}
                  fullWidth
                  autoHighlight
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      fullWidth
                      label="종목코드"
                      name="stocks"
                      onChange={(event): void => {
                        const val = (event.target.value || '').replace(/\s+/gi, '');
                        setStock(val)
                      }}
                      onKeyPress={(e): void => {
                        if (!stock || e.key !== 'Enter' ) {
                          return;
                        }
                        if( values.stocks.find(element => element === stock) ){
                          return;
                        }
    
                        setFieldValue('stocks', [
                          ...values.stocks,
                          stock
                        ]);
                        setStock('');
                      }}
                      value={stock}
                      variant="outlined"
                    />
                  }
                />
                <IconButton
                  sx={{ ml: 2 }}
                  onClick={(): void => {
                    if (!stock) {
                      return;
                    }
                    if( values.stocks.find(element => element === stock) ){
                      return;
                    }

                    setFieldValue('stocks', [
                      ...values.stocks,
                      stock
                    ]);
                    setStock('');
                  }}
                >
                  <PlusIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                {values.stocks.map((_stock, i) => (
                  <Chip
                    onDelete={(): void => {
                      const newStocks = values.stocks.filter((t) => t !== _stock);

                      setFieldValue('stocks', newStocks);
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    label={_stock}
                    sx={{
                      '& + &': {
                        ml: 1
                      }
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
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
                  mt: 4
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <KeyboardDateTimePicker
                    label="판매 시작일"
                    inputVariant="outlined"
                    onAccept={() => setFieldTouched('startDate')}
                    onChange={(date) => setFieldValue('startDate', date)}
                    onClose={() => setFieldTouched('startDate')}
                    value={values.startDate}
                    disablePast={mode === 'edit' ? false : true}
                    format="YYYY-MM-DD HH:mm"
                    minDateMessage={'판매 시작일은 현재 시간 이후여야 합니다.'}
                  />
                </Box>
                <Box sx={{ mr: 2 }}>
                  <KeyboardDateTimePicker
                    label="판매 종료일"
                    inputVariant="outlined"
                    onAccept={() => setFieldTouched('endDate')}
                    onChange={(date) => setFieldValue('endDate', date)}
                    onClose={() => setFieldTouched('endDate')}
                    value={values.endDate}
                    disablePast={mode === 'edit' ? false : true}
                    minDate={values.startDate}
                    minDateMessage={'판매 종료일은 시작일 이후여야 합니다.'}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Box>
                <Box sx={{ mr: 2 }}>
                  <KeyboardDateTimePicker
                    label="공개일"
                    inputVariant="outlined"
                    onAccept={() => setFieldTouched('publicDate')}
                    onChange={(date) => setFieldValue('publicDate', date)}
                    onClose={() => setFieldTouched('publicDate')}
                    value={values.publicDate}
                    disablePast={mode === 'edit' ? false : true}
                    minDate={values.endDate}
                    minDateMessage={'공개일은 판매 종료일 이후여야 합니다.'}
                    format="YYYY-MM-DD HH:mm"
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
                mt: 6
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
