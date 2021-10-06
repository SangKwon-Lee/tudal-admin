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
} from '@material-ui/core';
import type { Expert } from '../../../types/expert';
import moment from 'moment';
import { Viewer } from '@toast-ui/react-editor';
import { FC } from 'react';

interface IExpertDetails {
  expert: Expert;
}

const ExpertDetailsPresenter: FC<IExpertDetails> = (props) => {
  const { expert, ...other } = props;

  return (
    <>
      <Card {...other}>
        <CardHeader title="달인 상세내용" />
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
                  {expert.title}
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
                  {`${expert.author}`}
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
                  {/* {expert.type} */}
                  뉴스픽 (임시)
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
                  {`${moment(expert.created_at).format(
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
                  {`${moment(expert.updated_at).format(
                    'YYYY년 M월 D일 HH:mm',
                  )}`}
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
                  {/* {expert.likes.length} */}0
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
                  {/* {expert.viewCount ? expert.viewCount : 0} */}0
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
              <Viewer initialValue={expert.description} />
            </Container>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default ExpertDetailsPresenter;
