import { useRef, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  TextField,
  Tooltip
} from '@material-ui/core';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import useAuth from '../../../hooks/useAuth';
import { CMSURL } from '../../../lib/axios';

const SocialPostCommentAdd: FC = (props) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleAttach = (): void => {
    fileInputRef.current.click();
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex'
      }}
      {...props}
    > 
      {user.avatar && user.avatar.url ? (
        <Avatar
          src={`${CMSURL}${user.avatar.url}`}
          sx={{ mr: 1 }}
        />
      ) : null }
      <TextField
        fullWidth
        onChange={handleChange}
        placeholder="Leave a message"
        size="small"
        variant="outlined"
      />
      <Tooltip title="Send">
        <IconButton
          color={value ? 'primary' : 'default'}
          component={value ? 'button' : 'span'}
          disabled={!value}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Box sx={{ height: 24 }}>
        <Divider orientation="vertical" />
      </Box>
      <Tooltip title="Attach image">
        <IconButton
          edge="end"
          onClick={handleAttach}
        >
          <AddPhotoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Attach file">
        <IconButton
          edge="end"
          onClick={handleAttach}
        >
          <AttachFileIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <input
        hidden
        ref={fileInputRef}
        type="file"
      />
    </Box>
  );
};

export default SocialPostCommentAdd;
