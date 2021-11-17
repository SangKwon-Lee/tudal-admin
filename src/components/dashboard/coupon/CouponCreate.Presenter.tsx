import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import { FC } from 'react';
import {
  CouponCreateAction,
  CouponCreateActionKind,
  CouponCreateState,
} from './CouponCreate.Container';
import {
  CouponListTableAction,
  CouponListTableActionKind,
} from './CouponListTable.Container';

interface ICouponCreateProps {
  openModal: boolean;
  dispatch: (params: CouponCreateAction) => void;
  listDispatch: (params: CouponListTableAction) => void;
  couponCreateState: CouponCreateState;
  createCoupon: () => void;
  handleChangeExpirationDate: (event: any) => void;
}
const expirationDateOption = [
  {
    title: '7일',
  },
  {
    title: '30일',
  },
  {
    title: '60일',
  },
  {
    title: '90일',
  },
  {
    title: '6개월',
  },
  {
    title: '1년',
  },
];
const couponType = [
  {
    type: 'premium',
  },
  {
    type: 'master',
  },
  {
    type: 'lms',
  },
];
const applyDays = [
  {
    day: '7일',
    value: 7,
  },
  {
    day: '30일',
    value: 30,
  },
  {
    day: '60일',
    value: 60,
  },
  {
    day: '90일',
    value: 90,
  },
];
const numbers = [
  {
    title: '1개',
    value: 1,
  },
  {
    title: '10개',
    value: 10,
  },
  {
    title: '30개',
    value: 30,
  },
  {
    title: '50개',
    value: 50,
  },
  {
    title: '100개',
    value: 100,
  },
  {
    title: '300개',
    value: 300,
  },
  {
    title: '500개',
    value: 500,
  },
];

const CouponCreatePresenter: FC<ICouponCreateProps> = (props) => {
  const {
    openModal,
    listDispatch,
    couponCreateState,
    dispatch,
    createCoupon,
    handleChangeExpirationDate,
  } = props;
  const { createInput } = couponCreateState;
  return (
    <Dialog
      open={openModal}
      onClose={() => {
        listDispatch({
          type: CouponListTableActionKind.CLOSE_CREATE_DIALOG,
        });
      }}
    >
      <Card sx={{ p: 3 }}>
        <Typography>쿠폰 생성</Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            sx={{ m: 2 }}
            label="쿠폰 이름"
            name="displayName"
            onChange={(event) => {
              dispatch({
                type: CouponCreateActionKind.CHANGE_INPUT,
                payload: event,
              });
            }}
            value={createInput?.displayName || ''}
            variant="outlined"
          />
          <TextField
            sx={{ m: 2, width: '50%' }}
            label="영어 이름 ex) premium7days"
            name="name"
            onChange={(event) => {
              dispatch({
                type: CouponCreateActionKind.CHANGE_INPUT,
                payload: event,
              });
            }}
            value={createInput?.name || ''}
            variant="outlined"
          />
          <TextField
            sx={{ m: 2 }}
            label="기관 이름 (선택)"
            name="agency"
            onChange={(event) => {
              dispatch({
                type: CouponCreateActionKind.CHANGE_INPUT,
                payload: event,
              });
            }}
            value={createInput?.agency || ''}
            variant="outlined"
          />
        </Box>
        <Box sx={{ my: 2, display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {!couponCreateState.isWriteApplyDays ? (
              <TextField
                select
                sx={{ mx: 2 }}
                label={'무료 기간'}
                name="applyDays"
                SelectProps={{ native: true }}
                variant="outlined"
                onChange={(event) => {
                  dispatch({
                    type: CouponCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
              >
                {applyDays.map((date: any, i) => (
                  <option key={i} value={date.value}>
                    {date.day}
                  </option>
                ))}
              </TextField>
            ) : (
              <TextField
                // select
                type="number"
                sx={{ mx: 2, width: '140px' }}
                label={'무료 기간 ex) 30'}
                name="applyDays"
                InputProps={{
                  inputProps: {
                    min: 1,
                  },
                }}
                // SelectProps={{ native: true }}
                variant="outlined"
                onChange={(event) => {
                  dispatch({
                    type: CouponCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
              ></TextField>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    dispatch({
                      type: CouponCreateActionKind.WRITE_APPLY_DAYS,
                      payload: e.target.checked,
                    });
                  }}
                />
              }
              label="직접 입력"
            />
          </Box>
          <TextField
            select
            sx={{ mx: 1 }}
            label={'유효기간'}
            name="expirationDate"
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={handleChangeExpirationDate}
          >
            {expirationDateOption.map((date: any, i) => (
              <option key={i} value={date.value}>
                {date.title}
              </option>
            ))}
          </TextField>
          <TextField
            select
            sx={{ mx: 1 }}
            label={'쿠폰 타입'}
            name="type"
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={(event) => {
              dispatch({
                type: CouponCreateActionKind.CHANGE_INPUT,
                payload: event,
              });
            }}
          >
            {couponType.map((date: any, i) => (
              <option key={i} value={date.type}>
                {date.type}
              </option>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {!couponCreateState.isWriteQuantity ? (
              <TextField
                select
                sx={{ mx: 1 }}
                label={'쿠폰 발급 개수'}
                name="quantity"
                InputProps={{
                  inputProps: {
                    min: 1,
                  },
                }}
                SelectProps={{ native: true }}
                variant="outlined"
                onChange={(event) => {
                  dispatch({
                    type: CouponCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
              >
                {numbers.map((date: any, i) => (
                  <option key={i} value={date.value}>
                    {date.title}
                  </option>
                ))}
              </TextField>
            ) : (
              <TextField
                sx={{ mx: 1, width: '140px' }}
                type="number"
                label={'쿠폰 발급 개수'}
                name="quantity"
                variant="outlined"
                onChange={(event) => {
                  dispatch({
                    type: CouponCreateActionKind.CHANGE_INPUT,
                    payload: event,
                  });
                }}
              >
                {numbers.map((date: any, i) => (
                  <option key={i} value={date.value}>
                    {date.title}
                  </option>
                ))}
              </TextField>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    dispatch({
                      type: CouponCreateActionKind.WRITE_QUANTITY,
                      payload: e.target.checked,
                    });
                  }}
                />
              }
              label="직접 입력"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            color="primary"
            sx={{ ml: 2 }}
            variant="contained"
            onClick={createCoupon}
          >
            쿠폰 생성
          </Button>
        </Box>
      </Card>
    </Dialog>
  );
};

export default CouponCreatePresenter;
