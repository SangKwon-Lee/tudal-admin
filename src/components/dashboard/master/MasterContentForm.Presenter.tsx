import { Link as RouterLink } from 'react-router-dom';
import type { FC } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  FormHelperText,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import WebEditor from 'src/components/common/WebEditor';
import { IMaster, IMasterRoom } from 'src/types/master';
import { Stock, Tag } from 'src/types/schedule';
import { Formik } from 'formik';
import {
  MasterContentFormAction,
  MasterContentFormActionKind,
  MasterContentFormState,
} from './MasterContentForm.Container';
import useAuth from 'src/hooks/useAuth';
import { IBuckets } from 'src/components/common/conf/aws';
import * as _ from 'lodash';

interface IMasterContentFormProps {
  editorRef: React.MutableRefObject<any>;
  handleSubmit: (event: any) => Promise<void>;
  isSubmitting: boolean;
  masterContentFormState: MasterContentFormState;
  tagInput: React.MutableRefObject<any>;
  tagList: Tag[];
  tagLoading: boolean;
  stockList: Stock[];
  stockLoading: boolean;
  stockInput: React.MutableRefObject<any>;
  handleStockChange: _.DebouncedFunc<() => void>;
  handleTagChange: _.DebouncedFunc<() => void>;
  handleSubmitError: (e: any) => void;
  handleChangeMaster: (e: any) => void;
  dispatch: (params: MasterContentFormAction) => void;
}
const MasterContentFormPresenter: FC<IMasterContentFormProps> = (
  props,
) => {
  const {
    editorRef,
    handleSubmit,
    isSubmitting,
    masterContentFormState,
    tagInput,
    tagList,
    tagLoading,
    stockList,
    stockLoading,
    stockInput,
    handleStockChange,
    handleTagChange,
    handleChangeMaster,
    handleSubmitError,
    dispatch,
  } = props;

  const {
    error,
    newFeed,
    masters,
    master_room,
    submitError,
    isHasRoom,
  } = masterContentFormState;
  const { user } = useAuth();

  return (
    <>
      {!_.isEmpty(user?.masters) ? (
        <Formik
          initialValues={{
            submit: null,
          }}
          onSubmit={() => {}}
        >
          {({ setFieldValue }): JSX.Element => (
            <form>
              <Card sx={{ p: 3, my: 4, mx: 10 }}>
                {!isHasRoom ? (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        helperText={'3글자 이상 입력하세요'}
                        label="제목"
                        name="title"
                        onChange={(event) => {
                          dispatch({
                            type: MasterContentFormActionKind.CHANGE_INPUT,
                            payload: event,
                          });
                        }}
                        value={newFeed?.title || ''}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ my: 2 }}>
                      {masters.length > 0 && (
                        <TextField
                          select
                          fullWidth
                          label={'달인 선택'}
                          name="master"
                          SelectProps={{ native: true }}
                          variant="outlined"
                          onChange={handleChangeMaster}
                        >
                          {masters.map((master: IMaster, i) => (
                            <option key={i} value={master.id}>
                              {master.nickname}
                            </option>
                          ))}
                        </TextField>
                      )}
                    </Box>
                    <Box sx={{ my: 2 }}>
                      {master_room.length > 0 && (
                        <TextField
                          select
                          fullWidth
                          label={'방 선택'}
                          name="master_room"
                          SelectProps={{ native: true }}
                          variant="outlined"
                          onChange={(event) => {
                            dispatch({
                              type: MasterContentFormActionKind.CHANGE_INPUT,
                              payload: event,
                            });
                          }}
                        >
                          {master_room.map((room: IMasterRoom, i) => (
                            <option key={i} value={room.id}>
                              {room.title} ({room.type})
                            </option>
                          ))}
                        </TextField>
                      )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      {tagLoading && <LinearProgress />}
                      <Autocomplete
                        multiple
                        fullWidth
                        autoHighlight
                        options={tagList}
                        value={newFeed.tags}
                        getOptionLabel={(option) => option.name}
                        onChange={(
                          event,
                          keywords: Tag[],
                          reason,
                          item,
                        ) => {
                          if (reason === 'selectOption') {
                            const tags = [
                              ...newFeed.tags,
                              item.option,
                            ];
                            dispatch({
                              type: MasterContentFormActionKind.CHANGE_TAGS,
                              payload: tags,
                            });

                            setFieldValue('tags', [
                              ...newFeed.tags,
                              item.option,
                            ]);
                          }
                          if (reason === 'removeOption') {
                            const tags = newFeed?.tags.filter(
                              //@ts-ignore
                              (tag) => tag.id !== item.option.id,
                            );
                            dispatch({
                              type: MasterContentFormActionKind.CHANGE_TAGS,
                              payload: tags,
                            });
                            setFieldValue('tags', tags);
                          }
                          if (reason === 'clear') {
                            dispatch({
                              type: MasterContentFormActionKind.CHANGE_TAGS,
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
                      {stockLoading && <LinearProgress />}
                      <Autocomplete
                        multiple
                        fullWidth
                        autoHighlight
                        options={stockList}
                        value={newFeed.stocks}
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
                            const stocks = [
                              ...newFeed.stocks,
                              item.option,
                            ];
                            dispatch({
                              type: MasterContentFormActionKind.CHANGE_STOCKS,
                              payload: stocks,
                            });
                            setFieldValue('stocks', [
                              ...newFeed.stocks,
                              item.option,
                            ]);
                          }
                          if (reason === 'removeOption') {
                            const stocks = newFeed?.stocks.filter(
                              (stocks) =>
                                stocks.id !== item.option.id,
                            );
                            dispatch({
                              type: MasterContentFormActionKind.CHANGE_STOCKS,
                              payload: stocks,
                            });
                            setFieldValue('stocks', stocks);
                          }
                          if (reason === 'clear') {
                            dispatch({
                              type: MasterContentFormActionKind.CHANGE_STOCKS,
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
                      <TextField
                        fullWidth
                        helperText={
                          '추가 링크가 있을시 입력해주세요. 입력시 http 혹은 https까지 입력해주세요.'
                        }
                        error={submitError ? true : false}
                        label="링크"
                        name="url"
                        onBlur={handleSubmitError}
                        onChange={handleSubmitError}
                        value={newFeed?.url || ''}
                        variant="outlined"
                      />
                    </Box>
                    <Paper sx={{ mt: 3 }} variant="outlined">
                      <WebEditor
                        editorRef={editorRef}
                        bucket_name={IBuckets.MASTER_FEED}
                        contents={
                          newFeed.description
                            ? newFeed.description
                            : ''
                        }
                      />
                      )
                    </Paper>
                    {error && (
                      <Box sx={{ mt: 2 }}>
                        <FormHelperText error>
                          {FormHelperText}
                        </FormHelperText>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        mt: 6,
                      }}
                    >
                      <Button
                        color="secondary"
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
                        disabled={isSubmitting}
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        완료
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography>방을 먼저 생성해주세요.</Typography>
                    <Button
                      sx={{ my: 4 }}
                      variant="contained"
                      component={RouterLink}
                      to={`/dashboard/master/room`}
                    >
                      방 생성 하러 가기
                    </Button>
                  </Box>
                )}
              </Card>
            </form>
          )}
        </Formik>
      ) : (
        <Typography variant="subtitle2" fontSize="20px" sx={{ m: 4 }}>
          계정을 생성해주세요.
        </Typography>
      )}
    </>
  );
};

export default MasterContentFormPresenter;
