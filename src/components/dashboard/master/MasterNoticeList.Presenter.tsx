import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  LinearProgress,
  Pagination,
} from '@material-ui/core';
// import ArrowRightIcon from 'src/icons/ArrowRight';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from 'src/icons/Search';
import TrashIcon from 'src/icons/Trash';
import Scrollbar from 'src/components/layout/Scrollbar';
import PencilAltIcon from 'src/icons/PencilAlt';
import { IMasterNotice } from 'src/types/master';
import dayjs from 'dayjs';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
interface IMasterNoticeProps {
  page: number;
  modalOpen: boolean;
  loading: boolean;
  noticeList: IMasterNotice[];
  noticeLength: number;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  handleDeleteNotice: () => void;
  handleChangeQuery: (e: any) => void;
  handleSaveNoticeId: (e: number) => void;
  handleChangePage: (page: number) => void;
}

const MasterNoticeListPresenter: React.FC<IMasterNoticeProps> = ({
  noticeList,
  loading,
  handleChangeQuery,
  page,
  handleChangePage,
  noticeLength,
  modalOpen,
  handleModalOpen,
  handleModalClose,
  handleSaveNoticeId,
  handleDeleteNotice,
}) => {
  return (
    <>
      <Card sx={{ my: 3 }}>
        {loading && <LinearProgress />}
        <Box
          sx={{
            flexDirection: 'column',
            display: 'flex',
            m: -1,
            p: 2,
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 500,
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={(event) => {
                handleChangeQuery(event);
              }}
              placeholder="공지 검색"
              variant="outlined"
            />
          </Box>
          <Scrollbar>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>제목</TableCell>
                    <TableCell>작성일</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading &&
                    noticeList.map((notice) => {
                      return (
                        <TableRow hover key={notice.id}>
                          <TableCell>
                            <Box
                              sx={{
                                alignItems: 'center',
                                display: 'flex',
                              }}
                            >
                              <Box sx={{ ml: 1, maxWidth: '150px' }}>
                                <Link
                                  color="inherit"
                                  component={RouterLink}
                                  to={`/dashboard/master/${notice.id}`}
                                  variant="subtitle2"
                                >
                                  {notice.title
                                    ? notice.title
                                    : '제목이 없습니다.'}
                                </Link>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell
                            style={{
                              maxWidth: '180px',
                              minWidth: '180px',
                            }}
                          >
                            {`${dayjs(notice.created_at).format(
                              'YYYY년 M월 D일 HH:mm',
                            )}`}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              component={RouterLink}
                              to={`/dashboard/master/notice/${notice.id}/edit`}
                            >
                              <PencilAltIcon fontSize="small" />
                            </IconButton>
                            {/* <IconButton
                              component={RouterLink}
                              to={`/dashboard/master/${notice.id}`}
                            >
                              <ArrowRightIcon fontSize="small" />
                            </IconButton> */}

                            <IconButton
                              onClick={() => {
                                handleModalOpen();
                                handleSaveNoticeId(notice.id);
                              }}
                            >
                              <TrashIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
          <Pagination
            size="small"
            color="primary"
            sx={{ m: 1 }}
            page={page}
            count={Math.ceil(noticeLength / 20)}
            variant="text"
            onChange={(event, page) => {
              handleChangePage(page);
            }}
          />
        </Box>
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={modalOpen}
        onClose={() => handleModalClose()}
      >
        <ConfirmModal
          title={'정말 삭제하시겠습니까?'}
          content={'삭제시 큰 주의가 필요합니다.'}
          confirmTitle={'삭제'}
          handleOnClick={handleDeleteNotice}
          handleOnCancel={() => {
            handleModalClose();
          }}
        />
      </Dialog>
    </>
  );
};

export default MasterNoticeListPresenter;
