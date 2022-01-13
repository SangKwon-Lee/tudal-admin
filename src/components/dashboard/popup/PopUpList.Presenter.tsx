import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableRow,
  TextField,
} from '@material-ui/core';
import Label from 'src/components/widgets/Label';

import Scrollbar from '../../layout/Scrollbar';
import ArrowRightIcon from 'src/icons/ArrowRight';
import ImageIcon from 'src/icons/Image';
import PlusIcon from 'src/icons/Plus';
import SearchIcon from 'src/icons/Search';
import {
  IPopupListState,
  PopUpListActionKind,
  sortOptions,
} from './PopUpList.Container';

import dayjs from 'dayjs';
import DraggableCard from './PopupListDnD.Container';
import toast from 'react-hot-toast';

const getOrderLabel = (order) => {
  return !order ? (
    <Label color={'error'}>비공개</Label>
  ) : (
    <Label color={'success'}>{order}</Label>
  );
};

interface PopUpListPresenterProps {
  state: IPopupListState;
  dispatch: (params: {
    type: PopUpListActionKind;
    payload?: any;
  }) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  postChangeOrder: () => void;
}

const formatDate = (date) =>
  dayjs(date).format('YYYY-MM-DD HH:mm:ss');
const PopUpListPresenter: React.FC<PopUpListPresenterProps> = ({
  state,
  dispatch,
  moveCard,
  postChangeOrder,
}) => {
  const { list, openList, page, isEditOrder } = state;

  const handleEdit = async () => {
    if (openList.length < 1) {
      toast.error('등록된 팝업이 없습니다.');
      return;
    }
    if (isEditOrder) {
      await postChangeOrder();
    }
    dispatch({
      type: PopUpListActionKind.CHANGE_EDIT_MODE,
      payload: !isEditOrder,
    });
  };
  return (
    <>
      <Box
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography sx={{ my: 2 }}>
          팝업 순서는 드래그 앤 드롭으로 변경이 가능합니다.
        </Typography>
        <Button
          color="primary"
          sx={{ height: 40 }}
          startIcon={<PlusIcon fontSize="small" />}
          onClick={handleEdit}
          variant="contained"
        >
          {isEditOrder ? '저장' : '팝업 노출 순서 변경'}
        </Button>
      </Box>

      <div
        style={{
          padding: '30px',
          cursor: 'cursor',
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        {openList.length
          ? openList.map((popup, i) => {
              return (
                <DraggableCard
                  key={i}
                  id={popup.id}
                  title={popup.title}
                  image={popup.image}
                  index={i}
                  orderEdit={isEditOrder}
                  moveCard={moveCard}
                />
              );
            })
          : '등록된 팝업이 없습니다.'}
      </div>
      <Card>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2,
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 500,
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              name="_q"
              placeholder="검색"
              variant="outlined"
              onChange={(e) => {
                dispatch({
                  type: PopUpListActionKind.CHANGE_QUERY,
                  payload: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                });
              }}
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 240,
            }}
          >
            <TextField
              label="Sort By"
              name="_sort"
              select
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={(e) => {
                dispatch({
                  type: PopUpListActionKind.CHANGE_QUERY,
                  payload: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                });
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Box>
        </Box>
        <Scrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>이미지</TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>설명</TableCell>
                  <TableCell>순서</TableCell>
                  <TableCell>날짜</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((popup) => (
                  <TableRow hover key={popup.id}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        {popup.image ? (
                          <Box
                            sx={{
                              alignItems: 'center',
                              backgroundColor: 'background.default',
                              display: 'flex',
                              height: 100,
                              justifyContent: 'center',
                              overflow: 'hidden',
                              width: 100,
                              '& img': {
                                height: 'auto',
                                width: '100%',
                              },
                            }}
                          >
                            <img alt="Product" src={popup.image} />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              alignItems: 'center',
                              backgroundColor: 'background.default',
                              display: 'flex',
                              height: 100,
                              justifyContent: 'center',
                              width: 100,
                            }}
                          >
                            <ImageIcon fontSize="small" />
                          </Box>
                        )}
                        <Link
                          color="textPrimary"
                          underline="none"
                          sx={{ ml: 2 }}
                          variant="subtitle2"
                        >
                          {/* {popup.title} */}
                        </Link>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Link
                        color="inherit"
                        component={RouterLink}
                        to={`/dashboard/popup/${popup.id}`}
                        variant="subtitle2"
                      >
                        {popup.title}
                      </Link>
                    </TableCell>
                    <TableCell>{popup.description}</TableCell>

                    <TableCell>
                      {getOrderLabel(popup.order)}
                    </TableCell>

                    <TableCell>
                      {`${formatDate(popup.openTime)} ~ ${formatDate(
                        popup.closeTime,
                      )}`}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={`/dashboard/popup/${popup.id}`}
                      >
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              count={Math.ceil(state.listLength / state.query._limit)}
              variant="outlined"
              page={page}
              onChange={(event, page) => {
                dispatch({
                  type: PopUpListActionKind.CHANGE_PAGE,
                  payload: page,
                });
              }}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            />
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default PopUpListPresenter;
