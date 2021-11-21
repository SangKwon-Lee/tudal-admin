import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
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
import SearchIcon from '../../../icons/Search';
import * as _ from 'lodash';

export const getStatusLabel = (status) => {
  const map = {
    add: {
      color: 'success',
      text: 'ADD',
      label: 'Add',
    },
    subtract: {
      color: 'warning',
      text: 'Sub',
      label: 'Sub',
    },
  };

  const { color, label }: any = map[status];

  return <Label color={color}>{label}</Label>;
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
    <Card sx={{ my: 4 }}>
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
      </Box>
      <Scrollbar>
        {state.loading && <LinearProgress />}

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
                      style={{ textDecoration: 'underline' }}
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
        page={state.query.page + 1}
        onChange={(e, page) =>
          dispatch({
            type: GoldListActionKind.CHANGE_PAGE,
            payload: page,
          })
        }
        count={Math.ceil(state.listLength / state.query.limit)}
        variant="outlined"
        shape="rounded"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      />
    </Card>
  );
};

export default GoldListPresenter;
