import moment from 'moment';

type ProductStatus = 'beforeSale' | 'onSale' | 'afterSale' | 'public';

const productStatusFunc = (hiddenbox, mode?: string) => {
  if (mode === 'create') {
    return ['beforeSale', '판매 전'];
  }
  let productStatus: ProductStatus = 'beforeSale';
  let productModeDisplay = '';
  if (moment().diff(moment(hiddenbox.startDate)) < 0) {
    productStatus = 'beforeSale';
    productModeDisplay = '판매 전';
  } else if (
    moment().diff(moment(hiddenbox.startDate)) > 0 &&
    moment().diff(moment(hiddenbox.endDate)) < 0
  ) {
    productStatus = 'onSale';
    productModeDisplay = '판매 중';
  } else if (
    moment().diff(moment(hiddenbox.endDate)) > 0 &&
    moment().diff(moment(hiddenbox.publicDate)) < 0
  ) {
    productStatus = 'afterSale';
    productModeDisplay = '판매 완료';
  } else {
    productStatus = 'public';
    productModeDisplay = '공개';
  }
  const Status = [productStatus, productModeDisplay];
  return Status;
};

export default productStatusFunc;
