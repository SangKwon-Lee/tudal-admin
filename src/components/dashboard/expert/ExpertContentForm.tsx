import { useState, useRef } from 'react';
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
import { cmsServer } from '../../../lib/axios';
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

interface ExpertFormProps {
  onComplete?: () => void;
  setValues?: (any) => void;
  values: any;
  mode: string;
}
const ExpertboxContentForm: FC<ExpertFormProps> = (props) => {
  const { mode, values, onComplete, setValues } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //* 웹 에디터에 전달되는 Props
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
  };

  //* Submit
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      setIsSubmitting(true);

      if (editorRef.current) {
        const contents = log();
        setValues({
          ...values,
          description: contents,
        });
        const newExpert = {
          ...values,
          description: contents,
        };
        if (mode === 'create') {
          const response = await cmsServer.post(
            '/expert-feeds',
            newExpert,
          );
          console.log(response);
          if (response.status === 200) {
            if (onComplete) {
              onComplete();
            }
          } else {
            return;
          }
        } else {
          const response = await cmsServer.put(
            `/expert-feeds/${newExpert.id}`,
            newExpert,
          );
          if (response.status === 200) {
            if (onComplete) {
              onComplete();
            }
          } else {
            return;
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //* 타이틀, 방 변경
  const handleChange = (e: any) => {
    let newInput = {
      ...values,
      [e.target.name]: e.target.value,
    };
    setValues(newInput);
  };

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
            value={values.title}
            variant="outlined"
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <TextField
            select
            fullWidth
            label="방 선택"
            name="room"
            value={values.room}
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
          <WebEditor editorRef={editorRef} />
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
            to={`/dashboard/experts`}
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

export default ExpertboxContentForm;
