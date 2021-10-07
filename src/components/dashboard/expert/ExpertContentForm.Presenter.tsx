import { Link as RouterLink } from 'react-router-dom';
import type { FC, FormEvent } from 'react';
import {
  Box,
  Button,
  Card,
  FormHelperText,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import WebEditor from 'src/components/common/WebEditor';
import { AxiosError } from 'axios';
import useAuth from 'src/hooks/useAuth';
import { Expert, Room } from 'src/types/expert';

interface newState {
  newExpert: Expert;
  loading: boolean;
  error: AxiosError<any> | boolean;
  isSubmitting: boolean;
}

interface IExpertContentFormProps {
  editorRef: React.MutableRefObject<any>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleChangeTitle: (e: any) => void;
  handleChangeRoom: (e: any) => void;
  isSubmitting: boolean;
  newState: newState;
}

const ExpertContentFormPresenter: FC<IExpertContentFormProps> = (
  props,
) => {
  const {
    editorRef,
    handleSubmit,
    handleChangeTitle,
    isSubmitting,
    handleChangeRoom,
    newState,
  } = props;

  const { error, newExpert } = newState;
  const { user } = useAuth();

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={{ p: 3 }}>
        <Typography color="textPrimary" variant="h6">
          달인 내용을 입력해주세요.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            helperText={'3글자 이상 입력하세요'}
            label="제목"
            name="title"
            onBlur={handleChangeTitle}
            onChange={handleChangeTitle}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            value={newExpert?.title || ''}
            variant="outlined"
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <TextField
            select
            fullWidth
            label={
              user.cp_rooms.length > 0
                ? '방 선택'
                : '방을 만들어주세요'
            }
            disabled={user?.cp_rooms.length > 0 ? false : true}
            name="room"
            value={user?.cp_rooms.id}
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={handleChangeRoom}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          >
            {user?.cp_rooms ? (
              user?.cp_rooms.map((room: Room) => (
                <option key={room.title} value={room.title}>
                  {room.title} ({room.openType})
                </option>
              ))
            ) : (
              <option>"방을 만들어주세요"</option>
            )}
          </TextField>
        </Box>
        <Paper sx={{ mt: 3 }} variant="outlined">
          <WebEditor
            editorRef={editorRef}
            contents={
              newExpert.contents
                ? newExpert.contents
                : newExpert.description
            }
          />
        </Paper>
        {error && (
          <Box sx={{ mt: 2 }}>
            <FormHelperText error>{FormHelperText}</FormHelperText>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            mt: 6,
          }}
        >
          <Button
            color="primary"
            size="large"
            variant="text"
            component={RouterLink}
            to={`/dashboard/expert`}
          >
            이전
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="primary"
            disabled={isSubmitting}
            type="submit"
            variant="contained"
          >
            완료
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default ExpertContentFormPresenter;
