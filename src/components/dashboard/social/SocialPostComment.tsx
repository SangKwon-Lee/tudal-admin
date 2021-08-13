import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Link,
  Typography,
  IconButton,
} from '@material-ui/core';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';

interface SocialPostCommentProps {
  commentId?: number;
  authorAvatar: string;
  authorName: string;
  createdAt: number;
  message: string;
  handleDeleteComment?: (commentId: number) => Promise<void>;
}

const SocialPostComment: FC<SocialPostCommentProps> = (props) => {
  const {
    commentId,
    authorAvatar,
    authorName,
    createdAt,
    message,
    handleDeleteComment,
    ...other
  } = props;

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
        </Box>
        <Typography color="textPrimary" variant="body2">
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

SocialPostComment.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
};

export default SocialPostComment;
