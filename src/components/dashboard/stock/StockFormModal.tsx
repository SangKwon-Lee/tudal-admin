import React from 'react';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
import { Dialog } from '@material-ui/core';

interface StockFormProps {
  stock: IStockDetailsWithTagCommentNews;
  isOpen: boolean;
  setClose: () => void;
}
const StockForm: React.FC<StockFormProps> = (props) => {
  const { stock, isOpen, setClose } = props;
  return (
    <Dialog
      open={true}
      onClose={setClose}
      data-testid="news-add-modal-form"
    >
      {console.log(isOpen)}
      <div>키워드</div>
      <div>코멘트</div>
      <div>뉴스</div>
    </Dialog>
  );
};

export default StockForm;
