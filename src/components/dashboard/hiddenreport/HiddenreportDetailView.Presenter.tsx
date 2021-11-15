import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Container,
  Button,
} from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import { HiddenReportCreateState } from './HiddenreportCreate.Container';
import dayjs from 'dayjs';

interface HiddenReportDetailViewPresenterProps {
  state: HiddenReportCreateState;
  onSubmit: () => Promise<void>;
  setStep: (prev) => void;
}

const HiddenReportDetailViewPresenter: React.FC<HiddenReportDetailViewPresenterProps> =
  ({ state, onSubmit, setStep }) => {
    const handleEdit = () => setStep(1);
    const { newReport } = state;
    return (
      <Box sx={{ pt: 2 }}>
        <Card>
          <CardHeader title="리뷰" />
          <Divider />
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    제목
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {newReport.title}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    도입배경
                  </Typography>
                </TableCell>
                <TableCell>{newReport.intro}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    요약
                  </Typography>
                </TableCell>
                <TableCell>
                  <pre>{newReport.summary}</pre>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    이유
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {newReport.reason}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    가격
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {newReport.price} GOLD
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
                    {newReport.catchphrase}
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    만료일
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {`${dayjs(newReport.expirationDate).format(
                      'YYYY년 M월 D일',
                    )}`}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    종목
                  </Typography>
                </TableCell>
                <TableCell>
                  {console.log(newReport)}
                  <Typography color="textSecondary" variant="body2">
                    {newReport?.stocks.map(
                      (stock) => `${stock.name}(${stock.code})\n`,
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    태그
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {newReport?.tags.map((tag) => `#${tag.name} `)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
            }}
          >
            <Typography color="textPrimary" variant="subtitle2">
              리포트 내용
            </Typography>
            <Box sx={{ py: 3 }}>
              <Container maxWidth="md">
                <Viewer initialValue={newReport.contents} />
              </Container>
            </Box>
          </Box>
        </Card>
        <Box
          style={{ display: 'flex', justifyContent: 'space-between' }}
          sx={{ mt: 3 }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEdit}
          >
            수정
          </Button>
          <Button variant="contained" onClick={onSubmit}>
            제출
          </Button>
        </Box>
      </Box>
    );
  };

export default HiddenReportDetailViewPresenter;
