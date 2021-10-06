import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';

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

const WebEditor = (props) => {
  const { editorRef, contents } = props;
  return (
    <Editor
      ref={editorRef}
      initialValue={contents}
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
  );
};

export default WebEditor;
