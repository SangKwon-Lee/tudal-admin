import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  TextField,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { IUser } from 'src/types/user';
import { HrProfileState } from './HiddenReportProfile.Container';

interface IHrProfileProps {
  user: IUser;
  hrProfileState: HrProfileState;
}

const HiddenReportProfilePresenter: React.FC<IHrProfileProps> = ({
  user,
}) => {
  return (
    <>
      <Typography sx={{ my: 2 }} variant="h5">
        안녕하세요. {user?.hidden_reporter?.nickname} 님.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Card sx={{ width: '49%' }}>
          <CardHeader title="계정 프로필 " />
          <Divider />
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    이름
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {user?.username}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    닉네임
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {user?.nickname}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    이메일
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {user?.contact_email}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    연락처
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {user?.phone_number}
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
                    {`${dayjs(user?.created_at).format(
                      'YYYY년 M월 D일 HH:mm',
                    )}`}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
        <Card sx={{ width: '49%' }}>
          <CardHeader title="히든 리포터 프로필" />
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
                    {user?.hidden_reporter?.nickname}
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
                    value={user?.hidden_reporter?.intro}
                  ></TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    CatchPhrase
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {user?.hidden_reporter?.catchPhrase}
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
                    {`${dayjs(
                      user?.hidden_reporter?.created_at,
                    ).format('YYYY년 M월 D일 HH:mm')}`}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ minWidth: '120px' }}>
                  <Typography color="textPrimary" variant="subtitle2">
                    프로필 사진
                  </Typography>
                </TableCell>
                <TableCell>
                  <img
                    style={{ width: '30%' }}
                    src={user?.hidden_reporter?.imageUrl}
                    alt={''}
                  ></img>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Box>
    </>
  );
};

export default HiddenReportProfilePresenter;
