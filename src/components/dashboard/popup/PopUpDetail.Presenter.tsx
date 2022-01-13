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
  Button,
  Dialog,
} from '@material-ui/core';
import dayjs from 'dayjs';
import Label from 'src/components/widgets/Label';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import {
  PopUpDetailAction,
  PopUpDetailActionKind,
  PopUpDetailState,
} from './PopUpDetail.Container';

interface PopUpDetailProps {
  PopUpDetailState: PopUpDetailState;
  handleDeletePopUp: () => Promise<void>;
  dispatch: (params: PopUpDetailAction) => void;
}
const PopUpDetailPresenter: React.FC<PopUpDetailProps> = (props) => {
  const { PopUpDetailState, handleDeletePopUp, dispatch, ...other } =
    props;

  console.log('here', props);
  const { loading, popUp, openModal, targetDetail } =
    PopUpDetailState;

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
                  종류
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {popUp.target}
                </Typography>
              </TableCell>
            </TableRow>
            {popUp.target !== 'premium' && (
              <>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      정보
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="body2">
                      {`${targetDetail.value} / ${targetDetail.subValue} `}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
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
              </>
            )}

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
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
            padding: '15px',
          }}
        >
          <Dialog
            aria-labelledby="ConfirmModal"
            open={openModal}
            onClose={() => {
              dispatch({
                type: PopUpDetailActionKind.MODAL_CLOSE,
              });
            }}
          >
            <ConfirmModal
              title={'팝업을 삭제 하시겠습니까?'}
              content={''}
              type={'ERROR'}
              confirmTitle={'삭제'}
              handleOnClick={handleDeletePopUp}
              handleOnCancel={() => {
                dispatch({
                  type: PopUpDetailActionKind.MODAL_CLOSE,
                });
              }}
            />
          </Dialog>
          <Button
            sx={{ justifySelf: 'end' }}
            color="secondary"
            variant="contained"
            onClick={() => {
              dispatch({
                type: PopUpDetailActionKind.MODAL_OPEN,
              });
            }}
          >
            삭제하기
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default PopUpDetailPresenter;
