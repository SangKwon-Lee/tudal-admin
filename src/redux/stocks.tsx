import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { wooriInnofinServer } from 'src/lib/axios';

export interface IStockPrice {
  code: string;
  price: number;
  ratio: number;
  open: number;
  diff: number;
  high: number;
  low: number;
  last: number;
  date?: string;
  time?: string;
  volume?: number;
  value?: number;
}

export const fetchStockTodayPrice = createAsyncThunk(
  '/stocks/fetchTodayPrice',
  async (stockcode: string, thunkAPI) => {
    if (stockcode) {
      const response = await wooriInnofinServer.get(
        `/price/today/stock/${stockcode}`,
      );
      return { code: stockcode, ...response.data };
    } else {
      return { code: stockcode };
    }
  },
);

interface StockState {
  [index: string]: IStockPrice;
}

const initialState: StockState = {};

// @todo: typescript 적용
const stocks = createSlice({
  name: 'stocksReducer',
  initialState,
  reducers: {
    // Action creator
    set: (state, action: PayloadAction<IStockPrice>) => {
      state[action.payload.code] = action.payload;
    },
    unset: (state, action) => {
      delete state[action.payload.code];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchStockTodayPrice.fulfilled,
      (state, action: PayloadAction<IStockPrice>) => {
        state[action.payload.code] = action.payload;
      },
    );
  },
});

export const { set, unset } = stocks.actions;
export default stocks;
