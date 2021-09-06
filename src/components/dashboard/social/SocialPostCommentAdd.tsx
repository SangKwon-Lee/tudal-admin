import { useRef, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  TextField,
  Tooltip,
} from '@material-ui/core';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import useAuth from '../../../hooks/useAuth';
import { CMSURL } from '../../../lib/axios';

interface SocialPostCommentAddProps {
  handleWriteComment?: (message: string) => void;
}

const SocialPostCommentAdd: FC<SocialPostCommentAddProps> = (
  props,
) => {
  const { handleWriteComment, ...others } = props;
  const { user } = useAuth();
  const [value, setValue] = useState<string>('');

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setValue(event.target.value);
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
      }}
      {...others}
    >
      {user.avatar && user.avatar.url ? (
        <Avatar src={`${CMSURL}${user.avatar.url}`} sx={{ mr: 1 }} />
      ) : null}
      <TextField
        fullWidth
        multiline
        onChange={handleChange}
        placeholder="댓글을 적어주세요."
        size="small"
        variant="outlined"
        value={value}
      />
      <Tooltip title="Send">
        <IconButton
          color={value ? 'primary' : 'default'}
          component={value ? 'button' : 'span'}
          onClick={() => {
            handleWriteComment(value);
          }}
          disabled={!value}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SocialPostCommentAdd;
