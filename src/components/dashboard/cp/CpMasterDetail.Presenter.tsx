import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  LinearProgress,
  Box,
  Button,
  TextField,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { CpMasterDetailState } from './CpMasterDetail.Container';
import { Link as RouterLink } from 'react-router-dom';
interface CpMasterDetailProps {
  cpMasterDetailState: CpMasterDetailState;
}
const CpMasterDetailPresenter: React.FC<CpMasterDetailProps> = (
  props,
) => {
  const { cpMasterDetailState } = props;
  const { loading, master } = cpMasterDetailState;
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button
          variant="outlined"
          sx={{ mr: 2 }}
          component={RouterLink}
          to={`/dashboard/cp/${master.id}/edit/master`}
        >
          내용 수정
        </Button>
        <Button variant="outlined">계정 삭제</Button>
      </Box>
      <Card sx={{ mt: 2 }}>
        {loading && <LinearProgress />}
        <CardHeader title="CP 달인 상세내용" />
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
                  {master?.user?.username
                    ? master.user.username
                    : '이름이 없습니다.'}
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
                  {master?.user?.contact_email
                    ? master.user.contact_email
                    : '이메일이 없습니다.'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  전화 번호
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {master?.user?.phone_number
                    ? master.user.phone_number
                    : '전화번호가 없습니다.'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  소개
                </Typography>
              </TableCell>
              <TableCell>
                <TextField
                  disabled
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  multiline
                  value={
                    master.intro
                      ? master.intro
                      : '소개 글이 없습니다.'
                  }
                ></TextField>
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
                  {master?.nickname
                    ? master.nickname
                    : '닉네임이 없습니다.'}
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
                  {master?.keyword
                    ? master.keyword
                        .split(',')
                        .map((data) => data + ' / ')
                    : '키워드가 없습니다.'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  생성일
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {`${dayjs(master?.created_at).format(
                    'YYYY년 M월 D일 HH:mm',
                  )}`}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ m: 2 }}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
            sx={{ my: 2 }}
          >
            프로필 이미지
          </Typography>
          {master?.profile_image_url ? (
            <img
              src={master.profile_image_url}
              alt="프로필이미지"
              style={{ width: '100%' }}
            ></img>
          ) : (
            '프로필 이미지가 없습니다.'
          )}
        </Box>
      </Card>
    </>
  );
};

export default CpMasterDetailPresenter;
