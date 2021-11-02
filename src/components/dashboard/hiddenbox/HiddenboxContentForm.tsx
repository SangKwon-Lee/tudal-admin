import { useState, useRef } from 'react';
import type { FC, FormEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  FormHelperText,
  Paper,
  Typography,
} from '@material-ui/core';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import WebEditor from 'src/components/common/WebEditor';
import moment from 'moment';
import { cmsServer } from '../../../lib/axios';

interface HiddenboxContentFormProps {
  onBack?: () => void;
  onComplete?: () => void;
  setValues?: (any) => void;
  values: any;
  mode: string;
}

const HiddenboxContentForm: FC<HiddenboxContentFormProps> = (
  props,
) => {
  const { onBack, onComplete, values, setValues, mode, ...other } =
    props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
  };

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
          contents: contents,
        });
        // console.log('여기', values.stocks);
        // console.log(
        //   '여기',
        //   values.stocks.map((el) => el.id),
        // );

        const newHiddenbox = {
          ...values,
          tags: values.tags.map((tag) => tag.id),
          stocks: values.stocks.map((stock) => stock.id),
          contents: contents,
          startDate: moment(values.startDate).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          endDate: moment(values.endDate).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          publicDate: moment(values.publicDate).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
        };

        if (mode === 'create') {
          const response = await cmsServer.post(
            '/hiddenboxes',
            newHiddenbox,
          );
          if (response.status === 200) {
            if (onComplete) {
              onComplete();
            }
          } else {
            return;
          }
        } else {
          const response = await cmsServer.put(
            `/hiddenboxes/${newHiddenbox.id}`,
            newHiddenbox,
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

  return (
    <form onSubmit={handleSubmit} {...other}>
      <Card sx={{ p: 3 }}>
        <Typography color="textPrimary" variant="h6">
          히든박스 내용을 입력해주세요.
        </Typography>
        <Typography color="textPrimary" variant="h6">
          판매 시작 이후 내용을 수정할 수 없습니다.
        </Typography>
        <Typography color="textPrimary" variant="h6">
          판매 시작 이후 추가 내용은 댓글로 작성해주세요.
        </Typography>
        <Paper sx={{ mt: 3 }} variant="outlined">
          <WebEditor
            editorRef={editorRef}
            contents={values.contents}
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
          {onBack && (
            <Button
              color="primary"
              onClick={onBack}
              size="large"
              variant="text"
            >
              이전
            </Button>
          )}
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

HiddenboxContentForm.propTypes = {
  onBack: PropTypes.func,
  onComplete: PropTypes.func,
};

export default HiddenboxContentForm;
