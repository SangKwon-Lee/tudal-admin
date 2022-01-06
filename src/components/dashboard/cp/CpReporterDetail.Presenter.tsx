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
} from '@material-ui/core';
import dayjs from 'dayjs';
import { CpReporterDetailState } from './CpReporterDetail.Container';
import { Link as RouterLink } from 'react-router-dom';
import { Viewer } from '@toast-ui/react-editor';
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
          sx={{ mx: 10 }}
          component={RouterLink}
          to={`/dashboard/cp/${reporter.id}/edit/reporter`}
        >
          내용 수정
        </Button>
      </Box>
      <Card sx={{ mt: 2, mx: 10 }}>
        {loading && <LinearProgress />}
        <CardHeader sx={{ m: 1 }} title="히든 리포터 상세내용" />
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
                  {reporter?.user?.username
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
                  {reporter?.user?.contact_email
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
                  {reporter?.user?.phone_number
                    ? reporter.user.phone_number
                    : '전화번호가 없습니다.'}
                </Typography>
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
                  {reporter?.catchphrase
                    ? reporter.catchphrase
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
                  {reporter?.nickname
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
                  {reporter?.tudalRecommendScore
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
                  {`${dayjs(reporter?.created_at).format(
                    'YYYY년 M월 D일 HH:mm',
                  )}`}
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
                {reporter.intro && (
                  <Viewer initialValue={reporter.intro} />
                )}
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
          {reporter?.imageUrl ? (
            <img
              src={reporter.imageUrl}
              style={{ borderRadius: '50%', width: '100px' }}
              alt="프로필이미지"
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
