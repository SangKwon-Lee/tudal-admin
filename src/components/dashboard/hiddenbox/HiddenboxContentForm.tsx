import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
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

// import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
// import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
// import { Editor } from '@toast-ui/react-editor';

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

  // const editor = useRef(null);
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
        Body: blob,
      }).promise();
      const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${imageName}`;
      callback(imageUrl, imageName);
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      setIsSubmitting(true);

      if (editorRef.current) {
        console.log(editorRef.current);
        const contents = log();

        // const contents = editorRef.current
        //   .getInstance()
        //   .getMarkdown();
        setValues({
          ...values,
          contents: contents,
        });
        console.log(contents, '여기는 어디냐');

        const newHiddenbox = {
          ...values,
          tags: values.tags.map((tag) => tag.id),
          startDate: moment(values.startDate)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(values.endDate)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss'),
          publicDate: moment(values.publicDate).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          contents: contents,
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
          리포트 내용을 입력해주세요.
        </Typography>
        <Paper sx={{ mt: 3 }} variant="outlined">
          <Editor
            ref={editorRef}
            initialValue={values.contents}
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              //@ts-ignore
              selector: 'textarea',
              language: 'ko_KR',
              height: 500,
              menubar: false,
              automatic_uploads: true,
              paste_data_images: true,
              file_picker_types: 'file image media',
              file_picker_callback: function (cb, value, meta) {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                input.onchange = function () {
                  //@ts-ignore
                  var file = this.files[0];
                  var reader = new FileReader();

                  reader.onload = function () {
                    var id = 'blobid' + new Date().getTime();
                    //@ts-ignore
                    var blobCache =
                      //@ts-ignore
                      tinymce.activeEditor.editorUpload.blobCache;
                    //@ts-ignore
                    var base64 = reader.result.split(',')[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    // call the callback and populate the Title field with the file name
                    cb(blobInfo.blobUri(), { title: file.name });
                  };
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
                'fullscreen',
                'insertdatetime',
                'media',
                // 'table',
                'paste',
                'code',
                'help',
                'wordcount',
                'save',
              ],
              toolbar:
                'formatselect fontselect fontsizeselect |' +
                ' forecolor backcolor |' +
                ' bold italic underline strikethrough |' +
                ' alignjustify alignleft aligncenter alignright |' +
                ' bullist numlist |' +
                ' table tabledelete |' +
                ' link image' +
                'image,paste',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
          {/* <Editor
            ref={editor}
            initialValue={values.contents}
            previewStyle="vertical"
            height="400px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            hooks={{
              addImageBlobHook: handleUploadImage,
            }}
            //@ts-ignore
            plugins={[colorSyntax]}
          /> */}
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
