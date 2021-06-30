import { useState, useRef } from 'react';
import type { FC, FormEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  FormHelperText,
  Paper,
  Typography
} from '@material-ui/core';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import moment from 'moment';
import { apiServer } from '../../../lib/axios';

const AWS = require('aws-sdk');
const fs = require('fs');
const region = 'ap-northeast-2';
const access_key = 'AKIAY53UECMD2OMWX4UR';
const secret_key = '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';

const S3 = new AWS.S3({
    region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});
const bucket_name = 'hiddenbox-photo';

interface HiddenboxContentFormProps {
  onBack?: () => void;
  onComplete?: () => void;
  setValues?: (any) => void;
  values: any;
  mode: string;
}

const HiddenboxContentForm: FC<HiddenboxContentFormProps> = (props) => {
  const { onBack, onComplete, values, setValues, mode, ...other } = props;
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const editor = useRef(null);

  const handleUploadImage = async (blob, callback) => {
    /* 
      blob: {
        lastModified: 1565934119000,
        lastModifiedDate: Fri Aug 16 2019 14:41:59 GMT+0900 (대한민국 표준시) {},
        name: "스크린샷 2019-08-16 오후 2.41.53.png",
        size: 124076,
        type: "image/png",
        webkitRelativePath: ""
      }
    */
    const regexp = /(?:\.([^.]+))?$/;
    const ext = regexp.exec(blob.name)[1];
    const imageName = `hb-${moment().format('YYYYMMDDHHmmss')}.${ext}`;
    
    try{
      // Koscom Cloud에 업로드하기
      await S3.putObject({
          Bucket: bucket_name,
          Key: imageName,
          ACL: 'public-read',
          // ACL을 지우면 전체공개가 되지 않습니다.
          Body: blob
      }).promise()
      const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${imageName}`
      callback(imageUrl, imageName);
    } catch(error){
      return false;
    }
  }

  const handleChange = (value: string): void => {
    setContent(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      if( editor.current ){
        const contents = editor.current.getInstance().getMarkdown()
        setValues({
          ...values,
          contents: contents,
        })

        const newHiddenbox = {
          ...values,
          contents: contents,
          startDate: moment(values.startDate).utc().format("YYYY-MM-DD HH:mm:ss"),
          endDate: moment(values.endDate).utc().format("YYYY-MM-DD HH:mm:ss"),
          publicDate: moment(values.publicDate).format("YYYY-MM-DD HH:mm:ss")
        }

        if( mode === 'create' ){
          const response = await apiServer.post('/hiddenbox/new', newHiddenbox);
          if( response.status === 200 ){
            if (onComplete) {
              onComplete();
            }
          } else {
            return;
          }
        } else {
          const response = await apiServer.put(`/hiddenbox/update/${newHiddenbox.id}`, newHiddenbox);
          if( response.status === 200 ){
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
    <form
      onSubmit={handleSubmit}
      {...other}
    >
      <Card sx={{ p: 3 }}>
        <Typography
          color="textPrimary"
          variant="h6"
        >
          리포트 내용을 입력해주세요.
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          에디터에서 작성 타입을 'Markdown'으로 변경하실 수도 있습니다.
        </Typography>
        <Paper
          sx={{ mt: 3 }}
          variant="outlined"
        >
          <Editor
            ref={editor}
            initialValue={values.contents}
            previewStyle="vertical"
            height="400px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            hooks={{
              addImageBlobHook: handleUploadImage
            }}
            plugins={[colorSyntax]}
          />
        </Paper>
        {error && (
          <Box sx={{ mt: 2 }}>
            <FormHelperText error>
              {FormHelperText}
            </FormHelperText>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            mt: 6
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
  onComplete: PropTypes.func
};

export default HiddenboxContentForm;
