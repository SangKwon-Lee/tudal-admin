import { FC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Link,
  Typography,
  IconButton,
  Dialog,
  TextField,
  Button,
  Card,
} from '@material-ui/core';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
interface SocialPostCommentProps {
  commentId?: number;
  authorAvatar: string;
  authorName: string;
  createdAt: string;
  message: string;
  handleDeleteComment?: (commentId: number) => Promise<void>;
  handleUpdateComment?: (
    commentId: number,
    message: string,
  ) => Promise<void>;
}

const SocialPostComment: FC<SocialPostCommentProps> = (props) => {
  const {
    commentId,
    authorAvatar,
    authorName,
    createdAt,
    message,
    handleDeleteComment,
    handleUpdateComment,
    ...other
  } = props;

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string>(message);
  const [open, setOpen] = useState<boolean>(false);

  const _handleUpdateComment = () => {
    handleUpdateComment(commentId, updateMessage);
    setIsUpdate(false);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
      }}
      {...other}
    >
      <Avatar component={RouterLink} src={authorAvatar} to="#" />
      <Box
        sx={{
          backgroundColor: 'background.default',
          borderRadius: 1,
          flexGrow: 1,
          ml: 2,
          p: 2,
          pt: 0,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mb: 1,
          }}
        >
          <Link
            color="textPrimary"
            component={RouterLink}
            to="#"
            variant="subtitle2"
          >
            {authorName}
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Typography color="textSecondary" variant="caption">
            {moment(createdAt).fromNow()}
          </Typography>
          <IconButton
            color={'default'}
            component={'button'}
            onClick={() => setOpen(true)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          {handleUpdateComment && (
            <IconButton
              color={'default'}
              component={'button'}
              onClick={() => setIsUpdate(true)}
            >
              <BuildIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        {!isUpdate ? (
          <Box>{message}</Box>
        ) : (
          <>
            <TextField
              sx={{
                width: '100%',
              }}
              value={updateMessage}
              multiline
              onChange={(e) => setUpdateMessage(e.target.value)}
            />
            <Button onClick={_handleUpdateComment}>수정</Button>
            <Button onClick={() => setIsUpdate(false)}>취소</Button>
          </>
        )}
      </Box>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Card
          sx={{
            width: '300px',
            display: 'flex',
            padding: 3,
            flexDirection: 'column',
          }}
        >
          <Typography>정말 삭제하시겠습니까?</Typography>
          <Box sx={{ mt: 3, alignSelf: 'end' }}>
            <Button
              color="primary"
              sx={{ mr: 2 }}
              variant="outlined"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button
              sx={{
                '&:hover': {
                  backgroundColor: 'error.dark',
                },
              }}
              variant="contained"
              onClick={() => handleDeleteComment(commentId)}
            >
              삭제
            </Button>
          </Box>
        </Card>
      </Dialog>
    </Box>
  );
};

SocialPostComment.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default SocialPostComment;
