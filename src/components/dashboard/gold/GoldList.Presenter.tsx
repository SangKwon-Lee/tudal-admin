import React from 'react';
import { format, subDays, subHours } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';

import numeral from 'numeral';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';

import {
  IGoldListState,
  IGoldListAction,
  GoldListActionKind,
} from './GoldList.Container';

import { ISortOption } from './GoldList.Container';

import Label from 'src/components/widgets/Label';
import Scrollbar from '../../layout/Scrollbar';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import * as _ from 'lodash';
const now = new Date();

const statusOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Paid',
    value: 'paid',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Canceled',
    value: 'canceled',
  },
];

const getStatusLabel = (invoiceStatus) => {
  const map = {
    add: {
      color: 'success',
      text: 'ADD',
    },
    subtract: {
      color: 'warning',
      text: 'SUBTRACT',
    },
  };

  const { text, color }: any = map[invoiceStatus];

  return <Label color={color}>{text}</Label>;
};

interface IGoldListPresenterProps {
  state: IGoldListState;
  sortOptions: ISortOption[];
  dispatch: (params: IGoldListAction) => void;
}

const GoldListPresenter: React.FC<IGoldListPresenterProps> = ({
  state,
  dispatch,
  sortOptions,
}) => {
  const _handleSearch = _.debounce((e) =>
    dispatch({
      type: GoldListActionKind.CHANGE_SEARCH,
      payload: e.target.value,
    }),
  );
  return (
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
            placeholder="유저 ID / 코드 검색을 지원합니다"
            variant="outlined"
            onChange={_handleSearch}
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
            fullWidth
            label="Sort By"
            name="sort"
            select
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={(e) => {
              dispatch({
                type: GoldListActionKind.CHANGE_SORT,
                payload: e.target.value,
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
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 240,
          }}
        >
          <TextField
            fullWidth
            label="Status"
            name="status"
            select
            SelectProps={{ native: true }}
            variant="outlined"
          >
            {statusOptions.map((statusOption) => (
              <option
                key={statusOption.value}
                value={statusOption.value}
              >
                {statusOption.label}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>유저 아이디</TableCell>
                <TableCell>카테고리/코드</TableCell>
                <TableCell>거래 타입</TableCell>
                <TableCell>금액</TableCell>
                <TableCell>보너스 금액</TableCell>
                <TableCell>거래일시</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.list.map((ledger) => (
                <TableRow hover key={ledger.id}>
                  <TableCell>{ledger.id}</TableCell>
                  <TableCell>
                    <Link
                      color="textPrimary"
                      component={RouterLink}
                      to={`/dashboard/gold/detail/${ledger.userId}`}
                      variant="subtitle2"
                    >
                      {ledger.userId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      color="textPrimary"
                      underline="none"
                      variant="subtitle2"
                    >
                      {ledger.category}
                    </Link>
                    <Typography color="textSecondary" variant="body2">
                      {ledger.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusLabel(ledger.type)}</TableCell>
                  <TableCell>{ledger.amount}</TableCell>
                  <TableCell>{ledger.bonusAmount}</TableCell>
                  <TableCell>{ledger.datetime}</TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <Link
                        color="textPrimary"
                        component={RouterLink}
                        to={`/dashboard/gold/detail/${ledger.userId}`}
                        variant="subtitle2"
                      >
                        <ArrowRightIcon fontSize="small" />
                      </Link>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Pagination
        page={state.query.page}
        onChange={(e, page) =>
          dispatch({
            type: GoldListActionKind.CHANGE_PAGE,
            payload: page,
          })
        }
        count={100}
        variant="outlined"
        shape="rounded"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      />
    </Card>
  );
};

export default GoldListPresenter;
