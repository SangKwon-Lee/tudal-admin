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
import productStatusFunc from 'src/utils/productStatus';
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

  const productStatus = productStatusFunc(values, mode);

  // const editor = useRef(null);
  // const handleUploadImage = async (blob) => {
  //   /*
  //     blob: {
  //       lastModified: 1565934119000,
  //       lastModifiedDate: Fri Aug 16 2019 14:41:59 GMT+0900 (대한민국 표준시) {},
  //       name: "스크린샷 2019-08-16 오후 2.41.53.png",
  //       size: 124076,
  //       type: "image/png",
  //       webkitRelativePath: ""
  //     }
  //   */
  //   const regexp = /(?:\.([^.]+))?$/;
  //   const ext = regexp.exec(blob);
  //   const imageName = `hb-${moment().format(
  //     'YYYYMMDDHHmmss',
  //   )}.${ext}`;

  //   try {
  //     // Koscom Cloud에 업로드하기!
  //     await S3.putObject({
  //       Bucket: bucket_name,
  //       Key: imageName,
  //       ACL: 'public-read',
  //       // ACL을 지우면 전체공개가 되지 않습니다.
  //       Body: blob,
  //     }).promise();
  //     const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${imageName}`;
  //     // callback(imageUrl, imageName);
  //   } catch (error) {
  //     return false;
  //   }
  // };

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
        console.log('여기', values.stocks);
        console.log(
          '여기',
          values.stocks.map((el) => el.id),
        );

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
