import React, { useEffect } from 'react';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import { APIStock } from 'src/lib/api';
import { StockList, StockForm } from 'src/components/dashboard/stock';
import useAsync from 'src/hooks/useAsync';

const StockPage = () => {
  const [{ data: stockList, loading: stockListLoading, error: stockError }] = useAsync<
    IStockDetailsWithTagCommentNews[]
  >(APIStock.getListDetails, [], []);

  return (
    <div>
      <StockList></StockList>
      <StockForm></StockForm>
    </div>
  );
};

export default StockPage;
