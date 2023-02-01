import styled from '@emotion/styled';
import {
  Box,
  Tab,
  Tabs,
  useTheme,
  InputAdornment,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Dialog,
} from '@material-ui/core';
import {
  ListItemButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import SearchIcon from 'src/icons/Search';
import {
  HankyungList,
  HankyungStocks,
  TripleA,
} from 'src/types/hankyung';
import { Stock } from 'src/types/schedule';
import { priceToString } from 'src/utils/priceToString';
import HankyungTripleAList from './HankyungTripleAList';
interface Props {
  stocks: any;
  tabValue: number;
  stockList: any;
  category: string;
  handleCategory: (e: any) => void;
  handleTab: (e: any, c: any) => void;
  onStockChange: (event, stock: Stock[], reason, item) => void;
  stockInput: React.MutableRefObject<any>;
  stockLoading: boolean;
  handleStockChange: _.DebouncedFunc<() => void>;
  tripleA: TripleA[];
  input: {
    id: any;
    title: string;
    comment: string;
  };
  stocksInput: any[];
  handleStocksInput: (e: any, stockcode: string) => void;
  handleInput: (e: any) => void;
  postOpeningTrading: () => Promise<void>;
  list: HankyungList[];
  getListInfo: (id: any, category: any) => Promise<void>;
  mode: string;
  editOpeningTrading: () => Promise<void>;
  handleQuery: (e: any) => void;
  handleReset: () => void;
  onDragEnd: any;
  handleAddDndStocks: (e: any) => void;
  dndStocks: any;
  handleRemoveDndStocks: (e: any) => void;
  handleDndStockInput: (e: any, stockcode: string) => void;
  realTiemStocks: any;
  sort: string;
  handleSort: (e: any) => void;
  deleteTrading: (id: any) => Promise<void>;
}

const CustomInput = styled(TextField)`
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const tabArr = ['전체', '시초먹기', '장중먹기', '내일먹기'];
const categoryArr = ['시초먹기', '장중먹기', '내일먹기'];
const sortArr = [
  {
    text: '등락률 순(포착가 기준)',
    value: 'ratioByCapturePrice',
  },
  {
    text: '시가총액 순',
    value: 'marketCap',
  },
  {
    text: '거래량 순',
    value: 'volume',
  },
];
const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  border: isDragging ? 'none' : '',
  // change background colour if dragging
  background: isDragging ? '#98fb98' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#b3cee5' : 'white',
  border: isDraggingOver ? 'none' : '',
  padding: grid,
  width: 250,
});

export default function HankyungListPresenter(props: Props) {
  const {
    tabValue,
    handleTab,
    handleStockChange,
    onStockChange,
    stockInput,
    stockList,
    stockLoading,
    stocks,
    category,
    handleCategory,
    tripleA,
    handleInput,
    input,
    handleStocksInput,
    postOpeningTrading,
    list,
    getListInfo,
    mode,
    editOpeningTrading,
    handleQuery,
    handleReset,
    onDragEnd,
    handleAddDndStocks,
    dndStocks,
    handleRemoveDndStocks,
    handleDndStockInput,
    realTiemStocks,
    sort,
    handleSort,
    deleteTrading,
  } = props;
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box display={'flex'} sx={{ mt: 3 }}>
        <Tabs value={tabValue} centered onChange={handleTab}>
          {tabArr.map((data) => (
            <Tab
              label={data}
              sx={{ minWidth: '85px !important' }}
              key={data}
            />
          ))}
        </Tabs>
      </Box>

      <Box flex={1} display="flex" sx={{ mt: 3 }}>
        <Box flex={0.25}>
          <TextField
            fullWidth
            sx={{ mb: 3 }}
            id="search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            onChange={handleQuery}
            placeholder="검색"
            // value={query._q}
            variant="outlined"
          />
          <Box
            sx={{
              maxHeight: category === '장중먹기' ? 130 : 500,
              overflow: 'auto',
              border: `1px solid ${theme.palette.grey[300]}`,
            }}
          >
            <List
              sx={{
                width: '100%',
                padding: 0,
              }}
            >
              {list
                .filter((data) => {
                  if (tabValue === 0) {
                    return data;
                  } else if (tabValue === 1) {
                    return data.category === '시초먹기';
                  } else if (tabValue === 2) {
                    return data.category === '장중먹기';
                  } else if (tabValue === 3) {
                    return data.category === '내일먹기';
                  } else {
                    return data;
                  }
                })
                .map((data, index) => (
                  <ListItem
                    key={index}
                    disablePadding
                    sx={{
                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    <ListItemButton
                      onClick={() =>
                        getListInfo(data.id, data.category)
                      }
                    >
                      <Box>
                        <ListItemText primary={`${data.title}`} />
                        <ListItemText
                          secondary={`${dayjs(data.created_at).format(
                            'YYYY-MM-DD HH:mm:ss',
                          )}`}
                        />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Box>
        </Box>
        <Box flex={0.75} sx={{ ml: 3 }}>
          <Box flex={1} display={'flex'} alignItems="center" mb={2}>
            <Typography variant="h6" flex={0.1} sx={{ mr: 3 }}>
              카테고리
            </Typography>
            <TextField
              sx={{ flex: 1 }}
              select
              onChange={handleCategory}
              value={category}
              SelectProps={{ native: true }}
              variant="outlined"
              helperText="카테고리 변경시 내용이 초기화 됩니다. "
            >
              {categoryArr.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </TextField>
          </Box>
          <Box flex={1} display={'flex'} alignItems="center" mb={2}>
            <Typography variant="h6" flex={0.1} sx={{ mr: 3 }}>
              제목
            </Typography>
            <TextField
              sx={{ flex: 1 }}
              name="title"
              value={input.title}
              onChange={handleInput}
              placeholder="제목"
              // value={query._q}
              variant="outlined"
            />
          </Box>

          <Box flex={1} display={'flex'} alignItems="center" mb={2}>
            <Typography variant="h6" flex={0.1} sx={{ mr: 3 }}>
              한 줄 코멘트
            </Typography>
            <TextField
              sx={{ flex: 1 }}
              name="comment"
              value={input.comment}
              onChange={handleInput}
              placeholder="코멘트"
              // value={query._q}
              variant="outlined"
            />
          </Box>
          {category !== '장중먹기' && (
            <Box flex={1} display={'flex'} alignItems="center" mb={2}>
              <Typography variant="h6" flex={0.1} sx={{ mr: 3 }}>
                종목 추가
              </Typography>
              <Autocomplete
                multiple
                sx={{ flex: 1 }}
                autoHighlight
                options={stockList}
                value={stocks}
                getOptionLabel={(option) =>
                  option?.name + `(${option?.code})`
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
                          {stockLoading && (
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
          )}
          {category !== '장중먹기' &&
            Array.isArray(stocks) &&
            stocks.length > 0 &&
            stocks.map((data: HankyungStocks) => (
              <Box flex={1} key={data?.id}>
                <Box sx={{ mb: 1 }}>
                  <Box
                    display={'flex'}
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">
                      [{data?.name}] ({data?.code})
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Typography mr={2}>
                      {realTiemStocks[data.code] &&
                        priceToString(
                          realTiemStocks[data.code]?.price,
                        )}
                      원
                    </Typography>
                    <Typography
                      mr={2}
                      color={
                        realTiemStocks[data.code]?.ratio > 0
                          ? 'red'
                          : 'blue'
                      }
                    >
                      {realTiemStocks[data.code] &&
                        realTiemStocks[data.code]?.ratio}
                      %
                    </Typography>
                    <Typography
                      color={
                        realTiemStocks[data.code]?.diff > 0
                          ? 'red'
                          : 'blue'
                      }
                    >
                      {realTiemStocks[data.code]?.diff > 0
                        ? '▲ '
                        : '▼ '}
                      {realTiemStocks[data.code] &&
                        realTiemStocks[data.code]?.diff}
                    </Typography>
                  </Box>
                </Box>
                <TextField
                  sx={{ flex: 1, mb: 1 }}
                  fullWidth
                  name="idea"
                  value={data?.idea}
                  onChange={(e) => handleStocksInput(e, data.code)}
                  placeholder="투자 아이디어"
                  variant="outlined"
                />

                {/* <Box flex={1} sx={{ display: 'flex' }}>
                  <CustomInput
                    //@ts-ignore
                    onWheel={(e) => e.target.blur()}
                    sx={{ flex: 1, mb: 1, mr: 1 }}
                    name="targetPrice"
                    value={data?.targetPrice}
                    type="number"
                    placeholder="목표가"
                    onChange={(e) => handleStocksInput(e, data.code)}
                    variant="outlined"
                  />
                  <CustomInput
                    //@ts-ignore
                    onWheel={(e) => e.target.blur()}
                    sx={{ flex: 1, mb: 1, mr: 1 }}
                    name="stoplossPrice"
                    type="number"
                    value={data?.stoplossPrice}
                    onChange={(e) => handleStocksInput(e, data.code)}
                    placeholder="손절가"
                    variant="outlined"
                  />
                  <CustomInput
                    //@ts-ignore
                    onWheel={(e) => e.target.blur()}
                    sx={{ flex: 1, mb: 1 }}
                    name="recoPrice"
                    value={data?.recoPrice}
                    type="number"
                    onChange={(e) => handleStocksInput(e, data.code)}
                    placeholder="추천가"
                    variant="outlined"
                  />
                </Box> */}
              </Box>
            ))}

          {mode === 'edit' ? (
            <>
              <Box display={'flex'} justifyContent="end" my={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 2 }}
                  onClick={() => setOpen(true)}
                >
                  삭제
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleReset}
                >
                  취소
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={editOpeningTrading}
                >
                  수정
                </Button>
              </Box>
            </>
          ) : (
            <Box display={'flex'} justifyContent="end" my={2}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 2 }}
                onClick={handleReset}
              >
                취소
              </Button>
              <Button
                variant="contained"
                onClick={postOpeningTrading}
              >
                저장
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {category === '장중먹기' && (
        <>
          <Box display={'flex'} flex={1} gap={2}>
            <Box flex={0.4}>
              <Typography variant="h6">추천 종목 리스트</Typography>
              <Box
                flex={1}
                display={'flex'}
                alignItems="center"
                mb={2}
              >
                <TextField
                  sx={{ flex: 1 }}
                  select
                  onChange={handleSort}
                  value={sort}
                  SelectProps={{ native: true }}
                  variant="outlined"
                >
                  {sortArr.map((data) => (
                    <option key={data.value} value={data.value}>
                      {data.text}
                    </option>
                  ))}
                </TextField>
              </Box>
              <Box
                sx={{
                  maxHeight: 600,
                  overflow: 'auto',
                  mt: 1,
                  border: `1px solid ${theme.palette.grey[300]}`,
                }}
              >
                <HankyungTripleAList
                  tripleA={tripleA}
                  sort={sort}
                  handleAddDndStocks={handleAddDndStocks}
                />
              </Box>
            </Box>

            <Box flex={1} style={{ display: 'flex' }} mt={3}>
              <DragDropContext onDragEnd={onDragEnd}>
                {dndStocks.map((el, ind) => (
                  <Droppable key={ind} droppableId={`${String(ind)}`}>
                    {(provided, snapshot) => (
                      <Box
                        flex={1}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                        sx={{
                          mt: 0.5,
                          border: `1px solid ${theme.palette.grey[400]}`,
                          padding: 1,
                          borderRadius: '16px',
                        }}
                      >
                        {/* <Typography variant="h6" sx={{ mb: 1 }}>
                          {provided.droppableProps[
                            'data-rbd-droppable-id'
                          ] === '0'
                            ? '1~5위'
                            : '6~10위'}
                        </Typography> */}
                        {el.map((item, index) => (
                          <Draggable
                            key={item.dragId}
                            draggableId={item.dragId}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Box
                                sx={{
                                  border: `1px solid ${theme.palette.grey[200]}`,
                                  borderRadius: 1,
                                }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style,
                                )}
                              >
                                <Box
                                  display={'flex'}
                                  justifyContent="space-between"
                                  alignItems={'center'}
                                  sx={{
                                    mt: 1,
                                  }}
                                >
                                  <Typography variant="h6">
                                    {ind === 0
                                      ? index + 1
                                      : index + 6}
                                    . [{item.stockName}] (
                                    {item.stockCode})
                                  </Typography>

                                  <Box
                                    display={'flex'}
                                    alignItems="center"
                                  >
                                    <FormGroup row>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="블러"
                                        name="isBlur"
                                        checked={item.isBlur}
                                        onClick={(e) =>
                                          handleDndStockInput(
                                            e,
                                            item.stockCode,
                                          )
                                        }
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        name="isReco"
                                        label="추천"
                                        checked={item.isReco}
                                        onClick={(e) =>
                                          handleDndStockInput(
                                            e,
                                            item.stockCode,
                                          )
                                        }
                                      />
                                    </FormGroup>
                                    <Button
                                      color="secondary"
                                      variant="outlined"
                                      sx={{ height: '30px' }}
                                      onClick={() => {
                                        handleRemoveDndStocks(
                                          item.stockCode,
                                        );
                                      }}
                                    >
                                      삭제
                                    </Button>
                                  </Box>
                                </Box>
                                <Box display="flex">
                                  <Typography mr={2}>
                                    {realTiemStocks[item.stockCode] &&
                                      priceToString(
                                        realTiemStocks[item.stockCode]
                                          ?.price,
                                      )}
                                    원
                                  </Typography>
                                  <Typography
                                    mr={2}
                                    color={
                                      realTiemStocks[item.stockCode]
                                        ?.ratio > 0
                                        ? 'red'
                                        : 'blue'
                                    }
                                  >
                                    {realTiemStocks[item.stockCode] &&
                                      realTiemStocks[item.stockCode]
                                        ?.ratio}
                                    %
                                  </Typography>
                                  <Typography
                                    color={
                                      realTiemStocks[item.stockCode]
                                        ?.diff > 0
                                        ? 'red'
                                        : 'blue'
                                    }
                                  >
                                    {realTiemStocks[item.stockCode]
                                      ?.diff > 0
                                      ? '▲ '
                                      : '▼ '}
                                    {realTiemStocks[item.stockCode] &&
                                      realTiemStocks[item.stockCode]
                                        ?.diff}
                                  </Typography>
                                </Box>
                                <TextField
                                  sx={{ flex: 1, mb: 1 }}
                                  fullWidth
                                  name="idea"
                                  defaultValue={item.idea}
                                  // value={item.idea}
                                  onChange={(e) =>
                                    handleDndStockInput(
                                      e,
                                      item.stockCode,
                                    )
                                  }
                                  placeholder="투자 아이디어"
                                  variant="outlined"
                                />
                                <Box
                                  flex={1}
                                  sx={{ display: 'flex' }}
                                >
                                  <CustomInput
                                    onWheel={(e) =>
                                      //@ts-ignore
                                      e.target.blur()
                                    }
                                    defaultValue={item.targetPrice}
                                    sx={{ flex: 1, mb: 1, mr: 1 }}
                                    type="number"
                                    placeholder="목표가"
                                    name="targetPrice"
                                    onChange={(e) =>
                                      handleDndStockInput(
                                        e,
                                        item.stockCode,
                                      )
                                    }
                                    variant="outlined"
                                  />
                                  <CustomInput
                                    onWheel={(e) =>
                                      //@ts-ignore
                                      e.target.blur()
                                    }
                                    defaultValue={item.stoplossPrice}
                                    sx={{ flex: 1, mb: 1, mr: 1 }}
                                    type="number"
                                    name="stoplossPrice"
                                    onChange={(e) =>
                                      handleDndStockInput(
                                        e,
                                        item.stockCode,
                                      )
                                    }
                                    placeholder="손절가"
                                    variant="outlined"
                                  />
                                  <CustomInput
                                    onWheel={(e) =>
                                      //@ts-ignore
                                      e.target.blur()
                                    }
                                    sx={{ flex: 1, mb: 1 }}
                                    type="number"
                                    defaultValue={item.recoPrice}
                                    name="recoPrice"
                                    onChange={(e) =>
                                      handleDndStockInput(
                                        e,
                                        item.stockCode,
                                      )
                                    }
                                    placeholder="추천가"
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                ))}
              </DragDropContext>
            </Box>
          </Box>
        </>
      )}
      <Dialog
        aria-labelledby="ConfirmModal"
        open={open}
        onClose={() => setOpen(false)}
      >
        <ConfirmModal
          title={'정말 삭제하시겠습니까?'}
          content={'삭제시 큰 주의가 필요합니다.'}
          confirmTitle={'삭제'}
          handleOnClick={() => deleteTrading(input.id)}
          handleOnCancel={() => {
            setOpen(false);
          }}
        />
      </Dialog>
    </Box>
  );
}
