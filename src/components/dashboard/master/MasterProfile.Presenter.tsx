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
  Box,
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
      <Typography sx={{ my: 2 }} variant="h5">
        안녕하세요. {user?.master.nickname} 님.
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
          <CardHeader title="달인 프로필 " />
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
                    {user?.master.nickname}
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
                    value={user?.master.intro}
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
                    {user?.master.keyword
                      .split(',')
                      .map((data) => data + ' / ')}
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
                    {`${dayjs(user?.master.created_at).format(
                      'YYYY년 M월 D일 HH:mm',
                    )}`}
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
                    src={user?.master.profile_image_url}
                    alt={''}
                  ></img>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Box>
      <Card sx={{ my: 3, width: '40%' }}>
        <CardHeader title="작성한 최신 피드" />
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
