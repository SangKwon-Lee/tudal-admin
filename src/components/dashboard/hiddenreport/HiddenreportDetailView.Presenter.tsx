import { FC, useEffect, useState } from 'react';
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
} from '@material-ui/core';
import { Viewer } from '@toast-ui/react-editor';
import { SocialPostComment, SocialPostCommentAdd } from '../social';

import { IHiddenReportForm } from './HiddenreportCreate.Container';
import dayjs from 'dayjs';
import { IHR } from 'src/types/hiddenreport';

interface HiddenReportDetailViewPresenterProps {
  state: IHR | IHiddenReportForm;
  isCreating?: boolean;
  onSubmit?: () => Promise<void>;
  setStep?: (prev) => void;
}

const HiddenReportDetailViewPresenter: React.FC<HiddenReportDetailViewPresenterProps> =
  ({ state, onSubmit, setStep, isCreating }) => {
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
            <Box sx={{ maxHeight: '300px' }}>
              <img
                style={{
                  width: '300px',
                  height: '300px',
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
              리포트 내용
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
          {isCreating ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setStep(1)}
            >
              수정
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to={`/dashboard/hiddenreports/${state.id}/edit`}
            >
              수정
            </Button>
          )}
          <Button variant="contained" onClick={onSubmit}>
            제출
          </Button>
        </Box>
      </Box>
    );
  };

export default HiddenReportDetailViewPresenter;
