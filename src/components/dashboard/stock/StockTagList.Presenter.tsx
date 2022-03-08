import type { FC } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  LinearProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import Scrollbar from '../../layout/Scrollbar';
import { IStockTags } from 'src/types/stock';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

interface IProps {
  stockTags: IStockTags[];
  loading: boolean;
  page: number;
  limit: number;
  length: number;
  onPageChange: (page) => void;
}

// Split timestamp into [ Y, M, D, h, m, s ]
dayjs.extend(utc);

const StockTagListPresenter: FC<IProps> = (props) => {
  const { stockTags, page, limit, length, onPageChange, loading } =
    props;
  if (loading) {
    return <LinearProgress />;
  } else {
    return (
      <Box
        sx={{
          backgroundColor: 'background.default',
          p: 3,
        }}
      >
        <Card>
          <CardHeader title="최신 종목 키워드 업데이트 현황" />
          <Divider />
          <Scrollbar>
            <Box sx={{ minWidth: 700 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>id</TableCell>
                    <TableCell>종목</TableCell>
                    <TableCell>키워드</TableCell>
                    <TableCell>일시</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockTags.length &&
                    stockTags.map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Typography
                            color="textPrimary"
                            variant="subtitle2"
                          >
                            {row.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{`${row.stock?.name}(${row.stock?.code})`}</TableCell>
                        <TableCell>
                          {row.tag?.name && row.tag.name}
                        </TableCell>
                        <TableCell>
                          {dayjs(row.updated_at)
                            .subtract(9, 'hour')
                            .format('YYYY-MM-DD HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
            }}
          >
            <Pagination
              page={page}
              count={Math.ceil(length / limit)}
              onChange={(e, page) => onPageChange(page)}
              variant="outlined"
              shape="rounded"
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            />
          </Box>
        </Card>
      </Box>
    );
  }
};

export default StockTagListPresenter;
