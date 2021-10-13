import { Link as RouterLink } from 'react-router-dom';
import type { FC, FormEvent } from 'react';
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
import { AxiosError } from 'axios';
import { Channel, Master, Room } from 'src/types/expert';
import { Stock, Tag } from 'src/types/schedule';
import { Formik } from 'formik';

interface newState {
  newMaster: Master;
  loading: boolean;
  error: AxiosError<any> | boolean;
  isSubmitting: boolean;
  master_room: Room[];
  master_channels: Channel[];
}

interface IMasterContentFormProps {
  editorRef: React.MutableRefObject<any>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleChangeTitle: (e: any) => void;
  handleChangeRoom: (e: any) => void;
  handleChangeLink: (e: any) => void;
  handleChangeTags: (item) => void;
  isSubmitting: boolean;
  newState: newState;
  tagInput: React.MutableRefObject<any>;
  tagList: Tag[];
  tagLoading: boolean;
  stockList: Stock[];
  stockLoading: boolean;
  stockInput: React.MutableRefObject<any>;
  handleStockChange: _.DebouncedFunc<() => void>;
  handleTagChange: _.DebouncedFunc<() => void>;
  handleChangeStocks: (item) => void;
  handleChangeChannel: (e: any) => void;
}

const MasterContentFormPresenter: FC<IMasterContentFormProps> = (
  props,
) => {
  const {
    editorRef,
    handleSubmit,
    handleChangeTitle,
    isSubmitting,
    handleChangeRoom,
    handleChangeLink,
    newState,
    tagInput,
    handleChangeTags,
    tagList,
    tagLoading,
    stockList,
    stockLoading,
    stockInput,
    handleStockChange,
    handleTagChange,
    handleChangeChannel,
    handleChangeStocks,
  } = props;

  const { error, newMaster } = newState;

  return (
    <Formik
      initialValues={{
        submit: null,
      }}
      onSubmit={() => {}}
    >
      {({ setFieldValue }): JSX.Element => (
        <form onSubmit={handleSubmit}>
          <Card sx={{ p: 3 }}>
            <Typography color="textPrimary" variant="h6">
              달인 내용을 입력해주세요.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                helperText={'3글자 이상 입력하세요'}
                label="제목"
                name="title"
                onBlur={handleChangeTitle}
                onChange={handleChangeTitle}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                value={newMaster?.title || ''}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              {newState.master_channels.length > 0 ? (
                <TextField
                  select
                  fullWidth
                  label={'채널 선택'}
                  name="room"
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleChangeChannel}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                >
                  {newState?.master_channels.map((channel: any) => (
                    <option key={channel.name} value={channel.id}>
                      {channel.name}
                    </option>
                  ))}
                </TextField>
              ) : (
                '글을 작성하기 채널을 먼저 만들어주세요.'
              )}
            </Box>
            <Box sx={{ my: 2 }}>
              {newState.master_room.length > 0 ? (
                <TextField
                  select
                  fullWidth
                  label={'방 선택'}
                  name="room"
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleChangeRoom}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                >
                  {newState?.master_room.map((room: Room) => (
                    <option key={room.title} value={room.id}>
                      {room.title} ({room.openType})
                    </option>
                  ))}
                </TextField>
              ) : (
                '글을 작성하기 전 방을 먼저 생성해주세요.'
              )}
            </Box>
            <Box sx={{ mt: 2 }}>
              {tagLoading && <LinearProgress />}
              <Autocomplete
                multiple
                fullWidth
                // disabled={productStatus[0] === 'onSale'}
                autoHighlight
                options={tagList}
                value={newMaster.tags}
                getOptionLabel={(option) => option.name}
                onChange={(event, keywords: Tag[], reason, item) => {
                  if (reason === 'selectOption') {
                    const tags = [...newMaster.tags, item.option];
                    handleChangeTags(tags);
                    setFieldValue('tags', [
                      ...newMaster.tags,
                      item.option,
                    ]);
                  }
                  if (reason === 'removeOption') {
                    const tags = newMaster?.tags.filter(
                      //@ts-ignore
                      (tag) => tag.id !== item.option.id,
                    );
                    handleChangeTags(tags);
                    setFieldValue('tags', tags);
                  }
                  if (reason === 'clear') {
                    handleChangeTags([]);
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
                // disabled={productStatus[0] === 'onSale'}
                autoHighlight
                options={stockList}
                value={newMaster.stocks}
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
                    const stocks = [...newMaster.stocks, item.option];
                    handleChangeStocks(stocks);
                    setFieldValue('stocks', [
                      ...newMaster.stocks,
                      item.option,
                    ]);
                  }
                  if (reason === 'removeOption') {
                    const stocks = newMaster?.stocks.filter(
                      (stocks) => stocks.id !== item.option.id,
                    );
                    handleChangeStocks(stocks);
                    setFieldValue('stocks', stocks);
                  }
                  if (reason === 'clear') {
                    handleChangeStocks([]);
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
                helperText={'추가 링크가 있을시 입력해주세요.'}
                label="링크"
                name="link"
                onBlur={handleChangeLink}
                onChange={handleChangeLink}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                value={newMaster?.external_link || ''}
                variant="outlined"
              />
            </Box>
            <Paper sx={{ mt: 3 }} variant="outlined">
              <WebEditor
                editorRef={editorRef}
                contents={
                  newMaster?.contents
                    ? newMaster.contents
                    : newMaster.description
                }
              />
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
                disabled={isSubmitting}
                type="submit"
                variant="contained"
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

export default MasterContentFormPresenter;
