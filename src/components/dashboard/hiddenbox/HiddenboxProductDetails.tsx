import { FC, useEffect, useState } from 'react';
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
} from '@material-ui/core';
import Label from '../../widgets/Label';
import type { Hiddenbox } from '../../../types/hiddenbox';
import moment from 'moment';
import axios, { CMSURL } from '../../../lib/axios';
import { Viewer } from '@toast-ui/react-editor';
import { SocialPostComment, SocialPostCommentAdd } from '../social';
import productStatusFunc from 'src/utils/productStatus';

interface HiddenboxProductDetails {
  hiddenbox: Hiddenbox;
  orders: number;
}

// const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
//   color: theme.palette.text.primary,
//   fontFamily: theme.typography.fontFamily,
//   '& h2': {
//     fontSize: theme.typography.h2.fontSize,
//     fontWeight: theme.typography.fontWeightBold,
//     lineHeight: theme.typography.h2.lineHeight,
//     marginBottom: theme.spacing(3),
//   },
//   '& h3': {
//     fontSize: theme.typography.h3.fontSize,
//     fontWeight: theme.typography.fontWeightBold,
//     lineHeight: theme.typography.h3.lineHeight,
//     marginBottom: theme.spacing(3),
//   },
//   '& p': {
//     fontSize: theme.typography.body1.fontSize,
//     lineHeight: theme.typography.body1.lineHeight,
//     marginBottom: theme.spacing(2),
//   },
//   '& li': {
//     fontSize: theme.typography.body1.fontSize,
//     lineHeight: theme.typography.body1.lineHeight,
//     marginBottom: theme.spacing(1),
//   },
// }));

// eslint-disable-next-line @typescript-eslint/no-redeclare
const HiddenboxProductDetails: FC<HiddenboxProductDetails> = (
  props,
) => {
  const { hiddenbox, orders, ...other } = props;

  const productStatus = productStatusFunc(hiddenbox);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `/hiddenbox-comments?hiddenboxId=${hiddenbox.id}`,
      );
      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (e) {
    } finally {
    }
  };

  const handleWriteComment = async (message: string) => {
    try {
      const newComment = {
        hiddenboxId: hiddenbox.id,
        author: hiddenbox.author.id,
        message,
      };
      const response = await axios.post(
        `/hiddenbox-comments`,
        newComment,
      );
      if (response.status === 200) {
        fetchComments();
      }
    } catch (e) {
    } finally {
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await axios.delete(
        `/hiddenbox-comments/${commentId}`,
      );
      if (response.status === 200) {
        fetchComments();
      }
    } catch (e) {
    } finally {
    }
  };

  const handleUpdateComment = async (
    commentId: number,
    message: string,
  ) => {
    try {
      const response = await axios.put(
        `/hiddenbox-comments/${commentId}`,
        { message },
      );
      if (response.status === 200) {
        fetchComments();
      }
    } catch (e) {
    } finally {
    }
  };
  return (
    <>
      <Card {...other}>
        <CardHeader title="히든박스 상품정보" />
        <Divider />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  상품명
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {hiddenbox.title}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  판매 상태
                </Typography>
              </TableCell>
              <TableCell>
                <Label
                  color={
                    productStatus[0] === 'onSale'
                      ? 'success'
                      : 'error'
                  }
                >
                  {productStatus[1]}
                </Label>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  작성자
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {`${hiddenbox.author.nickname}(${hiddenbox.author.email})`}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  상품설명
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {hiddenbox.description}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  상품 가격
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {hiddenbox.productId}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  판매량
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {orders}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  판매일
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {`${moment(hiddenbox.startDate).format(
                    'YYYY년 M월 D일 HH:mm',
                  )} - ${moment(hiddenbox.endDate).format(
                    'YYYY년 M월 D일 HH:mm',
                  )}`}
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
                  {`${moment(hiddenbox.publicDate).format(
                    'YYYY년 M월 D일 HH:mm',
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
                  {hiddenbox?.stocks.map(
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
                  {hiddenbox?.tags.map((tag) => `#${tag.name} `)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  좋아요
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {hiddenbox.likes.length}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  조회수
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {hiddenbox.viewCount ? hiddenbox.viewCount : 0}
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
              <Viewer initialValue={hiddenbox.contents} />
            </Container>
          </Box>
        </Box>
      </Card>
      <Card
        sx={{
          mt: 4,
        }}
      >
        <Box
          sx={{
            py: 3,
            px: 3,
          }}
        >
          <Box sx={{ pb: 3 }}>
            <Typography color="inherit" variant="h5">
              히든박스 코멘트
            </Typography>
          </Box>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <SocialPostComment
                commentId={comment.id}
                authorAvatar={
                  comment.author.avatar
                    ? `${CMSURL}${comment.author.avatar.url}`
                    : ''
                }
                authorName={comment.author.nickname}
                createdAt={comment.created_at}
                key={comment.id}
                message={comment.message}
                handleDeleteComment={handleDeleteComment}
                handleUpdateComment={handleUpdateComment}
              />
            ))
          ) : (
            <Box ml={3} mt={3}>
              <Typography variant={'body1'}>
                {'작성된 댓글이 없습니다.'}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <SocialPostCommentAdd
            handleWriteComment={handleWriteComment}
          />
        </Box>
      </Card>
    </>
  );
};

export default HiddenboxProductDetails;
