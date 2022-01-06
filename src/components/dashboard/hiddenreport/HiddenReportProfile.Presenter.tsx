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
  Button,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { HrProfileState } from './HiddenReportProfile.Container';
import { Link as RouterLink } from 'react-router-dom';
import { CP_Hidden_Reporter } from 'src/types/cp';
import { Viewer } from '@toast-ui/react-editor';

interface IHrProfileProps {
  reporter: CP_Hidden_Reporter;
  hrProfileState: HrProfileState;
}

const HiddenReportProfilePresenter: React.FC<IHrProfileProps> = ({
  reporter,
}) => {
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
          sx={{ mx: 10 }}
          component={RouterLink}
          to={`/dashboard/cp/${reporter.id}/edit/reporter`}
        >
          내용 수정
        </Button>
      </Box>
      <Card sx={{ mx: 10, my: 4 }}>
        <CardHeader title="히든 리포터 프로필" />
        <Divider />
        {reporter ? (
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
                    {reporter.nickname}
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    캐치프레이즈
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {reporter.catchphrase}
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
                    {`${dayjs(reporter.created_at).format(
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
                    src={reporter.imageUrl}
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
                  <Viewer initialValue={reporter.intro} />
                  {/* <TextField
                    InputProps={{ disableUnderline: true }}
                    multiline
                    disabled
                    variant="standard"
                    value={reporter.intro}
                  ></TextField> */}
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
