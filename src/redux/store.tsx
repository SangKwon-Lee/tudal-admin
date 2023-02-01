import { combineReducers, configureStore } from '@reduxjs/toolkit';
import stocks from './stocks';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['history'],
  // blacklist: ['stocks', 'schedules', 'news', 'keyword', 'price', 'bottomSheets', 'indices', 'search', 'user'],
};

const rootReducer = combineReducers({
  stocks: stocks.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
      // }).concat(logger),
    }),
});

export const persistor = persistStore(store);
export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { stocks: StocksState }
export type AppDispatch = typeof store.dispatch;
