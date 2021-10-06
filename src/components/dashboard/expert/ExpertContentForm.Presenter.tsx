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

const roomOptions = [
  {
    name: '공개방',
  },
  {
    name: '어낭픽',
  },
  {
    name: '연금픽',
  },
];

interface IExpertContentFormProps {
  editorRef: React.MutableRefObject<any>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (e: any) => void;
  error: string;
  isSubmitting: boolean;
  values: any;
}

const ExpertContentFormPresenter: FC<IExpertContentFormProps> = (
  props,
) => {
  const {
    editorRef,
    handleSubmit,
    handleChange,
    values,
    error,
    isSubmitting,
  } = props;

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
            onBlur={handleChange}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            value={values.title || ''}
            variant="outlined"
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <TextField
            select
            fullWidth
            label="방 선택"
            name="room"
            value={values.room || ''}
            SelectProps={{ native: true }}
            variant="outlined"
            onChange={handleChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          >
            {roomOptions.map((roomOptions) => (
              <option key={roomOptions.name} value={roomOptions.name}>
                {roomOptions.name}
              </option>
            ))}
          </TextField>
        </Box>
        <Paper sx={{ mt: 3 }} variant="outlined">
          <WebEditor
            editorRef={editorRef}
            contents={values.description}
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
