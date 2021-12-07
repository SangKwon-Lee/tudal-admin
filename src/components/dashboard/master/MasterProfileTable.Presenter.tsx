import React from 'react';
import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TextField,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { CP_Master } from 'src/types/cp';

interface IMasterProfileProps {
  master: CP_Master;
}
const MasterProfileTable: React.FC<IMasterProfileProps> = ({
  master,
}) => {
  return (
    <>
      <Card sx={{ my: 4, mx: 10 }}>
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
                  소개 글
                </Typography>
              </TableCell>
              <TableCell>
                <TextField
                  InputProps={{ disableUnderline: true }}
                  multiline
                  disabled
                  variant="standard"
                  value={master?.intro}
                ></TextField>
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
                  {console.log(master)}
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
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default MasterProfileTable;
