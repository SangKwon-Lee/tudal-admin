import {
  Card,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CardHeader,
  Typography,
  Box,
} from '@material-ui/core';
import dayjs from 'dayjs';
import Label from 'src/components/widgets/Label';
import { PopUpDetailState } from './PopUpDetail.Container';

interface PopUpDetailProps {
  PopUpDetailState: PopUpDetailState;
}
const PopUpDetailPresenter: React.FC<PopUpDetailProps> = (props) => {
  const { PopUpDetailState, ...other } = props;
  const { loading, popUp } = PopUpDetailState;
  return (
    <>
      <Card {...other}>
        {loading && (
          <div data-testid="news-list-loading">
            <LinearProgress />
          </div>
        )}
        <CardHeader title="팝업 상세내용" />
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
                  {popUp.title ? popUp.title : '제목이 없습니다'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  팝업 설명
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {popUp.description
                    ? popUp.description
                    : '설명이 없습니다'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  순서
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {popUp.order ? (
                    popUp.order
                  ) : (
                    <Label color="error">비공개</Label>
                  )}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  공개 여부
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {popUp.isOpen ? (
                    <Label color="success">공개</Label>
                  ) : (
                    <Label color="error">비공개</Label>
                  )}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  링크
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {popUp.link ? popUp.link : '링크가 없습니다.'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  링크 설명
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {popUp.linkDescription
                    ? popUp.linkDescription
                    : '링크 설명이 없습니다.'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  공개일
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {popUp.openTime
                    ? `${dayjs(popUp.openTime).format(
                        'YYYY년 M월 D일 HH:mm',
                      )}`
                    : '공개일이 없습니다.'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  종료일
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {popUp.closeTime
                    ? `${dayjs(popUp.closeTime).format(
                        'YYYY년 M월 D일 HH:mm',
                      )}`
                    : '종료일이 없습니다.'}
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
            이미지
          </Typography>

          <Box sx={{ py: 3 }}>
            <img
              style={{ width: '100%' }}
              alt="이미지"
              src={popUp.image ? popUp.image : ''}
            ></img>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default PopUpDetailPresenter;
