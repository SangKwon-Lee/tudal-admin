import {
  Card,
  LinearProgress,
  Typography,
  Table,
  Divider,
  TableBody,
  TableCell,
  TableRow,
  CardHeader,
  Box,
  Container,
} from '@material-ui/core';
import moment from 'moment';
import { Viewer } from '@toast-ui/react-editor';
import {
  GroupCommentCreateAction,
  GroupCommentCreateState,
} from './GroupCommentCreate.Container';
import { SocialPostComment, SocialPostCommentAdd } from '../social';

interface IGroupCommentCreateProps {
  dispatch: (params: GroupCommentCreateAction) => void;
  groupCommentCreateState: GroupCommentCreateState;
  handleWriteGroupComment: (comment: string) => Promise<void>;
  handleDeleteGroupComment: (commentId: number) => Promise<void>;
  handleUpdateGroupComment: (
    commentId: number,
    message: string,
  ) => Promise<void>;
}

const GroupCommentCreatePresente: React.FC<IGroupCommentCreateProps> =
  (props) => {
    const {
      dispatch,
      groupCommentCreateState,
      handleWriteGroupComment,
      handleDeleteGroupComment,
      handleUpdateGroupComment,
      ...other
    } = props;
    const { loading, group } = groupCommentCreateState;
    return (
      <>
        <Card {...other}>
          {loading && <LinearProgress />}
          <CardHeader title="그룹 상세내용" />
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
                    {group.name ? group.name : '이름이 없습니다.'}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    유저 ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {group.user_id
                      ? group.user_id
                      : '아이디가 없습니다.'}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    종목 번호
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {group.numStocks
                      ? group.numStocks
                      : '종목 번호가 없습니다.'}
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
                    {group.order ? group.order : '순서가 없습니다.'}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    공개여부
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {group.show ? '공개' : '비공개'}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color="textPrimary" variant="subtitle2">
                    프리미엄 여부
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {group.premium ? 'premium' : '없음'}
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
                    {`${moment(group?.created_at).format(
                      'YYYY년 M월 D일 HH:mm',
                    )}`}
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
              내용
            </Typography>
            <Box sx={{ py: 3 }}>
              <Container maxWidth="md">
                {group.description && (
                  <Viewer initialValue={group.description} />
                )}
              </Container>
            </Box>
          </Box>
        </Card>
        <Card sx={{ my: 3 }}>
          {loading && <LinearProgress />}
          <Box sx={{ p: 3 }}>
            <Typography color="inherit" variant="h6">
              투달 그룹 코멘트
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            {groupCommentCreateState.comments.length > 0 ? (
              groupCommentCreateState.comments.map((comment) => (
                <SocialPostComment
                  commentId={comment.id}
                  authorAvatar={String(comment.user.username)}
                  authorName={comment.user.nickname}
                  createdAt={comment.created_at}
                  key={comment.id}
                  message={comment.comment}
                  handleDeleteComment={handleDeleteGroupComment}
                  handleUpdateComment={handleUpdateGroupComment}
                />
              ))
            ) : (
              <Box ml={3} mt={3}>
                <Typography variant={'body1'}>
                  {'작성된 댓글이 없습니다.'}
                </Typography>
              </Box>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 3 }}>
            <SocialPostCommentAdd
              handleWriteComment={handleWriteGroupComment}
            />
          </Box>
        </Card>
      </>
    );
  };

export default GroupCommentCreatePresente;
