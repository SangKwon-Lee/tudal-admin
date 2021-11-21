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
      <Card sx={{ mx: 10, my: 4 }}>
        <CardHeader title="히든 리포터 프로필" />
        <Divider />
        {user?.hidden_reporter ? (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    닉네임
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
                    {user?.hidden_reporter?.catchphrase}
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
                <TableCell sx={{ minWidth: '250px' }}>
                  <Typography color="textPrimary" variant="subtitle2">
                    프로필 사진
                  </Typography>
                </TableCell>
                <TableCell>
                  <img
                    style={{ borderRadius: '50%', width: '100px' }}
                    src={user?.hidden_reporter?.imageUrl}
                    alt={''}
                  ></img>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Typography variant="subtitle2" sx={{ m: 3 }}>
            계정이 없습니다.
          </Typography>
        )}
      </Card>
    </>
  );
};

export default HiddenReportProfilePresenter;
