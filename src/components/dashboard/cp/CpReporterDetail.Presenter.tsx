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
import moment from 'moment';
import { CpReporterDetailState } from './CpReporterDetail.Container';
import { Link as RouterLink } from 'react-router-dom';
interface CpReporterDetailProps {
  cpReporterDetailState: CpReporterDetailState;
}
const CpReporterDetailPresenter: React.FC<CpReporterDetailProps> = (
  props,
) => {
  const { cpReporterDetailState } = props;
  const { loading, reporter } = cpReporterDetailState;
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
          to={`/dashboard/cp/${reporter.id}/edit/reporter`}
        >
          내용 수정
        </Button>
        <Button variant="outlined">계정 삭제</Button>
      </Box>
      <Card sx={{ mt: 2 }}>
        {loading && (
          <div data-testid="group-comment-loading">
            <LinearProgress />
          </div>
        )}
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
                  {reporter.user.username
                    ? reporter.user.username
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
                  {reporter.user.contact_email
                    ? reporter.user.contact_email
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
                  {reporter.user.phone_number
                    ? reporter.user.phone_number
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
                  multiline
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={
                    reporter.intro
                      ? reporter.intro
                      : '소개 글이 없습니다.'
                  }
                ></TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  캐치 프레이즈
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="subtitle2">
                  {reporter.catchPhrase
                    ? reporter.catchPhrase
                    : '캐치프레이즈가 없습니다.'}
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
                  {reporter.nickname
                    ? reporter.nickname
                    : '닉네임이 없습니다.'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  추천 우선 순위
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {reporter.tudalRecommendScore
                    ? `${reporter.tudalRecommendScore} 단계`
                    : '추천 우선 순위가 없습니다.'}
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
                  {`${moment(reporter?.created_at).format(
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
          {reporter.imageUrl ? (
            <img
              src={reporter.imageUrl}
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

export default CpReporterDetailPresenter;
