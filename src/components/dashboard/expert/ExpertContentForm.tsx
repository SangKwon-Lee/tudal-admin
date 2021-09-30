import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
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
import moment from 'moment';
import { cmsServer } from '../../../lib/axios';

const AWS = require('aws-sdk');
const region = 'ap-northeast-2';
const access_key = 'AKIAY53UECMD2OMWX4UR';
const secret_key = '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';

const S3 = new AWS.S3({
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});
const bucket_name = 'hiddenbox-photo';

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

const ExpertboxContentForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    title: '',
    room: '',
  });
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
        // if (mode === 'create') {
        //   const response = await cmsServer.post(
        //     '/hiddenboxes',
        //     newHiddenbox,
        //   );
        //   if (response.status === 200) {
        //     if (onComplete) {
        //       onComplete();
        //     }
        //   } else {
        //     return;
        //   }
        // } else {
        //   const response = await cmsServer.put(
        //     `/hiddenboxes/${newHiddenbox.id}`,
        //     newHiddenbox,
        //   );
        //   if (response.status === 200) {
        //     if (onComplete) {
        //       onComplete();
        //     }
        //   } else {
        //     return;
        //   }
        // }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: any) => {
    let newInput = {
      ...values,
    };
    newInput = {
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
          <Editor
            ref={editorRef}
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              //@ts-ignore
              selector: 'textarea',
              language: 'ko_KR',
              height: 500,
              menubar: false,
              paste_as_text: true,
              automatic_uploads: true,
              paste_data_images: true,
              file_picker_types: 'file image media',
              images_upload_handler: async function (
                blobInfo,
                success,
                failure,
              ) {
                try {
                  // Koscom Cloud에 업로드하기!
                  await S3.putObject({
                    Bucket: bucket_name,
                    Key: blobInfo.filename(),
                    ACL: 'public-read',
                    // ACL을 지우면 전체공개가 되지 않습니다.
                    Body: blobInfo.blob(),
                  }).promise();
                  const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${blobInfo.filename()}`;
                  success(imageUrl);
                } catch (error) {
                  return false;
                }
              },
              file_picker_callback: function (cb, value, meta) {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = async function () {
                  //@ts-ignore
                  var file = this.files[0];
                  const regexp = /(?:\.([^.]+))?$/;
                  const ext = regexp.exec(file);
                  const imageName = `hb-${moment().format(
                    'YYYYMMDDHHmmss',
                  )}.${ext}`;

                  try {
                    // Koscom Cloud에 업로드하기!
                    await S3.putObject({
                      Bucket: bucket_name,
                      Key: imageName,
                      ACL: 'public-read',
                      // ACL을 지우면 전체공개가 되지 않습니다.
                      Body: file,
                    }).promise();
                    const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${imageName}`;
                    cb(imageUrl, { title: imageName });
                  } catch (error) {
                    return false;
                  }
                  var reader = new FileReader();
                  reader.readAsDataURL(file);
                };
                input.click();
              },
              browser_spellcheck: true,
              block_unsupported_drop: true,
              image_title: true,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image,paste',
                'image',
                'charmap',
                'print',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'table',
                'fullscreen',
                'insertdatetime',
                'media',
                'paste',
                'code',
                'help',
                'wordcount',
                'paste',
                'save',
              ],
              toolbar:
                'formatselect fontselect fontsizeselect |' +
                ' forecolor backcolor |' +
                ' bold italic underline strikethrough |' +
                ' alignjustify alignleft aligncenter alignright |' +
                ' bullist numlist |' +
                ' table tabledelete |' +
                ' link image |' +
                ' paste |' +
                ' image,paste |',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
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
