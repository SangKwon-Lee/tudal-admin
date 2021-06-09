import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  Box,
  Button,
  Card,
  Chip,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
  Link,
  Switch,
} from '@material-ui/core';
import PlusIcon from '../../../icons/Plus';
import moment from 'moment';
import axios, { apiServer, cmsServer } from '../../../lib/axios';
import CheckIcon from '../../../icons/Check';
import { ReportStockItem } from './'
import { truncate } from 'fs/promises';

interface ReportMakerWizardProps {
  
}

type Stock = {
  stockcode: string;
  stockname: string;
}

const ReportMakerWizard: FC<ReportMakerWizardProps> = (props) => {
  const { ...other } = props;
  const [tag, setTag] = useState('');
  const [values, setValues] = useState<any>({
    tags: [],
    startDate: moment().subtract(60, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const [tagList, setTagList] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [options, setOptions] = useState({
    exactKeyword: true,
    showOnlyHaveNews: true,
  })

  useEffect(() => {
    console.log("TagList is changed", tagList)
    if( tagList.length > 0 ){
      setShowReport(true);
    } else {
      setShowReport(false);
    }
  }, [tagList]);

  const getKeywords = (tags) => {
    let keywords = '';
    tags.map(tag => keywords += `#${tag.name} `);
    return keywords;
  }

  const fetchTags = async (tags) => {
    return new Promise(async (resolve, reject) => {
      try{
        let newTagList = [];
        await Promise.all(tags.map(async (tag) => {
          const url = options.exactKeyword ? `/tags?name=${tag}` : `/tags?name_contains=${tag}`
          const response = await axios.get(url);
          if( response.status === 200 ){
            newTagList = newTagList.concat(response.data);
            console.log(response.data)
          }
        }));
        setTagList(newTagList);
        resolve(true);
      } catch(e) {
        reject(false);
      }
    });
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Formik
        initialValues={{
          ...values,
          submit: null
        }}
        validationSchema={
          Yup
            .object()
            .shape({
              // title: Yup
              //   .string()
              //   .min(3, '3글자 이상 입력해주세요.')
              //   .max(255)
              //   .required('필수 입력사항 입니다.'),
              tags: Yup.array(),
              startDate: Yup.date(),
              endDate: Yup.date(),
            })
        }
        onSubmit={async (values, {
          setErrors,
          setStatus,
          setSubmitting
        }): Promise<void> => {
          try {
            try{
              setTagList([]);
              if( values.tags && values.tags.length > 0 ){
                await fetchTags(values.tags)
                console.log("TagList", tagList)
              }
            } catch (error){
              console.log("fetch failed", error)
            }
            setStatus({ success: true });
            setSubmitting(false);
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
                리포트 생성
              </Typography>
              <Typography
                color="textSecondary"
                variant="body1"
              >
                Alpha Version. 날짜 및 태그 입력 후 생성을 하시면 됩니다.
              </Typography>
              {/* <Box sx={{ mt: 2 }}>
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
              </Box> */}
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
                    <KeyboardDatePicker
                      label="리포트 시작 날짜"
                      inputVariant="outlined"
                      onAccept={() => setFieldTouched('startDate')}
                      onChange={(date) => setFieldValue('startDate', date)}
                      onClose={() => setFieldTouched('startDate')}
                      value={values.startDate}
                      disablePast={false}
                      format="YYYY-MM-DD"
                    />
                  </Box>
                  <Box sx={{ mr: 2 }}>
                    <KeyboardDatePicker
                      label="리포트 종료 날짜"
                      inputVariant="outlined"
                      onAccept={() => setFieldTouched('endDate')}
                      onChange={(date) => setFieldValue('endDate', date)}
                      onClose={() => setFieldTouched('endDate')}
                      value={values.endDate}
                      disablePast={false}
                      minDate={values.startDate}
                      minDateMessage={'리포트 종료일은 시작일 이후여야 합니다.'}
                      format="YYYY-MM-DD"
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
              <Box sx={{ mt: 2 }}>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="subtitle2"
                >
                  일치하는 태그만 검색
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  이 옵션을 체크 해제하면, '윤석열' 검색시 '윤석열정책' 등도 포함하여 검색합니다.
                </Typography>
                <Switch
                  color="primary"
                  edge="start"
                  name="exactKeyword"
                  checked={options.exactKeyword}
                  onChange={() => {
                    setOptions(prev => ({
                      ...prev,
                      exactKeyword: !options.exactKeyword
                    }));
                  }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="subtitle2"
                >
                  기간 내에 기사 있는 종목만 표시
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  이 옵션을 체크 해제하면, 해당 기간 내에 기사가 없어도 종목은 표시가 됩니다.
                </Typography>
                <Switch
                  color="primary"
                  edge="start"
                  name="showOnlyHaveNews"
                  checked={options.showOnlyHaveNews}
                  onChange={() => {
                    setOptions(prev => ({
                      ...prev,
                      showOnlyHaveNews: !options.showOnlyHaveNews
                    }));
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  mt: 6
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  리포트 생성
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
      {showReport ? (
        <Card sx={{ mt: 3, p: 3 }}>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {'키워드'}
          </Typography>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            {getKeywords(tagList)}
          </Typography>
          {tagList.length > 0 && tagList.map(tag => {
            return (
              <Box key={'tagList' + tag.id} sx={{ mt: 3 }}>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  {tag.name}
                </Typography>
                {tag.stocks.map(stock => (
                  <ReportStockItem
                    key={`stockitem-${stock.code}`}
                    stock={stock}
                    startDate={values.startDate}
                    endDate={values.endDate}
                    showOnlyHaveNews={options.showOnlyHaveNews}
                  /> 
                ))}
              </Box>
            );
          })}
        </Card>
      ) : null }
    </Box>
  );
};

export default ReportMakerWizard;
