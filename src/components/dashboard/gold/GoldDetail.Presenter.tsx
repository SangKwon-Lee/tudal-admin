import { FC, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TableHead,
  TablePagination,
  Select,
  MenuItem,
  Pagination,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import LockIcon from '../../../icons/Lock';
import Scrollbar from '../../layout/Scrollbar';
import {
  GoldDetailActionKind,
  IGoldDetailAction,
  IGoldDetailState,
} from './GoldDetail.Container';
import { IGoldLedger, IGoldWallet } from 'src/types/gold';
import { applyPagination } from 'src/utils/pagination';
import { getStatusLabel } from './GoldList.Presenter';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';

const LedgerTable: FC<{ ledger: IGoldLedger[] }> = (props) => {
  const { ledger } = props;
  const [page, setPage] = useState<number>(1);
  const paginatedLedger = applyPagination(ledger, page - 1, 5);

  return (
    <Card>
      <CardHeader title="골드 충전(소모) 내역" />
      <Divider />
      <Scrollbar>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>이름</TableCell>
                <TableCell>골드</TableCell>
                <TableCell>보너스 골드</TableCell>
                <TableCell>합계</TableCell>
                <TableCell>날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLedger.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getStatusLabel(item.type)}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.bonusAmount}</TableCell>
                  <TableCell>
                    {item.amount + item.bonusAmount}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.datetime).format('YYYY/MM/DD')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Pagination
        count={Math.ceil(ledger.length / 5)}
        onChange={(e, page): void => {
          setPage(page);
        }}
        page={page}
        variant="outlined"
        shape="rounded"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      />
    </Card>
  );
};

const WalletTable: FC<{
  wallet: IGoldWallet;
  total: number;
  totalByHand: number;
  handleOpen: () => void;
}> = ({ wallet, total, totalByHand, handleOpen }) => {
  const warning = () => {
    if (totalByHand && total) {
      if (totalByHand !== total) {
        return (
          <div style={{ color: 'red' }}>
            합계와 장부가 일치하지 않습니다.
          </div>
        );
      }
    }
  };
  return (
    <>
      <CardHeader title="유저 골드 현황" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                유저 ID
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {wallet?.userId}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                골드
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {wallet?.gold}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                보너스 골드
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {wallet?.bonusGold}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                합계
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {total ? total : null}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                장부 계산
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {totalByHand}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          p: 1,
        }}
      >
        {warning()}
        <Button
          color="inherit"
          onClick={handleOpen}
          startIcon={<LockIcon fontSize="small" />}
          variant="text"
        >
          골드 관리
        </Button>
      </Box>
    </>
  );
};

interface IGoldDetailPresenter {
  userId: number;
  state: IGoldDetailState;
  postGold: () => void;
  handleUser: (userId: number) => void;
  dispatch: (params: IGoldDetailAction) => void;
}

const GoldDetailPresenter: FC<IGoldDetailPresenter> = ({
  userId,
  handleUser,
  postGold,
  state,
  dispatch,
}) => {
  const { ledger, wallet, totalByHand } = state;
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const userIdRef = useRef<HTMLInputElement>(null);
  const _handleUser = () => {
    if (!userIdRef.current?.value) {
      toast.error('유저 아이디를 입력해주세요');
    }
    handleUser(parseInt(userIdRef.current.value, 10));
  };

  const total = wallet?.bonusGold + wallet?.gold;

  // 골드 수정 입력 대화창
  const handleOpen = () => {
    if (!userId) {
      toast.error('유저를 먼저 검색해주세요.');
      return;
    }
    dispatch({
      type: GoldDetailActionKind.CHANGE_USERID,
      payload: userId,
    });
    dispatch({
      type: GoldDetailActionKind.HANDLE_DIALOG,
      payload: true,
    });
  };

  const handleClose = () => {
    dispatch({
      type: GoldDetailActionKind.HANDLE_DIALOG,
      payload: false,
    });
  };

  // 골드 컨펌 대화창
  const handleOpenConfirm = () => {
    dispatch({
      type: GoldDetailActionKind.HANDLE_DIALOG,
      payload: false,
    });
    setIsConfirmed(true);
  };
  const handleCloseConfirm = () => {
    setIsConfirmed(false);
  };

  const handleSubmit = () => {
    postGold();
    handleCloseConfirm();
  };

  return (
    <Box sx={{ mt: 5, pr: 10 }}>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <TextField
          id="outlined-basic"
          label="유저 ID"
          defaultValue={userId}
          variant="outlined"
          inputRef={userIdRef}
        />
        <Button
          sx={{ ml: 1 }}
          variant="contained"
          style={{ minHeight: '50px', maxHeight: '50px' }}
          onClick={_handleUser}
        >
          유저 검색
        </Button>
      </Box>
      {wallet && ledger && (
        <Box sx={{ mt: 3 }} style={{ display: 'flex' }}>
          <Box sx={{ mr: 10 }} maxWidth="30%" minWidth="30%">
            <WalletTable
              wallet={wallet}
              total={total}
              handleOpen={handleOpen}
              totalByHand={totalByHand}
            />
          </Box>
          <Box minWidth="70%" maxWidth="70%">
            <LedgerTable ledger={ledger} />
          </Box>
        </Box>
      )}
      {isConfirmed && (
        <Dialog
          aria-labelledby="ConfirmModal"
          open={isConfirmed}
          onClose={handleCloseConfirm}
        >
          <ConfirmModal
            title="골드 수정"
            confirmTitle="확인"
            type="CONFIRM"
            content={`${userId} 유저의 골드를 수정하시겠습니까? `}
            handleOnCancel={handleCloseConfirm}
            handleOnClick={handleSubmit}
          />
        </Dialog>
      )}

      <Dialog open={state.openGoldAddDialog} onClose={handleClose}>
        <DialogTitle>골드 추가(제거)</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <b>{userId}</b> 유저의 골드를 수정합니다.
            <br />
            현재 유저의 골드는 <b>{total}</b> 골드입니다.
            <br />
            현재 유저의 골드 내역 총 합계는
            <b>{totalByHand}</b>
            골드입니다.
          </DialogContentText>
          <Box p={3}>
            <Box
              style={{
                display: 'flex',
                width: '500px',
                justifyContent: 'space-between',
              }}
            >
              <Select
                size="small"
                variant="outlined"
                value={state.postForm.type}
                label="Age"
                onChange={(e) => {
                  dispatch({
                    type: GoldDetailActionKind.CHANGE_TYPE,
                    payload: e.target.value,
                  });
                }}
              >
                <MenuItem value={'add'}>추가</MenuItem>
                <MenuItem value={'sub'}>제거</MenuItem>
              </Select>

              <TextField
                type="number"
                label="골드"
                variant="standard"
                onChange={(e) => {
                  dispatch({
                    type: GoldDetailActionKind.CHANGE_AMOUNT,
                    payload: e.target.value,
                  });
                }}
              />
              <TextField
                type="number"
                label="보너스 골드"
                variant="standard"
                onChange={(e) => {
                  dispatch({
                    type: GoldDetailActionKind.CHANGE_BONUSAMOUNT,
                    payload: e.target.value,
                  });
                }}
              />
            </Box>
            <Box style={{ display: 'flex' }}>
              <TextField
                id="name"
                fullWidth
                label="충전 사유"
                variant="standard"
                onChange={(e) => {
                  dispatch({
                    type: GoldDetailActionKind.CHANGE_CATEGORY,
                    payload: e.target.value,
                  });
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleOpenConfirm}>확인</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoldDetailPresenter;
