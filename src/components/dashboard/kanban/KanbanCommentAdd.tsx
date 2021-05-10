import { useState } from 'react';
import type { FC, ChangeEvent, KeyboardEvent } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Avatar, Box, TextField } from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import { addComment } from '../../../slices/kanban';
import { useDispatch } from '../../../store';
import { CMSURL } from '../../../lib/axios';

interface KanbanCommentAddProps {
  cardId: string;
}

const KanbanCommentAdd: FC<KanbanCommentAddProps> = (props) => {
  const { cardId, ...other } = props;
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleKeyUp = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    try {
      if (event.code === 'Enter' && message) {
        await dispatch(addComment(cardId, message));
        setMessage('');
        enqueueSnackbar('Comment added', {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top'
          },
          variant: 'success'
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top'
        },
        variant: 'error'
      });
    }
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex'
      }}
      {...other}
    >
      {user.avatar && user.avatar.url ? (
        <Avatar
          src={`${CMSURL}${user.avatar.url}`}
          sx={{ mr: 2 }}
        />
      ) : null }
      <TextField
        fullWidth
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Write a comment..."
        size="small"
        value={message}
        variant="outlined"
      />
    </Box>
  );
};

KanbanCommentAdd.propTypes = {
  cardId: PropTypes.string.isRequired
};

export default KanbanCommentAdd;
