import { FC, useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Link,
  Typography,
  IconButton,
  TextField,
  Button,
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
            onClick={() => handleDeleteComment(commentId)}
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
          <pre>{message}</pre>
        ) : (
          <>
            <TextField
              value={updateMessage}
              multiline
              onChange={(e) => setUpdateMessage(e.target.value)}
            />
            <Button onClick={_handleUpdateComment}>수정</Button>
            <Button onClick={() => setIsUpdate(false)}>취소</Button>
          </>
        )}
      </Box>
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
