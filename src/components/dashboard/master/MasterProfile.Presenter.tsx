import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Link,
  TextField,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { IUser } from 'src/types/user';
import { MasterProfileState } from './MasterProfile.Container';
import { Link as RouterLink } from 'react-router-dom';

interface IMasterProfileProps {
  user: IUser;
  masterProfileState: MasterProfileState;
}

const MasterProfilePresenter: React.FC<IMasterProfileProps> = ({
  user,
  masterProfileState,
}) => {
  return (
    <>
      <Card sx={{ my: 4, mx: 10 }}>
        <CardHeader sx={{ m: 1 }} title="달인 프로필 " />
        <Divider />
        {user?.master ? (
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
                    {user?.master?.nickname}
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
                    value={user?.master?.intro}
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
                    {user.master?.keyword
                      ? user.master.keyword
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
                    {`${dayjs(user?.master?.created_at).format(
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
                    src={user?.master?.profile_image_url}
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
      <Card sx={{ my: 4, mx: 10 }}>
        <CardHeader sx={{ m: 1 }} title="작성한 최신 피드" />
        <Divider />
        <Table>
          <TableBody>
            {masterProfileState.feeds.length > 0 &&
              masterProfileState.feeds.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      제목
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      to={`/dashboard/master/${data.id}`}
                      variant="subtitle2"
                    >
                      {data?.title}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default MasterProfilePresenter;
