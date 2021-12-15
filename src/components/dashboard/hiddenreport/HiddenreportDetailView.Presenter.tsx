import { Link as RouterLink } from 'react-router-dom';
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
  Dialog,
} from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import { IHiddenReportForm } from './HiddenreportCreate.Container';
import dayjs from 'dayjs';
import { IHR } from 'src/types/hiddenreport';
import {
  SocialPostComment,
  SocialPostCommentAdd,
} from 'src/components/dashboard/social';
import HiddenreportPreviewPresenter from './HiddenReportPreview.Presenter';
import { useState } from 'react';

interface HiddenReportDetailViewPresenterProps {
  state: IHR | IHiddenReportForm;
  isCreating?: boolean;
  onSubmit?: () => Promise<void>;
  writeComment?: (comment) => Promise<void>;
  setStep?: (prev) => void;
}

const HiddenReportDetailViewPresenter: React.FC<HiddenReportDetailViewPresenterProps> =
  ({ state, onSubmit, setStep, isCreating, writeComment }) => {
    const [isOpenPreview, setOpenPreview] = useState<boolean>(false);
    return (
      <Box sx={{ p: 10, pt: 2 }}>
        <Card>
          <Box
            style={{
              margin: '3px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <CardHeader title="리뷰" />
          </Box>
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
                  <Typography color="textSecondary" variant="body1">
                    {state.title}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    도입배경
                  </Typography>
                </TableCell>
                <TableCell>{state.intro}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    요약
                  </Typography>
                </TableCell>
                <TableCell>
                  <pre>{state.summary}</pre>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    이유
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body1">
                    {state.reason}
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
                    {state.price} GOLD
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
                    {state.catchphrase}
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
                    {`${dayjs(state.expirationDate).format(
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
                  <Typography color="textSecondary" variant="body2">
                    {state?.stocks.map(
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
                    {state?.tags.map((tag) => `#${tag.name} `)}
                  </Typography>
                </TableCell>
              </TableRow>
              {state.pdfUrl && (
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      PDF 파일
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{ mt: 1 }}
                    >
                      <a href={state.pdfUrl}>PDF</a>
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
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
            <Box sx={{ maxWidth: '300px' }}>
              <img
                style={{
                  width: '100%',
                  objectFit: 'cover',
                }}
                src={state.hidden_report_image.thumbnailImageUrl}
                alt=""
              />
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
            }}
          >
            <Typography color="textPrimary" variant="subtitle2">
              리포트 내용{' '}
              <Button onClick={() => setOpenPreview(!isOpenPreview)}>
                미리보기
              </Button>
            </Typography>
            <Box sx={{ py: 3 }}>
              <Container maxWidth="md">
                <Viewer initialValue={state.contents} />
              </Container>
            </Box>
          </Box>
        </Card>

        <Box
          style={{ display: 'flex', justifyContent: 'space-between' }}
          sx={{ mt: 3 }}
        >
          {isCreating && (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setStep(1)}
              >
                수정
              </Button>
              <Button variant="contained" onClick={onSubmit}>
                제출
              </Button>
            </>
          )}
        </Box>

        {/* 댓글 */}
        {!isCreating && 'hidden_report_comments' in state && (
          <SocialPostCommentAdd handleWriteComment={writeComment} />
        )}
        {!isCreating &&
          'hidden_report_comments' in state &&
          state.hidden_report_comments.map((comment) => (
            <SocialPostComment
              authorName={comment.userId}
              createdAt={comment.created_at}
              message={comment.comment}
              authorAvatar={''}
            />
          ))}

        <Dialog
          open={isOpenPreview}
          onClose={() => setOpenPreview(false)}
        >
          <HiddenreportPreviewPresenter
            contents={state.contents}
            title={state.title}
            nickname={state.hidden_reporter?.nickname}
          />
        </Dialog>
      </Box>
    );
  };

export default HiddenReportDetailViewPresenter;
