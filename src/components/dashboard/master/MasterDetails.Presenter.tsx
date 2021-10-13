import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Container,
  LinearProgress,
} from '@material-ui/core';
import type { Master } from '../../../types/expert';
import moment from 'moment';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { FC } from 'react';
import { AxiosError } from 'axios';
import useAuth from 'src/hooks/useAuth';

interface newState {
  master: Master;
  loading: boolean;
  error: AxiosError<any> | boolean;
}

interface IMasterDetails {
  newState: newState;
}

const MasterDetailsPresenter: FC<IMasterDetails> = (props) => {
  const { newState, ...other } = props;
  const { master, loading } = newState;
  const { user } = useAuth();
  console.log(master);
  return (
    <>
      <Card {...other}>
        <CardHeader title="달인 상세내용" />
        {loading && (
          <div data-testid="news-list-loading">
            <LinearProgress />
          </div>
        )}
        <Divider />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  제목
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master?.title}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  작성자
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {`${
                    typeof master.author === 'string'
                      ? master.author
                      : user.nickname
                  }`}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  방 이름
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master?.master_room?.title
                    ? master.master_room.title
                    : master.type}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  작성일
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {`${moment(master?.created_at).format(
                    'YYYY년 M월 D일 HH:mm',
                  )}`}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  수정일
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {`${moment(master?.updated_at).format(
                    'YYYY년 M월 D일 HH:mm',
                  )}`}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  키워드
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master?.tags &&
                    master.tags.length > 0 &&
                    master.tags.map((data) => data.name)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  종목
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master?.stocks &&
                    master.stocks.length > 0 &&
                    master.stocks.map((data) => data.name)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  좋아요
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {/* {master.likes.length} */}0
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  조회수
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master?.viewCount ? master.viewCount : 0}
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
            p: 2,
          }}
        >
          <Typography color="textPrimary" variant="subtitle2">
            내용
          </Typography>
          <Box sx={{ py: 3 }}>
            <Container maxWidth="md">
              {master.description && (
                <Viewer initialValue={master.description} />
              )}
              {master.contents && (
                <Viewer initialValue={master.contents} />
              )}
            </Container>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default MasterDetailsPresenter;
