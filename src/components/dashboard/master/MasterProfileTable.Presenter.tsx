import React from 'react';
import {
  Card,
  CardHeader,
  Box,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router-dom';
import { IMaster } from 'src/types/master';
import { Viewer } from '@toast-ui/react-editor';
interface IMasterProfileProps {
  master: IMaster;
}
const MasterProfileTable: React.FC<IMasterProfileProps> = ({
  master,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="outlined"
          sx={{ mx: 10, justifySelf: 'flex-end' }}
          component={RouterLink}
          to={`/dashboard/cp/master/${master.id}/edit`}
        >
          내용 수정
        </Button>
      </Box>
      <Card sx={{ my: 2, mx: 10 }}>
        <CardHeader sx={{ m: 1 }} title="달인 프로필" />
        <Divider />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  닉네임 (채널)
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master?.nickname}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  채널 키워드
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master.keyword.length
                    ? master.keyword.split(',').length === 1
                      ? master.keyword
                      : master.keyword
                          .split(',')
                          .map((data) => data + ' / ')
                    : ''}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  구독료 (GOLD)
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master.price_gold}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  기본 구독 기간 (일)
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master.subscription_days}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  계정 생성일
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {`${dayjs(master.created_at).format(
                    'YYYY년 M월 D일 HH:mm',
                  )}`}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ minWidth: '250px' }}>
                <Typography color="textPrimary" variant="subtitle2">
                  프로필 사진
                </Typography>
              </TableCell>
              <TableCell>
                <img
                  style={{ borderRadius: '50%', width: '100px' }}
                  src={master?.profile_image_url}
                  alt={''}
                ></img>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  소개 글
                </Typography>
              </TableCell>
              <TableCell>
                <Viewer initialValue={master.intro}></Viewer>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

export default MasterProfileTable;
